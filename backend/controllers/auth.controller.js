/* ==========================================================================
   SHIKSHA SETU - AUTH CONTROLLER
   ========================================================================== */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../services/db');

const SALT_ROUNDS = 12;

function generateToken(userId, role) {
  const expiresIn = role === 'teacher'
    ? (process.env.JWT_TEACHER_EXPIRES_IN || '24h')
    : (process.env.JWT_EXPIRES_IN || '7d');

  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

async function registerStudent(req, res, next) {
  try {
    const { name, email, password, class_number, school_id } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO students (name, email, password_hash, class_number, school_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, class_number, school_id, avatar, preferred_language, xp, streak, created_at`,
      [name, email, passwordHash, class_number, school_id || null]
    );

    const student = result.rows[0];
    const token = generateToken(student.id, 'student');

    res.status(201).json({
      message: 'Student registered successfully.',
      token,
      user: { ...student, role: 'student' }
    });
  } catch (err) {
    next(err);
  }
}

async function registerTeacher(req, res, next) {
  try {
    const { name, email, password, school_id } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO teachers (name, email, password_hash, school_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, school_id, created_at`,
      [name, email, passwordHash, school_id || null]
    );

    const teacher = result.rows[0];
    const token = generateToken(teacher.id, 'teacher');

    res.status(201).json({
      message: 'Teacher registered successfully.',
      token,
      user: { ...teacher, role: 'teacher' }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const table = role === 'teacher' ? 'teachers' : 'students';

    const result = await db.query(
      `SELECT * FROM ${table} WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, role);
    const { password_hash, ...safeUser } = user;

    // Update last_active_date for students
    if (role === 'student') {
      await db.query(
        `UPDATE students SET last_active_date = CURRENT_DATE WHERE id = $1`,
        [user.id]
      );
    }

    res.json({
      message: 'Login successful.',
      token,
      user: { ...safeUser, role }
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // JWT is stateless — client must delete the token
  // Future: implement token blacklist for enhanced security
  res.json({ message: 'Logged out successfully.' });
}

async function me(req, res, next) {
  try {
    const { sub: userId, role } = req.user;
    const table = role === 'teacher' ? 'teachers' : 'students';

    const result = await db.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password_hash, ...safeUser } = result.rows[0];
    res.json({ user: { ...safeUser, role } });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerStudent, registerTeacher, login, logout, me };
