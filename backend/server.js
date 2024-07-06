const express = require("express");
const http = require("http");
const path = require("path");
const passport = require("passport");
const cors = require("cors");

require("dotenv").config();

const DrawingService = require("./drawing-service");
const Database = require("./database");
const authRoute = require("./routes/auth.route");
const boardRoute = require("./routes/board.route");
// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());

// Passport configuration
require("./config/passport")(passport);

// Database connection
const db = new Database();
db.start();

// Drawing Service
new DrawingService(server);

// Routes
app.use("/auth", authRoute);
app.use("/board", boardRoute);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
