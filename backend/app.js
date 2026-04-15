const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "demoapp",
  password: "demoapp",
  database: "demoapp",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST route to add employee
app.post("/add-employee", (req, res) => {
  console.log("Received request to add employee:", req.body);

  const query =
    "INSERT INTO employee_test (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  const { first_name, last_name, email, password } = req.body;

  connection.query(
    query,
    [first_name, last_name, email, password],
    (err, results) => {
      if (err) {
        console.error("Error inserting employee:", err);
        // It's better to send the error message as JSON
        return res.status(500).json({ success: false, error: err.message });
      } else {
        // Send back a success response
        res.status(201).json({
          success: true,
          message: "Employee created successfully",
          employeeId: results.insertId,
        });
      }
    },
  ); // Fixed closing parenthesis here
}); // Fixed closing bracket here

app.post("/login", (req, res) => {
  console.log("Received login request:", req.body); 
    const { email, password } = req.body;
    const query = "SELECT * FROM employee_test WHERE email = ? AND password = ?";

    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ success: false, error: err.message });
      } else {
        if (results.length > 0) {
          res.json({ success: true, message: "Login successful" });
        } else {
          res.status(401).json({ success: false, message: "Invalid credentials" });
        }       
        }
    });
});
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
