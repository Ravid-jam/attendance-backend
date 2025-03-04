var mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: "Auth",
    required: true,
  },
  date: { type: String, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  workHours: { type: Number, default: 0 },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
