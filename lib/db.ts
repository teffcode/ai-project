/**
 * Configures and exports a PostgreSQL connection pool using the `pg` library.
 * 
 * - Loads environment variables from a `.env` file using `dotenv`.
 * - Ensures `DATABASE_URL` is defined before initializing the connection.
 * - Uses SSL in production to secure the connection.
 * 
 * @throws {Error} If `DATABASE_URL` is not defined in the environment variables.
 */

import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in the .env file");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;
