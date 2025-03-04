var express = require("express");

const authorize = require("../middelware/Middleware");
const {
  addLeaves,
  getLeaves,
  getLeaveByIdAndUpdate,
  getLeaveByIdAndDelete,
  updateLeaveStatus,
} = require("../controller/leaves.controller");

var router = express.Router();

/* GET users listing. */
router.post("/addLeave", authorize, addLeaves);
router.get("/listLeave", authorize, getLeaves);
router.put("/update/:id", authorize, getLeaveByIdAndUpdate);
router.delete("/remove/:id", authorize, getLeaveByIdAndDelete);
router.put("/updateStatus/:id", authorize, updateLeaveStatus);

module.exports = router;
