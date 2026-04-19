const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const database = require("./config/database");

// Routes
const userRoutes = require("./routers/User");
const inventoryRoutes = require("./routers/inventory");
const invoiceRoutes = require("./routers/invoice");
const testimonialRoutes = require("./routers/testimonialRoutes"); 
const cartRoutes = require("./routers/cart");
const categoryRoutes = require("./routers/categorySubcategoryRoutes");
const paymentRoutes = require("./routers/paymentRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
database.connect();

// CORS Configuration
app.use(cors({
    origin:['https://sbms1-r2as.vercel.app', 'https://sbms1.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
}));
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Razorpay Instance
const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categoryy", categoryRoutes);
app.use("/api/v1/pay", paymentRoutes);

// Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on port ${PORT}`);
});