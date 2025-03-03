var express = require("express");
const {
  register,
  login,
  listEmployees,
  getEmployeeByIdAndDelete,
  getEmployeeByIdAndUpdate,
} = require("../controller/auth.controller");

var router = express.Router();

/* GET users listing. */
router.post("/register", register);
router.post("/login", login);
router.get("/listEmployees", listEmployees);
router.delete("/remove/:id", getEmployeeByIdAndDelete);
router.put("/update/:id", getEmployeeByIdAndUpdate);

module.exports = router;
