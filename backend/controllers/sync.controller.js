/* ==========================================================================
   SHIKSHA SETU - SYNC CONTROLLER
   Handles batch offline-to-online synchronization.
   All operations are idempotent (ON CONFLICT DO NOTHING).
   ========================================================================== */

const db = require('../services/db');

/**
 * POST /api/v1/sync/push
 * Body: { operations: [ { type, payload, timestamp, id } ], is_migration: boolean }
 */
async function push(req, res, next) {
  const studentId = req.user.sub;
  const { operations = [], is_migration = false } = req.body;

  if (!Array.isArray(operations) || operations.length === 0) {
    return res.json({ message: 'Nothing to sync.', processed: [], failed: [] });
  }

  const processed = [];
  const failed = [];

  for (const op of operations) {
    try {
      await processOperation(studentId, op);
      processed.push(op.id || op.type);
    } catch (err) {
      console.error(`[Sync] Failed to process op ${op.id || op.type}:`, err.message);
      failed.push({ id: op.id || op.type, error: err.message });
    }
  }

  // Update last_active_date
  await db.query(
    `UPDATE students SET last_active_date = CURRENT_DATE WHERE id = $1`,
    [studentId]
  ).catch(() => {});

  res.json({
    message: is_migration ? 'Migration sync complete.' : 'Sync complete.',
    processed,
    failed,
    synced_at: new Date().toISOString()
  });
}

async function processOperation(studentId, op) {
  switch (op.type) {
    case 'LESSON_COMPLETE': {
      const { lesson_key, xp_earned = 50 } = op.payload;
      const result = await db.query(
        `INSERT INTO student_progress (student_id, lesson_key, completed, xp_earned, completed_at)
         VALUES ($1, $2, TRUE, $3, NOW())
         ON CONFLICT (student_id, lesson_key) DO NOTHING
         RETURNING id`,
        [studentId, lesson_key, xp_earned]
      );
      // Only add XP if lesson was newly inserted (not duplicate)
      if (result.rows.length > 0) {
        await db.query(
          `UPDATE students SET xp = xp + $1 WHERE id = $2`,
          [xp_earned, studentId]
        );
      }
      break;
    }

    case 'QUIZ_ATTEMPT': {
      const { quiz_key, score, total, percentage, time_taken_seconds, date } = op.payload;
      await db.query(
        `INSERT INTO quiz_attempts (student_id, quiz_key, score, total, percentage, time_taken_seconds, attempted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [studentId, quiz_key, score, total, percentage || Math.round((score/total)*100), time_taken_seconds || null, date ? new Date(date) : new Date()]
      );
      const xpEarned = (score || 0) * 20;
      if (xpEarned > 0) {
        await db.query(`UPDATE students SET xp = xp + $1 WHERE id = $2`, [xpEarned, studentId]);
      }
      break;
    }

    case 'XP_ADD': {
      const { amount } = op.payload;
      if (amount > 0) {
        await db.query(`UPDATE students SET xp = xp + $1 WHERE id = $2`, [amount, studentId]);
      }
      break;
    }

    case 'BADGE_UNLOCK': {
      const { badge_key } = op.payload;
      await db.query(
        `INSERT INTO student_badges (student_id, badge_key)
         VALUES ($1, $2)
         ON CONFLICT (student_id, badge_key) DO NOTHING`,
        [studentId, badge_key]
      );
      break;
    }

    case 'PROFILE_SYNC': {
      const { xp, streak, last_active_date, preferred_language } = op.payload;
      await db.query(
        `UPDATE students
         SET
           xp                 = GREATEST(xp, $1),
           streak             = $2,
           last_active_date   = $3,
           preferred_language = COALESCE($4, preferred_language)
         WHERE id = $5`,
        [xp || 0, streak || 1, last_active_date || new Date().toISOString().split('T')[0], preferred_language || null, studentId]
      );
      break;
    }

    default:
      console.warn(`[Sync] Unknown operation type: ${op.type}`);
  }
}

/**
 * GET /api/v1/sync/pull
 * Returns current server state for the student.
 */
async function pull(req, res, next) {
  try {
    const studentId = req.user.sub;

    const studentRes = await db.query(
      `SELECT xp, streak, last_active_date, preferred_language FROM students WHERE id = $1`,
      [studentId]
    );

    const lessonsRes = await db.query(
      `SELECT lesson_key, xp_earned, completed_at FROM student_progress
       WHERE student_id = $1 AND completed = TRUE`,
      [studentId]
    );

    const attemptsRes = await db.query(
      `SELECT quiz_key, score, total, percentage, time_taken_seconds, attempted_at
       FROM quiz_attempts WHERE student_id = $1 ORDER BY attempted_at DESC`,
      [studentId]
    );

    const badgesRes = await db.query(
      `SELECT badge_key, unlocked_at FROM student_badges WHERE student_id = $1`,
      [studentId]
    );

    res.json({
      state: {
        ...studentRes.rows[0],
        completed_lessons: lessonsRes.rows.map(r => r.lesson_key),
        quiz_scores: attemptsRes.rows,
        unlocked_badges: badgesRes.rows.map(r => r.badge_key)
      },
      pulled_at: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { push, pull };
