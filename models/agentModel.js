const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the 'Agent' model
const agentSchema = new mongoose.Schema({
    name: {
        type: String,        // Name of the agent
        required: true,       // The name is required
        trim: true,           // Remove leading and trailing spaces
    },
    email: {
        type: String,        // Email of the agent
        required: true,       // The email is required
        unique: true,         // The email must be unique
        lowercase: true,      // Convert the email to lowercase before saving
        trim: true,           // Remove leading and trailing spaces
        validate: {
            // Validate the email format using a regular expression
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);  // Simple email regex validation
            },
            message: 'Invalid email format',  // Error message for invalid email format
        },
    },
    mobileNumber: {
        type: String,        // Mobile number of the agent
        required: true,       // The mobile number is required
        validate: {
            // Validate the mobile number format using a regular expression
            validator: function (v) {
                return /^\+\d{1,3}\d{10}$/.test(v); // Format: +<country_code><10_digit_number>
            },
            message: 'Invalid mobile number format',  // Error message for invalid mobile number format
        },
    },
    password: {
        type: String,        // Password for the agent
        required: true,       // The password is required
        minlength: 6,         // Password must be at least 6 characters long
    },
}, { timestamps: true });   // Automatically adds 'createdAt' and 'updatedAt' fields

// Pre-save middleware to hash password before saving the document to the database
agentSchema.pre('save', async function (next) {
    if (this.isModified('password')) {  // Check if the password field was modified
        const salt = await bcrypt.genSalt(10);  // Generate a salt with 10 rounds of hashing
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password with the salt
    }
    next();  // Proceed to save the document
});

// Export the 'Agent' model based on the schema
module.exports = mongoose.model('Agent', agentSchema);
