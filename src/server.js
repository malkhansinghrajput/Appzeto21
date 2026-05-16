const dotenv = require("dotenv");
const path = require("path");
const logger = require("./utils/logger");

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log(process.env.MONGO_URI);

const app = require("./app");

const connectDB = require("./config/db");


// ================= PORT =================

const PORT =
  process.env.PORT || 5000;


// ================= START SERVER =================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT}`
      );

      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error(error.message);

    console.error(error);

    process.exit(1);
  }
};

startServer();