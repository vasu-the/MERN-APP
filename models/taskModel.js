const mongoose = require("mongoose");

// Define the schema for the 'Task' model
const taskSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the 'Agent' collection
    ref: "Agent",                          // The referenced model (Agent)
    required: true                         // The agentId is required for each task
  },
  tasks: [
    {
      firstName: { type: String, required: true },  // First name of the person assigned to the task
      phoneNumber: { type: String, required: true }, // Phone number of the person assigned to the task
      notes: { type: String, required: true },       // Additional notes related to the task
    },
  ],
});

// Export the 'Task' model based on the schema
module.exports = mongoose.model("Task", taskSchema);
