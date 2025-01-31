// Import necessary modules and configuration files
require("./mongoose/db");  // Connect to the database (mongoose setup)
const express = require("express");  // Import Express for server setup
const bodyParser = require("body-parser");  // Middleware for parsing incoming request bodies
const cors = require("cors");  // Middleware for handling Cross-Origin Resource Sharing (CORS)
const morgan = require("morgan");  // HTTP request logger middleware
const app = express();  // Create an Express application

// Set environment variables for port and hostname
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

// Middlewares setup
app.use(morgan('dev'));  // Logging middleware to log requests in 'dev' format
app.use(morgan('tiny'));  // Logging middleware to log requests in 'tiny' format
app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded data
app.use(bodyParser.json());  // Middleware to parse incoming JSON bodies (alternative to express.json)
app.use(cors({
  origin: "*",  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTION'],  // Allow these HTTP methods
  allowedHeaders: ['Authorization', 'Content-Type']  // Allow Authorization and Content-Type headers
}));

// Import route handlers
const authRoutes = require('./routers/authRoutes');
const agentRoutes = require('./routers/agentRoutes');
const taskRoutes = require('./routers/taskRoutes');

// Register routes
app.use('/', authRoutes);  // Use auth routes for paths starting with '/'
app.use('/', agentRoutes);  // Use agent routes for paths starting with '/'
app.use('/', taskRoutes);   // Use task routes for paths starting with '/'

// Default route for the app
app.get('/', (req, res) => {
  res.json({ msg: "Welcome to the app" });  // Simple welcome message
});

// Start the server and listen on the specified port and hostname
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server listening at http://${HOSTNAME}:${PORT}`);  // Log a message when the server is running
});
