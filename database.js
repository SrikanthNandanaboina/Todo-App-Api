const { createPool } = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const connectionData = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const pool = createPool(connectionData);

module.exports = pool;
