const Agent = require('../models/agentModel');

// Add Agent
exports.addAgent = async (req, res) => {
  try {
    // Destructure input data from the request body
    const { name, email, mobileNumber, password } = req.body;

    // Validate that all required fields are provided
    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists in the database
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if the mobile number already exists in the database
    const existingMobile = await Agent.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({ message: 'Mobile number already in use' });
    }

    // Create a new agent document in the database
    const agent = new Agent({ name, email, mobileNumber, password });
    await agent.save();  // Save the agent to the database

    // Respond with a success message and the newly created agent data
    return res.status(201).json({ message: 'Agent added successfully', data: agent });
  } catch (err) {
    // If an error occurs, respond with a 500 status and the error message
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get all agents
exports.getAllAgent = async (req, res) => {
  try {
    // Fetch all agents from the database
    const agent = await Agent.find();

    // If no agents are found, return a 404 response
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Respond with the list of agents
    return res.status(200).json({ success: true, data: agent });
  } catch (error) {
    // Log the error and return a 500 status if an exception occurs
    console.error("Error fetching agent:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
