const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();


// Default admin (Only if no admin exists)
exports.createAdmin = async () => {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = new User({
            fullName: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Default Admin created.');
    }
};
// 

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login successful', token });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};

// Admin Dashboard Controller
exports.adminDashboard = async (req, res) => {
    try {
        // Extract the token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin
        const admin = await User.findById(decoded.userId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Return admin details
        return res.json({ 
            message: 'Admin Dashboard', 
            admin: { 
                name: admin.fullName, 
                email: admin.email 
            } 
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};