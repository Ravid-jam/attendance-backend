var mongoose = require("mongoose");

var authSchema = new mongoose.Schema({
  profile_Image: {
    id: String,
    url: String,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: false,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "STAFF"],
    required: true,
  },
});

module.exports = mongoose.model("Auth", authSchema);
