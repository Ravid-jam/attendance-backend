var mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: "Auth",
    required: true,
  },
  date: { type: String, required: true }, // YYYY-MM-DD format
  checkIn: { type: String }, // HH:mm format
  checkOut: { type: String }, // HH:mm format
  workHours: { type: Number, default: 0 }, // Total work hours in a day
});

module.exports = mongoose.model("Attendance", attendanceSchema);
