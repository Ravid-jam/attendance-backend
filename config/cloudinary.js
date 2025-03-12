require("dotenv").config();
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDANARY_NAME,
  api_key: process.env.CLOUDANARY_API_KEY,
  api_secret: process.env.CLOUDANARY_API_SECRET_KEY,
});

module.exports = cloudinary;
