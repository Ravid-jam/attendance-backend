var mongoose = require("mongoose");
var moment = require("moment");

const workSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "Auth",
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD"),
  },
});

module.exports = mongoose.model("work", workSchema);
