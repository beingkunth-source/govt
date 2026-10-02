/* ==========================================================================
   SHIKSHA SETU - STUDENTS ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/students.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireOwnership, requireTeacher } = require('../middleware/auth.middleware');

// GET /api/v1/students/:id
router.get('/:id', requireOwnership, ctrl.getProfile);

// PATCH /api/v1/students/:id
router.patch('/:id', requireOwnership, [
  body('name').optional().trim().notEmpty().isLength({ max: 150 }),
  body('avatar').optional().trim().isLength({ max: 20 }),
  body('preferred_language').optional().isIn(['en', 'hi', 'mr'])
], validate, ctrl.updateProfile);

// GET /api/v1/students/:id/progress
router.get('/:id/progress', requireOwnership, ctrl.getProgress);

// GET /api/v1/students/:id/achievements
router.get('/:id/achievements', requireOwnership, ctrl.getAchievements);

// GET /api/v1/students (teacher only — view class roster)
router.get('/', requireTeacher, ctrl.listStudents);

module.exports = router;
