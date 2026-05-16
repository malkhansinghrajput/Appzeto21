const Application = require("../models/Application");
const Job = require("../models/Job");

const ApiError = require("../utils/ApiError");


// ================= APPLY JOB =================

const applyJobService = async (
  jobId,
  userId,
  payload
) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(
      404,
      "Job not found"
    );
  }

  if (!job.isActive) {
    throw new ApiError(
      400,
      "This job is no longer accepting applications."
    );
  }

  if (
    job.deadline &&
    new Date(job.deadline) < new Date()
  ) {
    throw new ApiError(
      400,
      "The application deadline for this job has passed."
    );
  }

  const existingApplication =
    await Application.findOne({
      job: jobId,
      candidate: userId,
    });

  if (existingApplication) {
    throw new ApiError(
      409,
      "You have already applied for this job."
    );
  }

  const application =
    await Application.create({
      job: jobId,
      candidate: userId,
      coverLetter:
        payload.coverLetter,
    });

  return application;
};


// ================= MY APPLICATIONS =================

const getMyApplicationsService =
  async (userId) => {
    const applications =
      await Application.find({
        candidate: userId,
      })
        .populate("job")
        .sort({
          createdAt: -1,
        });

    return applications;
  };


// ================= JOB APPLICATIONS =================

const getJobApplicationsService =
  async (jobId, userId) => {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    if (
      job.company.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to view these applications."
      );
    }

    const applications =
      await Application.find({
        job: jobId,
      })
        .populate(
          "candidate",
          "name email skills resumeUrl"
        )
        .sort({
          createdAt: -1,
        });

    return applications;
  };


// ================= UPDATE STATUS =================

const updateApplicationStatusService =
  async (
    applicationId,
    status,
    userId
  ) => {
    const application =
      await Application.findById(
        applicationId
      ).populate("job");

    if (!application) {
      throw new ApiError(
        404,
        "Application not found"
      );
    }

    if (
      application.job.company.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to update this application."
      );
    }

    application.status = status;

    await application.save();

    return application;
  };


// ================= WITHDRAW APPLICATION =================

const withdrawApplicationService =
  async (
    applicationId,
    userId
  ) => {
    const application =
      await Application.findById(
        applicationId
      );

    if (!application) {
      throw new ApiError(
        404,
        "Application not found"
      );
    }

    if (
      application.candidate.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "You are not allowed to withdraw this application."
      );
    }

    if (
      application.status !== "pending"
    ) {
      throw new ApiError(
        400,
        "Only pending applications can be withdrawn."
      );
    }

    await application.deleteOne();

    return true;
  };

module.exports = {
  applyJobService,
  getMyApplicationsService,
  getJobApplicationsService,
  updateApplicationStatusService,
  withdrawApplicationService,
};