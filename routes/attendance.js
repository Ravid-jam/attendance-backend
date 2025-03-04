var express = require("express");
const {
  checkIn,
  checkOut,
  getAttendance,
  getAllEmployeesAttendance,
} = require("../controller/attendance.controller");
const authorize = require("../middelware/Middleware");
var router = express.Router();

/* GET users listing. */
router.post("/check-in", authorize, checkIn);
router.post("/check-out", authorize, checkOut);
router.get("/monthly/:employeeId/:month/:year", authorize, getAttendance);
router.get("/list/:month/:year", authorize, getAllEmployeesAttendance);

module.exports = router;
