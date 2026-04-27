const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// Middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    // console.log("body"+req.body );
    console.log("sdfcvgfdsa"+req.cookies.token);
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log('Received Token:', token);

    if (!token) { 
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode is"+decode.id);
      req.user = decode;
      console.log("user is "+ req.user);
      console.log("suxesssssssssssss")
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};


// Middleware to check if the user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admins",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};

// Middleware to check if the user is a normal user
exports.isUser = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for users",
      });
    }
    console.log("in the user panel")
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified",
    });
  }
};