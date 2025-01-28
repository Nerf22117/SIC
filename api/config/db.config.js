import mongoose from "mongoose";

/**
 * Asynchronously connects to the MongoDB database using the connection string
 * provided in the environment variable `MONGO_URI`.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws Will throw an error if the connection fails and exits the process with status code 1.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
