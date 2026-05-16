const { body } = require("express-validator");

const applyJobValidator = [
  body("coverLetter")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Cover letter cannot exceed 1000 characters"
    ),
];

const updateApplicationStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "reviewed",
      "shortlisted",
      "rejected",
    ])
    .withMessage("Invalid application status"),
];

module.exports = {
  applyJobValidator,
  updateApplicationStatusValidator,
};