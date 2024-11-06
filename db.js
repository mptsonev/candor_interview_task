const mysql = require("mysql");

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "userdb",
});

module.exports = db;
