const moment = require("moment");
var Attendance = require("../models/attendance.model");
var Auth = require("../models/auth.model");

exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Auth.findOne({ _id: employeeId });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const date = moment().format("YYYY-MM-DD");
    const checkIn = moment().format("HH:mm");

    const attendance = new Attendance({ employeeId, date, checkIn });
    await attendance.save();

    res.status(201).json({
      message: "Checked in successfully",
      data: attendance,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

exports.checkOut = async (req, res) => {
  const { employeeId } = req.body;
  const date = moment().format("YYYY-MM-DD");
  const checkOut = moment().format("HH:mm");

  try {
    const employee = await Auth.findOne({ _id: employeeId });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const attendance = await Attendance.findOne({ employeeId, date });

    const checkInTime = moment(attendance.checkIn, "HH:mm");
    const checkOutTime = moment(checkOut, "HH:mm");
    const workHours = checkOutTime.diff(checkInTime, "hours", true);

    attendance.checkOut = checkOut;
    attendance.workHours = workHours;
    await attendance.save();

    res.status(200).json({
      message: "Checked out successfully",
      data: attendance,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

exports.getAttendance = async (req, res) => {
  const { employeeId, month, year } = req.params;
  try {
    const startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("employeeId");

    const totalDays = attendanceRecords.length;
    const totalHours = attendanceRecords.reduce(
      (sum, record) => sum + record.workHours,
      0
    );

    res.status(200).json({
      message: "Attendance list successfully",
      data: {
        employeeId: employeeId,
        month: month,
        year: year,
        totalDays: totalDays,
        totalHours: totalHours,
        attendanceRecords: attendanceRecords,
      },
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};
