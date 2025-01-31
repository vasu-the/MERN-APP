const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

//Default Admin Create
router.get('/create-admin', async (req, res) => {
    await authController.createAdmin();
    return res.json({ message: 'Checked and created admin if necessary' });
});

//Admin login
router.post('/login', authController.login);

// Admin Dashboard Route
router.get('/dashboard', authController.adminDashboard);

module.exports = router;
