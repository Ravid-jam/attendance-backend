var express = require("express");
const authorize = require("../middelware/Middleware");
const {
  addWork,
  updateWork,
  getWork,
  getWorkByDateAndName,
  deleteWork,
} = require("../controller/work.controller");
var router = express.Router();

router.post("/createWork", authorize, addWork);
router.put("/updateWork/:id", authorize, updateWork);
router.get("/getWork/:employeeId", authorize, getWork);
router.get("/list", authorize, getWorkByDateAndName);
router.delete("/remove/:id", authorize, deleteWork);

module.exports = router;
