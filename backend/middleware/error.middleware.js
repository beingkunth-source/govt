/* ==========================================================================
   SHIKSHA SETU - GLOBAL ERROR HANDLER MIDDLEWARE
   ========================================================================== */

/**
 * Global Express error handler.
 * Catches all errors passed via next(err).
 * Never exposes database/server details to students.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[Shiksha Setu Error]', err.message);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'This record already exists.' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced record does not exist.' });
  }

  // JWT errors (should normally be caught in middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  // Default server error — never expose details to frontend
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred. Please try again.'
    : err.message;

  res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };
