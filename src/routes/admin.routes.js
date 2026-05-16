const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  toggleBanUser,
  deleteJobByAdmin,
  getPlatformStats,
} = require("../controllers/admin.controller");

const protect = require("../middlewares/auth.middleware");

const allowRoles = require("../middlewares/role.middleware");


// ================= ADMIN ROUTES =================

router.get(
  "/users",
  protect,
  allowRoles("admin"),
  getAllUsers
);

router.put(
  "/users/:id/ban",
  protect,
  allowRoles("admin"),
  toggleBanUser
);

router.delete(
  "/jobs/:id",
  protect,
  allowRoles("admin"),
  deleteJobByAdmin
);

router.get(
  "/stats",
  protect,
  allowRoles("admin"),
  getPlatformStats
);

module.exports = router;