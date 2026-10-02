/* ==========================================================================
   SHIKSHA SETU - PROGRESS ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/progress.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireStudent } = require('../middleware/auth.middleware');

// POST /api/v1/progress/lesson-complete
router.post('/lesson-complete', requireStudent, [
  body('lesson_key').trim().notEmpty().withMessage('lesson_key is required'),
  body('xp_earned').optional().isInt({ min: 0 })
], validate, ctrl.markLessonComplete);

// GET /api/v1/progress/completed-lessons
router.get('/completed-lessons', requireStudent, ctrl.getCompletedLessons);

// POST /api/v1/progress/add-xp
router.post('/add-xp', requireStudent, [
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer')
], validate, ctrl.addXP);

// PATCH /api/v1/progress/streak
router.patch('/streak', requireStudent, [
  body('streak').isInt({ min: 0 }).withMessage('Streak must be a non-negative integer'),
  body('last_active_date').isISO8601().withMessage('Valid date required')
], validate, ctrl.updateStreak);

module.exports = router;
