const { body } = require("express-validator");

const createJobValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage(
      "Title must be between 3 and 120 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage(
      "Description must be between 20 and 5000 characters"
    ),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("type")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn([
      "full-time",
      "part-time",
      "contract",
      "internship",
    ])
    .withMessage("Invalid job type"),

  body("openings")
    .notEmpty()
    .withMessage("Openings field is required")
    .isInt({ min: 1 })
    .withMessage(
      "Openings must be a positive integer"
    ),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline date format")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error(
          "Deadline must be a future date"
        );
      }

      return true;
    }),

  body("salary.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum salary must be a number"),

  body("salary.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum salary must be a number")
    .custom((value, { req }) => {
      if (
        req.body.salary &&
        req.body.salary.min &&
        value < req.body.salary.min
      ) {
        throw new Error(
          "Maximum salary must be greater than minimum salary"
        );
      }

      return true;
    }),
];

const updateJobValidator = createJobValidator;

module.exports = {
  createJobValidator,
  updateJobValidator,
};