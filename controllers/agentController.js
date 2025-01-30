const Agent = require('../models/agentModel');

// Add Agent
exports.addAgent = async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;

        // Validate input
        if (!name || !email || !mobileNumber || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email already exists
        const existingAgent = await Agent.findOne({ email });
        if (existingAgent) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the mobile number already exists
        const existingMobile = await Agent.findOne({ mobileNumber });
        if (existingMobile) {
            return res.status(400).json({ message: 'Mobile number already in use' });
        }

        // Create and save the agent
        const agent = new Agent({ name, email, mobileNumber, password });
        await agent.save();

        res.status(201).json({ message: 'Agent added successfully',data: agent });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


