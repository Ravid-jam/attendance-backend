const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        message: "Authorization token missing or invalid",
        status: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JET_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authorization error:", error.message);

    return res.status(401).send({
      message: "Invalid or expired token",
      status: false,
    });
  }
};

module.exports = authorize;
