// const multer = require("multer");
// const path = require("path");

// // Multer configuration with file filter
// const upload = multer({
//   dest: "uploads/",
//   fileFilter: (req, file, cb) => {
//     const filetypes = /csv|xlsx|xls/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
//     }
//   },
// });



// const express = require("express");
// const listController = require("../controllers/listController");
// // const multer = require("multer");

// // const upload = multer({ dest: "uploads/" });
// const router = express.Router();

// router.post("/upload", upload.single("file"), listController.uploadAndDistribute);

// module.exports = router;

const multer = require("multer");
const path = require("path");
const express = require("express");
const listController = require("../controllers/listController");

// Multer configuration with file filter
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
    }
  },
});

const router = express.Router();

router.post("/upload", upload.single("file"), (req, res, next) => {
  listController.uploadAndDistribute(req, res).catch(next);
});

module.exports = router;