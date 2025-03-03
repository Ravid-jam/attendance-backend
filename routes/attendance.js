var express = require("express");
const {
  checkIn,
  checkOut,
  getAttendance,
  getAllEmployeesAttendance,
} = require("../controller/attendance.controller");
var router = express.Router();

/* GET users listing. */
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/monthly/:employeeId/:month/:year", getAttendance);
router.get("/list/:month/:year", getAllEmployeesAttendance);

module.exports = router;
