const mongoose = require('mongoose');

// Define the schema for the 'User' model
const AuthSchema = new mongoose.Schema({
  fullName: {
    type: String,         // Full name of the user
    required: true,       // The full name is required
    unique: true          // The full name must be unique (this might be unusual for names, consider if needed)
  },
  email: {
    type: String,         // Email address of the user
    required: true,       // The email is required
    unique: true          // The email must be unique
  },
  password: {
    type: String,         // Password for the user
    required: true        // The password is required
  },
  role: {
    type: String,
    default: "admin"      // Default role is 'admin' if not specified
  },
});

// Export the 'User' model based on the schema
module.exports = mongoose.model('Auth', AuthSchema);
