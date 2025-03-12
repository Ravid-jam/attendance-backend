const Leave = require("../models/leaves.model");
const Auth = require("../models/auth.model");
const moment = require("moment-timezone");

exports.addLeaves = async (req, res) => {
  try {
    const { name, leaveType, startDate, endDate, reason } = req.body;

    const userExists = await Auth.findById(name);
    if (!userExists) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    const newLeave = new Leave({
      name,
      leaveType,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      reason,
    });
    await newLeave.save();

    res
      .status(201)
      .json({ message: "Leave request created", data: newLeave, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.getLeaveByIdAndUpdate = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, status } = req.body;

    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        leaveType,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        reason,
        status,
      },
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

exports.getLeaveByEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required", status: false });
    }
    const leaves = await Leave.find({
      name: id,
    })
      .populate("name")
      .skip(skip)
      .limit(limit);
    const totalLeave = await Leave.countDocuments();

    res.status(200).json({
      message: "Leave requests by employee",
      data: leaves,
      totalCount: totalLeave,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

exports.getLeavesByFilters = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    let query = {};

    if (month && year) {
      const startDate = moment(`${year}-${month}-01`)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");
      query.startDate = { $gte: startDate, $lte: endDate };
    }

    if (employeeId) {
      query.name = employeeId;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaves = await Leave.find(query)
      .populate("name")
      .skip(skip)
      .limit(limit);

    const totalLeave = await Leave.countDocuments(query);

    res.status(200).json({
      message: "Leave requests fetched successfully",
      data: leaves,
      totalCount: totalLeave,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
