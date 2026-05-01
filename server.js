const express = require("express");
const { existsSync } = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // parse JSON bodies

// request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// serve frontend files
app.use(express.static(__dirname));

// Environment variable
const greeting = process.env.GREETING || "Hello from your deployed app!";

// In-memory storage
let items = [];


// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "proj3.html"));
});

// Env test route
app.get("/api/message", (req, res) => {
  res.json({ message: greeting });
});

// GET/api/items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// POST/api/items
app.post("/api/items", (req, res) => {
  const item = req.body;

  // simple validation
  if (!item || !item.name) {
    return res.status(400).json({ error: "Item must have a name" });
  }

  const newItem = {
    id: Date.now(),
    name: item.name
  };

  items.push(newItem);

  res.json({
    message: "Item added successfully",
    items
  });
});

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});