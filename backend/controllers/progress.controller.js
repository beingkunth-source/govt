/* ==========================================================================
   SHIKSHA SETU - PROGRESS CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function markLessonComplete(req, res, next) {
  try {
    const studentId = req.user.sub;
    const { lesson_key, xp_earned = 50 } = req.body;

    // Idempotent upsert — ON CONFLICT DO NOTHING prevents duplicates
    await db.query(
      `INSERT INTO student_progress (student_id, lesson_key, completed, xp_earned, completed_at)
       VALUES ($1, $2, TRUE, $3, NOW())
       ON CONFLICT (student_id, lesson_key) DO NOTHING`,
      [studentId, lesson_key, xp_earned]
    );

    // Add XP to student total
    await db.query(
      `UPDATE students SET xp = xp + $1 WHERE id = $2`,
      [xp_earned, studentId]
    );

    res.json({ message: 'Lesson marked as complete.', lesson_key, xp_earned });
  } catch (err) {
    next(err);
  }
}

async function getCompletedLessons(req, res, next) {
  try {
    const studentId = req.user.sub;
    const result = await db.query(
      `SELECT lesson_key, xp_earned, completed_at
       FROM student_progress
       WHERE student_id = $1 AND completed = TRUE
       ORDER BY completed_at DESC`,
      [studentId]
    );

    res.json({ completed_lessons: result.rows });
  } catch (err) {
    next(err);
  }
}

async function addXP(req, res, next) {
  try {
    const studentId = req.user.sub;
    const { amount } = req.body;

    const result = await db.query(
      `UPDATE students SET xp = xp + $1 WHERE id = $2 RETURNING xp`,
      [amount, studentId]
    );

    res.json({ message: 'XP added.', new_xp: result.rows[0]?.xp || 0 });
  } catch (err) {
    next(err);
  }
}

async function updateStreak(req, res, next) {
  try {
    const studentId = req.user.sub;
    const { streak, last_active_date } = req.body;

    const result = await db.query(
      `UPDATE students
       SET streak = $1, last_active_date = $2
       WHERE id = $3
       RETURNING streak, last_active_date`,
      [streak, last_active_date, studentId]
    );

    res.json({ message: 'Streak updated.', ...result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { markLessonComplete, getCompletedLessons, addXP, updateStreak };
