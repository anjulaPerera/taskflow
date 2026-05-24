import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default testPool;
