import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Ensure DB_DIALECT is a valid Dialect type
const dialect = (process.env.DB_DIALECT || "postgres") as Dialect;

const sequelize = new Sequelize(
  process.env.DB_NAME || "lancer",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "Wappnet@123",
  {
    host: process.env.HOST_NAME || "127.0.0.1",
    dialect: dialect, // Use typed dialect
    dialectOptions: {
      ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false, // This line will fix new error
      },
    },
    logging: console.log, // Set to false in production
    dialectModule: require("pg"), // Explicitly include pg to avoid dynamic import issues
  }
);

import User from "../models/User";

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    // Sync all models
    sequelize.sync({ alter: true })
      .then(() => console.log("All models were synchronized successfully."))
      .catch((err) => console.error("Model synchronization error:", err));
  })
  .catch((err) => console.error("Database connection error:", err));

export default sequelize;