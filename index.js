const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const database = require("./config/database");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;