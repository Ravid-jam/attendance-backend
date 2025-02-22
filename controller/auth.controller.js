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
    res.json({ msg: "User registered successfully" });
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
