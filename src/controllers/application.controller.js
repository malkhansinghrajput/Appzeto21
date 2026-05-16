const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const {
  applyJobService,
  getMyApplicationsService,
  getJobApplicationsService,
  updateApplicationStatusService,
  withdrawApplicationService,
} = require("../services/application.service");


// ================= APPLY JOB =================

const applyJob = asyncHandler(
  async (req, res) => {
    const application =
      await applyJobService(
        req.params.jobId,
        req.user._id,
        req.body
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Job application submitted successfully",
        application
      )
    );
  }
);


// ================= MY APPLICATIONS =================

const getMyApplications =
  asyncHandler(async (req, res) => {
    const applications =
      await getMyApplicationsService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Applications fetched successfully",
        applications
      )
    );
  });


// ================= JOB APPLICATIONS =================

const getJobApplications =
  asyncHandler(async (req, res) => {
    const applications =
      await getJobApplicationsService(
        req.params.jobId,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Applications fetched successfully",
        applications
      )
    );
  });


// ================= UPDATE APPLICATION STATUS =================

const updateApplicationStatus =
  asyncHandler(async (req, res) => {
    const updatedApplication =
      await updateApplicationStatusService(
        req.params.id,
        req.body.status,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Application status updated successfully",
        updatedApplication
      )
    );
  });


// ================= WITHDRAW APPLICATION =================

const withdrawApplication =
  asyncHandler(async (req, res) => {
    await withdrawApplicationService(
      req.params.id,
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Application withdrawn successfully"
      )
    );
  });

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};