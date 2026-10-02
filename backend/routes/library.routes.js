/* ==========================================================================
   SHIKSHA SETU - LIBRARY ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/library.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireStudent, requireTeacher } = require('../middleware/auth.middleware');

// GET /api/v1/library
router.get('/', requireStudent, ctrl.getAll);

// POST /api/v1/library
router.post('/', requireTeacher, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('resource_type').optional().trim(),
  body('class_number').optional().isInt({ min: 6, max: 10 }),
  body('subject_key').optional().isIn(['math','sci','eng','hin','sst','comp'])
], validate, ctrl.add);

// PATCH /api/v1/library/:id
router.patch('/:id', requireTeacher, [
  body('title').optional().trim().notEmpty(),
  body('published').optional().isBoolean()
], validate, ctrl.update);

// DELETE /api/v1/library/:id
router.delete('/:id', requireTeacher, ctrl.remove);

module.exports = router;
