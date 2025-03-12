var express = require("express");

const authorize = require("../middelware/Middleware");
const {
  addLeaves,
  getLeaveByIdAndUpdate,
  getLeaveByIdAndDelete,
  updateLeaveStatus,
  getLeaveByEmployee,
  getLeavesByFilters,
} = require("../controller/leaves.controller");

var router = express.Router();

/* GET users listing. */
router.post("/addLeave", authorize, addLeaves);
router.put("/update/:id", authorize, getLeaveByIdAndUpdate);
router.delete("/remove/:id", authorize, getLeaveByIdAndDelete);
router.put("/updateStatus/:id", authorize, updateLeaveStatus);
router.get("/getLeave/:id", authorize, getLeaveByEmployee);
router.get("/getLeaveDateRange", authorize, getLeavesByFilters);

module.exports = router;
