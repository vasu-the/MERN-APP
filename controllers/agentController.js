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


// Get agent by ID
exports.getAllAgent = async (req, res) => {
    try {
  
      // Fetch agent by ID
      const agent = await Agent.find();
  
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      console.error("Error fetching agent:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };