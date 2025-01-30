const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Add Agent Route
router.post('/add-agent', agentController.addAgent);

module.exports = router;
