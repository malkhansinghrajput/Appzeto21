const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");


// ================= CREATE JOB =================

const createJobService = async (
  payload,
  companyId
) => {
  const job = await Job.create({
    ...payload,
    company: companyId,
  });

  return job;
};


// ================= GET ALL JOBS =================

const getAllJobsService = async (
  query
) => {
  const {
    page = 1,
    limit = 10,
    location,
    type,
    keyword,
    minSalary,
  } = query;

  const pageNumber = parseInt(page);

  const limitNumber = Math.min(
    parseInt(limit),
    50
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  const filter = {
    isActive: true,
  };

  if (keyword) {
    filter.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        description: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  if (type) {
    filter.type = type;
  }

  if (minSalary) {
    filter["salary.min"] = {
      $gte: Number(minSalary),
    };
  }

  const [jobs, total] =
    await Promise.all([
      Job.find(filter)
        .populate(
          "company",
          "name companyName email"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Job.countDocuments(filter),
    ]);

  return {
    jobs,
    total,
    page: pageNumber,
    totalPages: Math.ceil(
      total / limitNumber
    ),
  };
};


// ================= GET SINGLE JOB =================

const getSingleJobService = async (
  jobId
) => {
  const job = await Job.findById(jobId)
    .populate(
      "company",
      "name companyName email"
    );

  if (!job) {
    throw new ApiError(
      404,
      "Job not found"
    );
  }

  return job;
};


// ================= UPDATE JOB =================

const updateJobService = async (
  jobId,
  payload,
  userId
) => {
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
      "You do not have permission to modify this job."
    );
  }

  Object.keys(payload).forEach((key) => {
    job[key] = payload[key];
  });

  await job.save();

  return job;
};


// ================= DELETE JOB =================

const deleteJobService = async (
  jobId,
  userId
) => {
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
      "You do not have permission to delete this job."
    );
  }

  job.isActive = false;

  await job.save();

  return true;
};


// ================= MY JOBS =================

const getMyJobsService = async (
  userId
) => {
  const jobs = await Job.find({
    company: userId,
  }).sort({
    createdAt: -1,
  });

  return jobs;
};

module.exports = {
  createJobService,
  getAllJobsService,
  getSingleJobService,
  updateJobService,
  deleteJobService,
  getMyJobsService,
};