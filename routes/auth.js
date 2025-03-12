var express = require("express");
const {
  register,
  login,
  listEmployees,
  getEmployeeByIdAndDelete,
  getEmployeeByIdAndUpdate,
  getEmployeeById,
} = require("../controller/auth.controller");
const authorize = require("../middelware/Middleware");

var router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);
router.get("/listEmployees", authorize, listEmployees);
router.delete("/remove/:id", authorize, getEmployeeByIdAndDelete);
router.put("/update/:id", authorize, getEmployeeByIdAndUpdate);
router.get("/getEmployee/:id", authorize, getEmployeeById);

module.exports = router;
