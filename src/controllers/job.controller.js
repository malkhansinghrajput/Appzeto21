const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const {
  createJobService,
  getAllJobsService,
  getSingleJobService,
  updateJobService,
  deleteJobService,
  getMyJobsService,
} = require("../services/job.service");


// ================= CREATE JOB =================

const createJob = asyncHandler(
  async (req, res) => {
    const job =
      await createJobService(
        req.body,
        req.user._id
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Job created successfully",
        job
      )
    );
  }
);


// ================= GET ALL JOBS =================

const getAllJobs =
  asyncHandler(async (req, res) => {
    const result =
      await getAllJobsService(
        req.query
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Jobs fetched successfully",
        result
      )
    );
  });


// ================= GET SINGLE JOB =================

const getSingleJob =
  asyncHandler(async (req, res) => {
    const job =
      await getSingleJobService(
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Job fetched successfully",
        job
      )
    );
  });


// ================= UPDATE JOB =================

const updateJob =
  asyncHandler(async (req, res) => {
    const updatedJob =
      await updateJobService(
        req.params.id,
        req.body,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Job updated successfully",
        updatedJob
      )
    );
  });


// ================= DELETE JOB =================

const deleteJob =
  asyncHandler(async (req, res) => {
    await deleteJobService(
      req.params.id,
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Job deleted successfully"
      )
    );
  });


// ================= MY JOBS =================

const getMyJobs =
  asyncHandler(async (req, res) => {
    const jobs =
      await getMyJobsService(
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "My jobs fetched successfully",
        jobs
      )
    );
  });

module.exports = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getMyJobs,
};