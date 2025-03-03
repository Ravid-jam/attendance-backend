var Auth = require("../models/auth.model");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await Auth.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
    user = new Auth({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ message: "User registered successfully", status: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).send("Invalid email or password");
    let user = await Auth.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JET_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({ token: token, data: user, status: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      status: false,
      message: "Server error",
    });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const employees = await Auth.find();
    if (!employees) {
      return res.status(404).json({
        message: "Employees not found",
        status: false,
      });
    }
    res.status(200).json({
      message: "Employees list successfully",
      data: employees,
      status: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
};

exports.getEmployeeByIdAndUpdate = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const { id } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const employee = await Auth.findByIdAndUpdate(
      id,
      { name, email, role, password: hashPassword },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }
    res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
      status: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
};

exports.getEmployeeByIdAndDelete = async (req, res) => {
  try {
    const employee = await Auth.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }
    res.status(200).json({
      message: "Employee deleted successfully",
      data: employee,
      status: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
      status: false,
    });
  }
};
