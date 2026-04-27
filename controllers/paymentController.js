  const Payment = require("../models/paymentModel.js");
  const crypto = require("crypto");
  const User = require("../models/user.js");
  const Razorpay = require("razorpay");

  const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
  });

  // Checkout function: Create an order
  const checkout = async (req, res) => {
    const options = {
      amount: Number(req.body.amount ), // Razorpay expects the amount in paise (smallest currency unit)
      currency: "INR",
    };
    
    try {
      console.log("instance is", instance);
      const order = await instance.orders.create(options);
      console.log("------------------");
      console.log(order);

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error in creating order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }
  };

  // Payment Verification function
  const paymentVerification = async (req, res) => {
    console.log("------------------------start");
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id ,amount} = req.body;
      console.log("id is"+id)
      // Generate body for signature verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      console.log("Verifying Payment with body:", body);

      // Generate the expected signature using HMAC SHA256 and Razorpay API Secret
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

      console.log("Expected Signature:", expectedSignature);
      console.log("Received Signature:", razorpay_signature);

      // Compare the signatures
      const isAuthentic = expectedSignature === razorpay_signature;
      console.log(isAuthentic);

      if (isAuthentic) {
        // Save payment details in the database, including userId
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          userId:id, 
          amount:amount/100
          // Storing the user ID for tracking the user who made the payment
        });

        console.log("Payment success");
        return res.status(200).json({
          success: true,
          message: "Payment successful",
        });
      } else {
        // Payment verification failed
        console.log("Payment verification failed");
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }
    } catch (error) {
      console.error("Error in payment verification:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  const getAllUsersWithPayments = async (req, res) => {
    try {
      // Find all payments and populate user information using 'userId'
      const payments = await Payment.find().populate('userId', 'firstName lastName email');

      if (!payments.length) {
        return res.status(404).json({
          success: false,
          message: "No payments found",
        });
      }

      // Format the response to include user info along with the payment amount
      const userPayments = payments.map(payment => ({
        user: payment.userId,  // Populated user info
        amount: payment.amount,
        date: payment.createdAt,  // Amount from the payment 

      }));

      res.status(200).json({
        success: true,
        userPayments,
      });
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  const getTotalAmount = async (req, res) => {
    try {
      const totalAmountResult = await Payment.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
  
      const totalAmount = totalAmountResult[0]?.totalAmount || 0;
  
      res.status(200).json({
        success: true,
        totalAmount,
      });
    } catch (error) {
      console.error("Error calculating total amount:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  // Get payments for a specific user by userId
  const getUserPayments = async (req, res) => {
    try {
      console.log("Fetching user payments...");
      const { id } = req.params; // Get user ID from route parameter (was `userId` before)
      console.log("User ID:", id);
  
      // Find payments for the specific user and populate user information
      const payments = await Payment.find({ userId: id }).populate('userId', 'firstName lastName email');
  
      if (!payments.length) {
        return res.status(404).json({
          success: false,
          message: `No payments found for user with ID ${id}`,
        });
      }
  
      // Format the response to include user info along with the payment amount
      const userPayments = payments.map(payment => ({
        user: payment.userId, // Populated user info (firstName, lastName, email)
        amount: payment.amount, // Amount from the payment
        date: payment.createdAt, // Date of payment
      }));
  
      res.status(200).json({
        success: true,
        userPayments,
      });
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  const getMonthlySellingData = async (req, res) => {
    try {
      // Aggregate payments by month and calculate the total selling amount for each month
      const monthlySellingData = await Payment.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalSellingAmount: { $sum: "$amount" }, // Sum the amount for each month
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month
        },
      ]);
  
      if (!monthlySellingData.length) {
        return res.status(404).json({
          success: false,
          message: "No selling data found",
        });
      }
  
      // Format the response to include month and total selling amount
      const formattedData = monthlySellingData.map(data => ({
        month: data._id,
        totalSellingAmount: data.totalSellingAmount,
      }));
  
      res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error in getting monthly selling data:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

  module.exports = {getMonthlySellingData, checkout,getUserPayments, paymentVerification,getTotalAmount, getAllUsersWithPayments };
