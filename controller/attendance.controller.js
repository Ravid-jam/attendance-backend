const moment = require("moment-timezone");
var Attendance = require("../models/attendance.model");
var Auth = require("../models/auth.model");
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Auth.findOne({ _id: employeeId });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    const now = moment().tz("Asia/Kolkata");
    const date = now.format("YYYY-MM-DD");
    const checkIn = now.format("HH:mm:ss");

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
  try {
    const { employeeId } = req.body;

    // Validate input
    if (!employeeId) {
      return res
        .status(400)
        .json({ message: "Employee ID is required", status: false });
    }

    // Check if employee exists
    const employee = await Auth.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found", status: false });
    }

    // Get current timestamp in IST (Asia/Kolkata)
    const now = moment().tz("Asia/Kolkata");
    const date = now.format("YYYY-MM-DD");
    const checkOutTime = now.format("HH:mm:ss");

    // Find attendance record for the day
    const attendance = await Attendance.findOne({ employeeId, date });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No check-in record found for today", status: false });
    }

    // If already checked out, prevent multiple check-outs
    if (attendance.checkOut) {
      return res
        .status(400)
        .json({ message: "Already checked out for today", status: false });
    }

    // Calculate work duration
    const checkInTime = moment(attendance.checkIn, "HH:mm:ss");
    const duration = moment.duration(
      moment(checkOutTime, "HH:mm:ss").diff(checkInTime)
    );
    const workHours = duration.asHours().toFixed(2); // Convert to hours (with decimals)

    // Update attendance record
    attendance.checkOut = checkOutTime;
    attendance.workHours = workHours;
    await attendance.save();

    return res.status(200).json({
      message: "Checked out successfully",
      data: attendance,
      currentTime: now.format("YYYY-MM-DD HH:mm:ss"),
      status: true,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: false,
    });
  }
};

exports.getAttendance = async (req, res) => {
  const { employeeId, month, year } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("employeeId")
      .skip(skip)
      .limit(limit);

    const totalDays = attendanceRecords.length;
    const totalHours = attendanceRecords.reduce(
      (sum, record) => sum + (record.workHours || 0),
      0
    );
    const totalAttendance = await Attendance.countDocuments();
    const totalPages = Math.ceil(totalAttendance / limit);

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
      totalCount: totalPages,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};

exports.getAllEmployeesAttendance = async (req, res) => {
  try {
    const { month, year } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Validate input
    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
        status: false,
      });
    }

    const startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    // Fetch all employees
    const employees = await Auth.find({
      role: "STAFF",
    });

    if (!employees.length) {
      return res
        .status(404)
        .json({ message: "No employees found", status: false });
    }

    // Fetch attendance records for the given month
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("employeeId")
      .skip(skip)
      .limit(limit);

    // Group attendance by employee
    const attendanceSummary = employees.map((employee) => {
      const employeeRecords = attendanceRecords.filter(
        (record) => record.employeeId._id.toString() === employee._id.toString()
      );
      const totalDays = employeeRecords.length;
      const totalHours = employeeRecords.reduce(
        (sum, record) => sum + (record.workHours || 0),
        0
      );

      return {
        employeeId: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        totalDays,
        totalHours: totalHours.toFixed(2),
        attendanceRecords: employeeRecords,
      };
    });
    const totalAttendance = await Attendance.countDocuments();
    const totalPages = Math.ceil(totalAttendance / limit);

    return res.status(200).json({
      message: "Employee attendance fetched successfully",
      data: attendanceSummary,
      totalCount: totalPages,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: false,
    });
  }
};
