const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Default is 5432
});

// Optional: Test the connection when the application starts
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release(); // Release the client back to the pool
});

module.exports = pool;