const User = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();

// Default admin (Only if no admin exists)
exports.createAdmin = async () => {
    // Check if an admin already exists in the database
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        // Hash the default password for the admin
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create a new admin user
        const admin = new User({
            fullName: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Save the admin to the database
        await admin.save();
        console.log('Default Admin created.');
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // If no user is found, return an error message
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // If the password doesn't match, return an error message
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token for the user
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with a success message and the generated token
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        // If an error occurs, return a server error message
        return res.status(500).json({ message: 'Server error', error: err });
    }
};

// Admin Dashboard Controller
exports.adminDashboard = async (req, res) => {
    try {
        // Extract the token from the authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            // If no token is provided, return an error message
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token to check its validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the decoded userId from the token
        const admin = await User.findById(decoded.userId);
        if (!admin || admin.role !== 'admin') {
            // If the user is not an admin or doesn't exist, deny access
            return res.status(403).json({ message: 'Access denied' });
        }

        // Return the admin's details as the response
        return res.json({
            message: 'Admin Dashboard',
            admin: {
                name: admin.fullName,
                email: admin.email
            }
        });
    } catch (err) {
        // If an error occurs during token verification or database interaction, return a server error message
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
