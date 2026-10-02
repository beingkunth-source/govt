/* ==========================================================================
   SHIKSHA SETU - TEACHERS ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/teachers.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireTeacher } = require('../middleware/auth.middleware');

// GET /api/v1/teachers/dashboard
router.get('/dashboard', requireTeacher, ctrl.getDashboard);

// POST /api/v1/teachers/classes
router.post('/classes', requireTeacher, [
  body('class_number').isInt({ min: 6, max: 10 }).withMessage('Class must be between 6 and 10'),
  body('school_id').isInt().withMessage('school_id is required')
], validate, ctrl.createClass);

// POST /api/v1/teachers/subjects
router.post('/subjects', requireTeacher, [
  body('class_id').isInt().withMessage('class_id is required'),
  body('name').trim().notEmpty().withMessage('Subject name is required'),
  body('subject_key').optional().isIn(['math','sci','eng','hin','sst','comp'])
], validate, ctrl.createSubject);

// POST /api/v1/teachers/lessons
router.post('/lessons', requireTeacher, [
  body('chapter_id').isInt().withMessage('chapter_id is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('lesson_key').optional().trim()
], validate, ctrl.createLesson);

// PATCH /api/v1/teachers/lessons/:id
router.patch('/lessons/:id', requireTeacher, [
  body('title').optional().trim().notEmpty(),
  body('content').optional(),
  body('published').optional().isBoolean()
], validate, ctrl.updateLesson);

// POST /api/v1/teachers/quizzes
router.post('/quizzes', requireTeacher, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('timer_seconds').optional().isInt({ min: 30 })
], validate, ctrl.createQuiz);

// PATCH /api/v1/teachers/quizzes/:id
router.patch('/quizzes/:id', requireTeacher, [
  body('title').optional().trim().notEmpty(),
  body('published').optional().isBoolean()
], validate, ctrl.updateQuiz);

// POST /api/v1/teachers/assignments
router.post('/assignments', requireTeacher, [
  body('class_id').isInt().withMessage('class_id is required'),
  body('due_date').optional().isISO8601()
], validate, ctrl.createAssignment);

module.exports = router;
