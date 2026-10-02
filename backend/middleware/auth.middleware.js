/* ==========================================================================
   SHIKSHA SETU - JWT AUTHENTICATION MIDDLEWARE
   ========================================================================== */

const jwt = require('jsonwebtoken');

/**
 * Verifies JWT from Authorization header.
 * Attaches decoded payload to req.user.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub: userId, role: 'student'|'teacher', iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

/**
 * Requires the authenticated user to be a student.
 */
function requireStudent(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Student access required.' });
    }
    next();
  });
}

/**
 * Requires the authenticated user to be a teacher.
 */
function requireTeacher(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Teacher access required.' });
    }
    next();
  });
}

/**
 * Requires the student to own the resource (req.params.id === their own id).
 */
function requireOwnership(req, res, next) {
  requireStudent(req, res, () => {
    const requestedId = parseInt(req.params.id);
    if (req.user.sub !== requestedId) {
      return res.status(403).json({ error: 'You can only access your own data.' });
    }
    next();
  });
}

module.exports = { requireAuth, requireStudent, requireTeacher, requireOwnership };
