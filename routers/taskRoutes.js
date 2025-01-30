const express = require("express");
const router = express.Router();
const { uploadAndDistributeTasks , getAgentByIdWithTasks} = require("../controllers/taskController");

router.post("/upload-tasks", uploadAndDistributeTasks);

router.get("/agent/:id", getAgentByIdWithTasks);
module.exports = router;
