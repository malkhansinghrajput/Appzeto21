const express = require("express");

const router = express.Router();

const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/application.controller");

const protect = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  applyJobValidator,
  updateApplicationStatusValidator,
} = require("../validators/application.validator");


// ================= CANDIDATE ROUTES =================

router.post(
  "/:jobId",
  protect,
  allowRoles("candidate"),
  applyJobValidator,
  validate,
  applyJob
);

router.get(
  "/my",
  protect,
  allowRoles("candidate"),
  getMyApplications
);

router.delete(
  "/:id",
  protect,
  allowRoles("candidate"),
  withdrawApplication
);


// ================= COMPANY ROUTES =================

router.get(
  "/job/:jobId",
  protect,
  allowRoles("company"),
  getJobApplications
);

router.put(
  "/:id/status",
  protect,
  allowRoles("company"),
  updateApplicationStatusValidator,
  validate,
  updateApplicationStatus
);

module.exports = router;