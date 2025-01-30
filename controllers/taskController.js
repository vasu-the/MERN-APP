const Task = require("../models/taskModel");
const Agent = require("../models/agentModel");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure uploads directory exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter for CSV and XLSX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and XLSX files are allowed."), false);
  }
};

// Multer upload configuration
const upload = multer({ storage, fileFilter }).single("file");

// Parse CSV or XLSX file
const parseFile = async (filePath) => {
  const results = [];
  if (filePath.endsWith(".csv")) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  } else if (filePath.endsWith(".xlsx")) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(sheet);
    return json;
  }
  throw new Error("Unsupported file format.");
};

// Distribute tasks equally among agents
const distributeTasks = (tasks, agents) => {
  const distributedTasks = [];
  let agentIndex = 0;

  tasks.forEach((task) => {
    if (!distributedTasks[agentIndex]) {
      distributedTasks[agentIndex] = { agentId: agents[agentIndex]._id, tasks: [] };
    }
    distributedTasks[agentIndex].tasks.push(task);

    agentIndex = (agentIndex + 1) % agents.length;
  });

  return distributedTasks;
};

// Controller to handle file upload and task distribution
exports.uploadAndDistributeTasks = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const filePath = req.file.path;
    //   console.log("Uploaded file path:", filePath);

      // Parse and validate file content
      const tasks = await parseFile(filePath);
      const requiredFields = ["FirstName", "Phone Number", "Notes"];
      if (!tasks.every((task) => requiredFields.every((field) => field in task))) {
        fs.unlinkSync(filePath); // Remove invalid file
        return res.status(400).json({ error: "Invalid file format. Ensure all required fields are present." });
      }

      // Fetch agents
      const agents = await Agent.find();
      if (agents.length < 5) {
        fs.unlinkSync(filePath); // Remove file
        return res.status(400).json({ error: "At least 5 agents are required to distribute tasks." });
      }

      // Format and distribute tasks
      const formattedTasks = tasks.map(({ "FirstName": firstName, "Phone Number": phoneNumber, "Notes": notes }) => ({
        firstName,
        phoneNumber,
        notes,
      }));
      const distributedTasks = distributeTasks(formattedTasks, agents);

      // Save tasks to the database
      const savedTasks = await Promise.all(
        distributedTasks.map(({ agentId, tasks }) => new Task({ agentId, tasks }).save())
      );

      fs.unlinkSync(filePath); // Remove the uploaded file
      res.status(200).json({ message: "Tasks uploaded and distributed successfully.", data: savedTasks });
    } catch (error) {
      console.error("Error during processing:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
};


// Get agent by ID with tasks
exports.getAgentByIdWithTasks = async (req, res) => {
    try {
      const agentId = req.params.id;
  
      // Fetch agent by ID
      const agent = await Agent.findById(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      // Fetch tasks assigned to the agent
      const tasks = await Task.find({ agentId });
  
      res.status(200).json({
        success: true,
        data: {
          agent,
          tasks,
        },
      });
    } catch (error) {
      console.error("Error fetching agent and tasks:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };