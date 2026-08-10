const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth');

router.get('/revenue', authMiddleware, reportController.getRevenueReport);

module.exports = router;
