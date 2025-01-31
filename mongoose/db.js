const mongoose = require("mongoose");

// Load environment variables from the .env file
require("dotenv").config();

// Connect to MongoDB using the URL stored in the environment variable (MONGODBURL)
mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,      // Use the new URL parser to avoid deprecation warnings
    useUnifiedTopology: true    // Use the new topology engine for better performance and stability
}).then(() => {
    // If the connection is successful, log a success message
    console.log("Connected to mongodb");
})
    .catch((err) => {
        // If an error occurs during connection, log the error message
        console.log(err, "Error");
    });
