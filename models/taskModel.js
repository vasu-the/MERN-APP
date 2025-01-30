const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  tasks: [
    {
      firstName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      notes: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
