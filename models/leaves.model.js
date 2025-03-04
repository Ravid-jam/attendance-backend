var mongoose = require("mongoose");

var leaveSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick", "Vacation", "Maternity Leave", "Paternity Leave"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leaves", leaveSchema);
