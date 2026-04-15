const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require("fs"); // Added for SSL certificate
const path = require("path"); // Added for file paths
require("dotenv").config(); // Load environment variables

const app = express();


// Middleware
app.use(cors({ 
  // Use the live Vercel URL if it exists, otherwise use your local Vite dev server
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

app.use(express.json());
// Updated MySQL connection for Aiven
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    // This looks for the ca.pem file in your backend folder
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the Aiven database:", err);
    return;
  }
  console.log("Connected to the Aiven MySQL database.");
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running and connected to Aiven!");
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
        return res.status(500).json({ success: false, error: err.message });
      } else {
        res.status(201).json({
          success: true,
          message: "Employee created successfully",
          employeeId: results.insertId,
        });
      }
    },
  );
});

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
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
