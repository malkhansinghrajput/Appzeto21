const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

require("dotenv").config();


// ================= APP =================

const app = express();


// ================= MIDDLEWARES =================

app.use(
  cors({
    origin: process.env.CLIENT_URL,

    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// ================= ROUTES =================

const authRoutes = require("./routes/auth.routes");

const jobRoutes = require("./routes/job.routes");

const applicationRoutes = require("./routes/application.routes");

const adminRoutes = require("./routes/admin.routes");


// ================= API ROUTES =================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);


// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "HireTrack API is running successfully",
  });
});


// ================= 404 ROUTE =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ================= GLOBAL ERROR HANDLER =================

const errorMiddleware = require("./middlewares/error.middleware");

app.use(errorMiddleware);

module.exports = app;