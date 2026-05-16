const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const ApiError = require("../utils/ApiError");


// ================= GET USERS =================

const getAllUsersService = async (
  query
) => {
  const {
    page = 1,
    limit = 10,
    role,
  } = query;

  const pageNumber = parseInt(page);

  const limitNumber = Math.min(
    parseInt(limit),
    50
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  const [users, total] =
    await Promise.all([
      User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(limitNumber)
        .sort({
          createdAt: -1,
        }),

      User.countDocuments(filter),
    ]);

  return {
    users,
    total,
    page: pageNumber,
    totalPages: Math.ceil(
      total / limitNumber
    ),
  };
};


// ================= TOGGLE BAN USER =================

const toggleBanUserService =
  async (userId) => {
    const user = await User.findById(
      userId
    );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    user.isActive = !user.isActive;

    await user.save();

    return user;
  };


// ================= DELETE JOB =================

const deleteJobByAdminService =
  async (jobId) => {
    const job = await Job.findById(
      jobId
    );

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    await job.deleteOne();

    return true;
  };


// ================= PLATFORM STATS =================

const getPlatformStatsService =
  async () => {
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      reviewedApplications,
      shortlistedApplications,
      rejectedApplications,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "candidate",
      }),

      User.countDocuments({
        role: "company",
      }),

      Job.countDocuments(),

      Job.countDocuments({
        isActive: true,
      }),

      Application.countDocuments(),

      Application.countDocuments({
        status: "pending",
      }),

      Application.countDocuments({
        status: "reviewed",
      }),

      Application.countDocuments({
        status: "shortlisted",
      }),

      Application.countDocuments({
        status: "rejected",
      }),
    ]);

    return {
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,

      applicationsByStatus: {
        pending:
          pendingApplications,

        reviewed:
          reviewedApplications,

        shortlisted:
          shortlistedApplications,

        rejected:
          rejectedApplications,
      },
    };
  };

module.exports = {
  getAllUsersService,
  toggleBanUserService,
  deleteJobByAdminService,
  getPlatformStatsService,
};