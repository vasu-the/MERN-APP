// const DistributedList = require("../models/listModel");
// const Agent = require("../models/agentModel");
// const csv = require("csv-parser");
// const fs = require("fs");

// // Upload CSV and Distribute Lists
// exports.uploadAndDistribute = async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const agents = await Agent.find().limit(5);
//   if (agents.length === 0) return res.status(400).json({ message: "No agents available" });

//   const results = [];
//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       const distributedLists = [];
//       const itemsPerAgent = Math.ceil(results.length / agents.length);

//       for (let i = 0; i < results.length; i++) {
//         const agentIndex = i % agents.length;
//         distributedLists.push({
//           ...results[i],
//           agentId: agents[agentIndex]._id,
//         });
//       }

//       await DistributedList.insertMany(distributedLists);
//       fs.unlinkSync(req.file.path); // Delete the uploaded file
//       res.status(200).json({ message: "Lists distributed successfully" });
//     });
// };

const DistributedList = require("../models/listModel");
const Agent = require("../models/agentModel");
const csv = require("csv-parser");
const fs = require("fs");

// Upload CSV and Distribute Lists
exports.uploadAndDistribute = async (req, res) => {
  try {
    console.log("File upload initiated");

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded: ", req.file);

    const agents = await Agent.find().limit(5);
    if (agents.length === 0) {
      console.error("No agents available");
      return res.status(400).json({ message: "No agents available" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const distributedLists = [];
        const itemsPerAgent = Math.ceil(results.length / agents.length);

        for (let i = 0; i < results.length; i++) {
          const agentIndex = i % agents.length;
          distributedLists.push({
            ...results[i],
            agentId: agents[agentIndex]._id,
          });
        }

        await DistributedList.insertMany(distributedLists);
        fs.unlinkSync(req.file.path); // Delete the uploaded file
        res.status(200).json({ message: "Lists distributed successfully" });
      });
  } catch (error) {
    console.error("File upload error: ", error.message);
    res.status(500).json({ message: `File upload error: ${error.message}` });
  }
};