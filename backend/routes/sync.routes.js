/* ==========================================================================
   SHIKSHA SETU - SYNC ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sync.controller');
const { requireStudent } = require('../middleware/auth.middleware');

// POST /api/v1/sync/push — batch push offline operations
router.post('/push', requireStudent, ctrl.push);

// GET /api/v1/sync/pull — pull server state since last sync
router.get('/pull', requireStudent, ctrl.pull);

module.exports = router;
