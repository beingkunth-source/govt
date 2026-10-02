/* ==========================================================================
   SHIKSHA SETU - QUIZZES ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/quizzes.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireStudent } = require('../middleware/auth.middleware');

// GET /api/v1/quizzes
router.get('/', requireStudent, ctrl.getAllQuizzes);

// GET /api/v1/quizzes/attempts
router.get('/attempts', requireStudent, ctrl.getAttempts);

// GET /api/v1/quizzes/:quiz_key
router.get('/:quiz_key', requireStudent, ctrl.getQuiz);

// POST /api/v1/quizzes/attempt
router.post('/attempt', requireStudent, [
  body('quiz_key').trim().notEmpty().withMessage('quiz_key is required'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('total').isInt({ min: 1 }).withMessage('Total must be a positive integer'),
  body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be 0-100'),
  body('time_taken_seconds').optional().isInt({ min: 0 })
], validate, ctrl.submitAttempt);

module.exports = router;
