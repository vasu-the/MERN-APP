const express = require("express");
const router = express.Router();
const { uploadAndDistributeTasks, getAgentByIdWithTasks } = require("../controllers/taskController");
//Upload task list
router.post("/upload-tasks", uploadAndDistributeTasks);
//Get Task-Agent-ByID
router.get("/agent/:id", getAgentByIdWithTasks);
module.exports = router;
