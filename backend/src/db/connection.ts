import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  //process.exit(-1);
});

export default pool;
