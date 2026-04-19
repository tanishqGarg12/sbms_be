const express = require("express");
const {
  checkout,
  paymentVerification,
  getAllUsersWithPayments,
  getTotalAmount,
  getUserPayments,
  getMonthlySellingData
} = require("../controllers/paymentController.js");

const router = express.Router();

// Route for initiating checkout
router.post("/checkout", checkout);

// Route for verifying payment
router.post("/paymentverification", paymentVerification);

// Route to get all users and their payments
router.get("/getAllUserPayments", getAllUsersWithPayments);

// Route to get the total payment amount
router.get("/getTotal", getTotalAmount); // Corrected typo in route from "getTotall" to "getTotal"

// Route to get payments for a specific user by ID
router.get("/getspe/:id", getUserPayments);
router.get("/allsell",getMonthlySellingData);
module.exports = router;