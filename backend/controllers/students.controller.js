/* ==========================================================================
   SHIKSHA SETU - STUDENTS CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function getProfile(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT id, school_id, name, class_number, email, avatar, preferred_language, xp, streak, last_active_date, created_at
       FROM students WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json({ student: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const { name, avatar, preferred_language } = req.body;

    const result = await db.query(
      `UPDATE students
       SET
         name               = COALESCE($1, name),
         avatar             = COALESCE($2, avatar),
         preferred_language = COALESCE($3, preferred_language)
       WHERE id = $4
       RETURNING id, name, avatar, preferred_language, xp, streak`,
      [name, avatar, preferred_language, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json({ student: result.rows[0], message: 'Profile updated.' });
  } catch (err) {
    next(err);
  }
}

async function getProgress(req, res, next) {
  try {
    const { id } = req.params;

    const studentRes = await db.query(
      `SELECT xp, streak, last_active_date FROM students WHERE id = $1`, [id]
    );
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const lessonsRes = await db.query(
      `SELECT lesson_key, completed, xp_earned, completed_at
       FROM student_progress WHERE student_id = $1 AND completed = TRUE`,
      [id]
    );

    const quizzesRes = await db.query(
      `SELECT quiz_key, score, total, percentage, time_taken_seconds, attempted_at
       FROM quiz_attempts WHERE student_id = $1 ORDER BY attempted_at DESC`,
      [id]
    );

    res.json({
      progress: {
        ...studentRes.rows[0],
        completed_lessons: lessonsRes.rows,
        quiz_scores: quizzesRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getAchievements(req, res, next) {
  try {
    const { id } = req.params;

    const studentRes = await db.query(
      `SELECT xp, streak FROM students WHERE id = $1`, [id]
    );

    const badgesRes = await db.query(
      `SELECT sb.badge_key, sb.unlocked_at, b.name, b.icon, b.description
       FROM student_badges sb
       JOIN badges b ON b.badge_key = sb.badge_key
       WHERE sb.student_id = $1
       ORDER BY sb.unlocked_at DESC`,
      [id]
    );

    res.json({
      achievements: {
        xp: studentRes.rows[0]?.xp || 0,
        streak: studentRes.rows[0]?.streak || 1,
        badges: badgesRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

async function listStudents(req, res, next) {
  try {
    const { class_number, school_id } = req.query;
    let queryText = `SELECT id, name, class_number, email, xp, streak, avatar FROM students WHERE 1=1`;
    const params = [];

    if (class_number) {
      params.push(parseInt(class_number));
      queryText += ` AND class_number = $${params.length}`;
    }
    if (school_id) {
      params.push(parseInt(school_id));
      queryText += ` AND school_id = $${params.length}`;
    }
    queryText += ' ORDER BY name ASC';

    const result = await db.query(queryText, params);
    res.json({ students: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getProgress, getAchievements, listStudents };
