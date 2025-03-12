var Auth = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      profile_Image,
      address,
      contactNumber,
      dateOfBirth,
      gender,
    } = req.body;
    let user = await Auth.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    let uploadedImage = null;

    if (profile_Image) {
      uploadedImage = await cloudinary.uploader.upload(profile_Image, {
        folder: "Jamatrix",
      });
    }
    const data = await Auth.create({
      firstName,
      lastName: lastName ? lastName : "",
      email,
      password,
      role,
      profile_Image: {
        id: uploadedImage?.public_id ? uploadedImage?.public_id : "",
        url: uploadedImage?.url ? uploadedImage?.url : "",
      },
      address: address ? address : "",
      contactNumber: contactNumber ? contactNumber : "",
      dateOfBirth: dateOfBirth ? dateOfBirth : "",
      gender: gender ? gender : "Male",
    });

    res.json({
      message: "User registered successfully",
      data: data,
      status: true,
    });
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

    const isMatch = await Auth.findOne({ password });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const employees = await Auth.find().skip(skip).limit(limit);
    if (!employees) {
      return res.status(404).json({
        message: "Employees not found",
        status: false,
      });
    }
    const totalEmployee = await Auth.countDocuments();
    console.log(totalEmployee);
    const totalPages = Math.ceil(totalEmployee / limit);
    res.status(200).json({
      message: "Employees list successfully",
      data: employees,
      totalCount: totalPages,
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
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      profile_Image = {},
      address,
      contactNumber,
      dateOfBirth,
      gender,
    } = req.body;
    const { id } = req.params;

    const existingEmployee = await Auth.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }

    let updatedProfileImage = existingEmployee.profile_Image || {};

    if (profile_Image && !profile_Image.id) {
      try {
        if (existingEmployee.profile_Image?.id) {
          await cloudinary.uploader.destroy(existingEmployee.profile_Image.id);
        }

        if (typeof profile_Image === "string" && profile_Image.trim() !== "") {
          const uploadResponse = await cloudinary.uploader.upload(
            profile_Image,
            {
              folder: "Jamatrix",
            }
          );

          updatedProfileImage = {
            id: uploadResponse.public_id,
            url: uploadResponse.url,
          };
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
      }
    } else if (profile_Image?.id) {
      updatedProfileImage = {
        id: profile_Image.id, // Fix incorrect property access
        url: profile_Image.url,
      };
    }

    const employee = await Auth.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName: lastName || "",
        email,
        password,
        role,
        profile_Image: {
          id: updatedProfileImage?.id || "",
          url: updatedProfileImage?.url || "",
        },
        address: address || "",
        contactNumber: contactNumber || "",
        dateOfBirth: dateOfBirth || "",
        gender: gender || "Male",
      },
      { new: true }
    );

    res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
      status: true,
    });
  } catch (error) {
    console.error("Server Error:", error);
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

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Auth.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }
    res.status(200).json({
      message: "Employee fetched successfully",
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
