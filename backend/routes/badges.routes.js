/* ==========================================================================
   SHIKSHA SETU - BADGES ROUTES
   ========================================================================== */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/badges.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireStudent } = require('../middleware/auth.middleware');

// GET /api/v1/badges
router.get('/', requireStudent, ctrl.getAllBadges);

// GET /api/v1/badges/mine
router.get('/mine', requireStudent, ctrl.getMyBadges);

// POST /api/v1/badges/unlock
router.post('/unlock', requireStudent, [
  body('badge_key').trim().notEmpty().withMessage('badge_key is required')
], validate, ctrl.unlockBadge);

module.exports = router;
