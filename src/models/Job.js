const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    min: {
      type: Number,
    },

    max: {
      type: Number,
    },

    currency: {
      type: String,
      default: "INR",
    },
  },
  {
    _id: false,
  }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 5000,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "internship"],
    },

    salary: salarySchema,

    skillsRequired: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    openings: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Openings must be an integer",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deadline: {
      type: Date,

      validate: {
        validator: function (value) {
          if (!value) return true;

          return value > new Date();
        },

        message: "Deadline must be a future date",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);