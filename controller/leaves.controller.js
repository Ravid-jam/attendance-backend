const Leave = require("../models/leaves.model");

const Auth = require("../models/auth.model");

exports.addLeaves = async (req, res) => {
  try {
    const { name, leaveType, startDate, endDate, reason } = req.body;

    const userExists = await Auth.findById(name);
    if (!userExists) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const newLeave = new Leave({ name, leaveType, startDate, endDate, reason });
    await newLeave.save();

    res
      .status(201)
      .json({ message: "Leave request created", data: newLeave, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaves = await Leave.find().populate("name").skip(skip).limit(limit);
    const totalLeave = await Leave.countDocuments();
    const totalPages = Math.ceil(totalLeave / limit);
    res
      .status(200)
      .json({
        message: "All leave requests",
        data: leaves,
        totalCount: totalPages,
        status: true,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.getLeaveByIdAndUpdate = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { leaveType, startDate, endDate, reason, status },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res
        .status(404)
        .json({ message: "Leave request not found", status: false });
    }

    res
      .status(200)
      .json({ message: "Leave request updated", data: leave, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.getLeaveByIdAndDelete = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res
        .status(404)
        .json({ message: "Leave request not found", status: false });
    }

    res.status(200).json({ message: "Leave request deleted", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Denied", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status", status: false });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res
        .status(404)
        .json({ message: "Leave request not found", status: false });
    }

    res
      .status(200)
      .json({ message: `Leave request ${status}`, data: leave, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
