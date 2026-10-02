/* ==========================================================================
   SHIKSHA SETU - QUIZZES CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function getAllQuizzes(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, quiz_key, title, timer_seconds, subject_id, lesson_id, published
       FROM quizzes WHERE published = TRUE ORDER BY id`
    );
    res.json({ quizzes: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getQuiz(req, res, next) {
  try {
    const { quiz_key } = req.params;

    const quizRes = await db.query(
      `SELECT id, quiz_key, title, timer_seconds FROM quizzes WHERE quiz_key = $1 AND published = TRUE`,
      [quiz_key]
    );

    if (quizRes.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    const quiz = quizRes.rows[0];
    const questionsRes = await db.query(
      `SELECT id, question, options, correct_index, explanation, display_order
       FROM quiz_questions WHERE quiz_id = $1 ORDER BY display_order`,
      [quiz.id]
    );

    res.json({ quiz: { ...quiz, questions: questionsRes.rows } });
  } catch (err) {
    next(err);
  }
}

async function submitAttempt(req, res, next) {
  try {
    const studentId = req.user.sub;
    const { quiz_key, score, total, percentage, time_taken_seconds } = req.body;

    await db.query(
      `INSERT INTO quiz_attempts (student_id, quiz_key, score, total, percentage, time_taken_seconds)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [studentId, quiz_key, score, total, percentage, time_taken_seconds || null]
    );

    // Add XP: 20 XP per correct answer
    const xpEarned = score * 20;
    await db.query(
      `UPDATE students SET xp = xp + $1 WHERE id = $2`,
      [xpEarned, studentId]
    );

    res.status(201).json({
      message: 'Quiz attempt recorded.',
      xp_earned: xpEarned,
      percentage
    });
  } catch (err) {
    next(err);
  }
}

async function getAttempts(req, res, next) {
  try {
    const studentId = req.user.sub;
    const result = await db.query(
      `SELECT quiz_key, score, total, percentage, time_taken_seconds, attempted_at
       FROM quiz_attempts WHERE student_id = $1 ORDER BY attempted_at DESC`,
      [studentId]
    );
    res.json({ attempts: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllQuizzes, getQuiz, submitAttempt, getAttempts };
