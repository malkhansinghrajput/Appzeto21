const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const {
  getAllUsersService,
  toggleBanUserService,
  deleteJobByAdminService,
  getPlatformStatsService,
} = require("../services/admin.service");


// ================= GET ALL USERS =================

const getAllUsers =
  asyncHandler(async (req, res) => {
    const result =
      await getAllUsersService(
        req.query
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Users fetched successfully",
        result
      )
    );
  });


// ================= TOGGLE BAN USER =================

const toggleBanUser =
  asyncHandler(async (req, res) => {
    const user =
      await toggleBanUserService(
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        `User ${
          user.isActive
            ? "unbanned"
            : "banned"
        } successfully`,
        user
      )
    );
  });


// ================= DELETE JOB =================

const deleteJobByAdmin =
  asyncHandler(async (req, res) => {
    await deleteJobByAdminService(
      req.params.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Job deleted successfully"
      )
    );
  });


// ================= PLATFORM STATS =================

const getPlatformStats =
  asyncHandler(async (req, res) => {
    const stats =
      await getPlatformStatsService();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Platform stats fetched successfully",
        stats
      )
    );
  });

module.exports = {
  getAllUsers,
  toggleBanUser,
  deleteJobByAdmin,
  getPlatformStats,
};