var Work = require("../models/work.model");
const { calculateHours } = require("../utils/utils");

var moment = require("moment-timezone");

exports.addWork = async (req, res) => {
  const { employee, startTime, endTime, description, date } = req.body;
  try {
    if (!employee) {
      res.status(404).json({
        message: "Employee id is required",
        status: false,
      });
    } else if (!startTime) {
      res.status(404).json({
        message: "Start Time is required",
        status: false,
      });
    } else if (!endTime) {
      res.status(404).json({
        message: "End Time is required",
        status: false,
      });
    } else if (!description) {
      res.status(404).json({
        message: "Description is required",
        status: false,
      });
    } else if (!date) {
      res.status(404).json({
        message: "Date is required",
        status: false,
      });
    }
    const formattedDate = moment
      .utc(date)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD");

    const workAdded = await Work.create({
      employee,
      startTime,
      endTime,
      description,
      date: formattedDate,
    });
    return res.status(200).json({
      message: "Work Added successfully",
      data: workAdded,
      status: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
      status: false,
    });
  }
};

exports.updateWork = async (req, res) => {
  const { employee, startTime, endTime, description, date } = req.body;
  const { id } = req.params;

  try {
    const missingFields = [];
    if (!employee) missingFields.push("Employee ID");
    if (!startTime) missingFields.push("Start Time");
    if (!endTime) missingFields.push("End Time");
    if (!description) missingFields.push("Description");
    if (!date) missingFields.push("Date");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
        status: false,
      });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid work ID",
        status: false,
      });
    }

    const exitsWork = await Work.findById(id);
    const formattedDate = moment
      .utc(date)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD");
    if (exitsWork) {
      const workUpdate = await Work.findByIdAndUpdate(
        id,
        { employee, startTime, endTime, description, date: formattedDate },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        message: "Work updated successfully",
        data: workUpdate,
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "Work entry not found",
        status: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

exports.getWork = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { employee: employeeId };

    const data = await Work.find(filter)
      .populate("employee")
      .sort({
        date: -1,
        createAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const updatedData = data.map((work) => {
      const hours = calculateHours(work.startTime, work.endTime);
      return { ...work.toObject(), totalHours: hours };
    });
    const totalWorks = await Work.countDocuments();

    return res.status(200).json({
      message: "Work List successfully",
      data: updatedData,
      totalCount: totalWorks,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

exports.deleteWork = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWork = await Work.findByIdAndDelete({ _id: id });
    if (deletedWork) {
      return res.status(200).json({
        message: "Work deleted successfully",
        status: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

exports.getWorkByDateAndName = async (req, res) => {
  try {
    let { employeeId, startDate, endDate } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!startDate || !endDate) {
      const today = moment().format("YYYY-MM-DD");
      startDate = today;
      endDate = today;
    }

    const query = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (employeeId) {
      query.employee = employeeId;
    }

    const data = await Work.find(query)
      .populate("employee")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const updatedData = data.map((work) => {
      const hours = calculateHours(work.startTime, work.endTime);
      return { ...work.toObject(), totalHours: hours };
    });

    const totalWorks = await Work.countDocuments(query);

    return res.status(200).json({
      message: "Work List retrieved successfully",
      data: updatedData,
      totalCount: totalWorks,
      status: true,
    });
  } catch (err) {
    console.error("Error fetching work records:", err);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};
