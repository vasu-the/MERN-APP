const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  notes: { type: String },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("DistributedList", listSchema);