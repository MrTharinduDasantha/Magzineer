// MongoDB connection setup using Mongoose
import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and exit the process if the database connection fails
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
