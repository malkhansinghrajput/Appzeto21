const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/job.controller");

const protect = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  createJobValidator,
  updateJobValidator,
} = require("../validators/job.validator");


// ================= PUBLIC ROUTES =================

router.get("/", getAllJobs);

router.get("/:id", getSingleJob);


// ================= COMPANY ROUTES =================

router.post(
  "/",
  protect,
  allowRoles("company"),
  createJobValidator,
  validate,
  createJob
);

router.put(
  "/:id",
  protect,
  allowRoles("company"),
  updateJobValidator,
  validate,
  updateJob
);

router.delete(
  "/:id",
  protect,
  allowRoles("company"),
  deleteJob
);

router.get(
  "/company/my-jobs",
  protect,
  allowRoles("company"),
  getMyJobs
);

module.exports = router;