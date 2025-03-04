var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var attendanceRoutes = require("./routes/attendance");
var authRoutes = require("./routes/auth");
var leaveRoutes = require("./routes/leaves");

var app = express();
require("dotenv").config();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);  

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

module.exports = app;
