/* ==========================================================================
   SHIKSHA SETU - BADGES CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function getAllBadges(req, res, next) {
  try {
    const result = await db.query(
      `SELECT badge_key, name, description, icon, requirement FROM badges ORDER BY id`
    );
    res.json({ badges: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getMyBadges(req, res, next) {
  try {
    const studentId = req.user.sub;
    const result = await db.query(
      `SELECT sb.badge_key, sb.unlocked_at, b.name, b.icon, b.description
       FROM student_badges sb
       JOIN badges b ON b.badge_key = sb.badge_key
       WHERE sb.student_id = $1
       ORDER BY sb.unlocked_at DESC`,
      [studentId]
    );
    res.json({ badges: result.rows });
  } catch (err) {
    next(err);
  }
}

async function unlockBadge(req, res, next) {
  try {
    const studentId = req.user.sub;
    const { badge_key } = req.body;

    // Idempotent — ON CONFLICT DO NOTHING prevents duplicates
    const result = await db.query(
      `INSERT INTO student_badges (student_id, badge_key)
       VALUES ($1, $2)
       ON CONFLICT (student_id, badge_key) DO NOTHING
       RETURNING id, badge_key, unlocked_at`,
      [studentId, badge_key]
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'Badge already unlocked.', badge_key, already_owned: true });
    }

    res.status(201).json({
      message: 'Badge unlocked!',
      badge: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllBadges, getMyBadges, unlockBadge };
