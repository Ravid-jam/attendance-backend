var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");

var authRoutes = require("./routes/auth");
var leaveRoutes = require("./routes/leaves");
var workRoutes = require("./routes/work");

var app = express();
require("dotenv").config();

app.use(logger("dev"));
app.use(cors());
express.json({
  limit: "50mb",
});
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/work", workRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

module.exports = app;
