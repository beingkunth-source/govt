/* ==========================================================================
   SHIKSHA SETU - AUTH ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// POST /api/v1/auth/register/student
router.post('/register/student', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('class_number').isInt({ min: 6, max: 10 }).withMessage('Class must be between 6 and 10'),
  body('school_id').optional().isInt()
], validate, authController.registerStudent);

// POST /api/v1/auth/register/teacher
router.post('/register/teacher', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('school_id').optional().isInt()
], validate, authController.registerTeacher);

// POST /api/v1/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher')
], validate, authController.login);

// POST /api/v1/auth/logout
router.post('/logout', requireAuth, authController.logout);

// GET /api/v1/auth/me
router.get('/me', requireAuth, authController.me);

module.exports = router;
