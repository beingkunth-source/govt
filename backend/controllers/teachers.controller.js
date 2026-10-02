/* ==========================================================================
   SHIKSHA SETU - TEACHERS CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function getDashboard(req, res, next) {
  try {
    const teacherId = req.user.sub;

    // Get teacher info
    const teacherRes = await db.query(
      `SELECT t.id, t.name, t.email, s.school_name
       FROM teachers t LEFT JOIN schools s ON s.id = t.school_id
       WHERE t.id = $1`,
      [teacherId]
    );

    // Aggregated stats
    const statsRes = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM students)::int AS total_students,
        (SELECT COUNT(*) FROM lessons WHERE published = TRUE)::int AS total_lessons,
        (SELECT COUNT(*) FROM quizzes WHERE published = TRUE)::int AS total_quizzes,
        (SELECT COUNT(*) FROM quiz_attempts)::int AS total_attempts,
        (SELECT ROUND(AVG(percentage))::int FROM quiz_attempts) AS avg_quiz_score
    `);

    // Recent quiz attempts
    const attemptsRes = await db.query(
      `SELECT qa.quiz_key, qa.score, qa.total, qa.percentage, qa.attempted_at,
              s.name AS student_name, s.class_number
       FROM quiz_attempts qa
       JOIN students s ON s.id = qa.student_id
       ORDER BY qa.attempted_at DESC
       LIMIT 10`
    );

    // Active assignments
    const assignmentsRes = await db.query(
      `SELECT a.id, a.due_date, a.status, c.class_number
       FROM assignments a
       JOIN classes c ON c.id = a.class_id
       WHERE a.teacher_id = $1
       ORDER BY a.created_at DESC LIMIT 5`,
      [teacherId]
    );

    res.json({
      teacher: teacherRes.rows[0],
      stats: statsRes.rows[0],
      recent_attempts: attemptsRes.rows,
      recent_assignments: assignmentsRes.rows
    });
  } catch (err) {
    next(err);
  }
}

async function createClass(req, res, next) {
  try {
    const { class_number, school_id } = req.body;
    const result = await db.query(
      `INSERT INTO classes (school_id, class_number)
       VALUES ($1, $2)
       ON CONFLICT (school_id, class_number) DO UPDATE SET class_number = EXCLUDED.class_number
       RETURNING *`,
      [school_id, class_number]
    );
    res.status(201).json({ class: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createSubject(req, res, next) {
  try {
    const { class_id, name, subject_key } = req.body;
    const result = await db.query(
      `INSERT INTO subjects (class_id, name, subject_key) VALUES ($1, $2, $3) RETURNING *`,
      [class_id, name, subject_key || null]
    );
    res.status(201).json({ subject: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createLesson(req, res, next) {
  try {
    const { chapter_id, title, content, lesson_key, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO lessons (chapter_id, title, content, lesson_key, display_order, published)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [chapter_id, title, content || null, lesson_key || null, display_order || 1]
    );
    res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateLesson(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const result = await db.query(
      `UPDATE lessons
       SET title     = COALESCE($1, title),
           content   = COALESCE($2, content),
           published = COALESCE($3, published)
       WHERE id = $4
       RETURNING *`,
      [title, content, published, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lesson not found.' });
    res.json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createQuiz(req, res, next) {
  try {
    const { title, subject_id, lesson_id, timer_seconds, quiz_key } = req.body;
    const result = await db.query(
      `INSERT INTO quizzes (title, subject_id, lesson_id, timer_seconds, quiz_key, published)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [title, subject_id || null, lesson_id || null, timer_seconds || 300, quiz_key || null]
    );
    res.status(201).json({ quiz: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateQuiz(req, res, next) {
  try {
    const { id } = req.params;
    const { title, timer_seconds, published } = req.body;
    const result = await db.query(
      `UPDATE quizzes
       SET title         = COALESCE($1, title),
           timer_seconds = COALESCE($2, timer_seconds),
           published     = COALESCE($3, published)
       WHERE id = $4
       RETURNING *`,
      [title, timer_seconds, published, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quiz not found.' });
    res.json({ quiz: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function createAssignment(req, res, next) {
  try {
    const teacherId = req.user.sub;
    const { class_id, lesson_id, quiz_id, due_date, status } = req.body;
    const result = await db.query(
      `INSERT INTO assignments (teacher_id, class_id, lesson_id, quiz_id, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [teacherId, class_id, lesson_id || null, quiz_id || null, due_date || null, status || 'Assigned']
    );
    res.status(201).json({ assignment: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard, createClass, createSubject,
  createLesson, updateLesson, createQuiz,
  updateQuiz, createAssignment
};
