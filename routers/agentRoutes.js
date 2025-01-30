const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Add Agent Route
router.post('/add-agent', agentController.addAgent);
// Route to get agent by ID
router.get("/agentById/:id",agentController.getAgentById);
module.exports = router;
