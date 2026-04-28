const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const greeting = process.env.GREETING || "Hello from your deployed app!";

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "proj3.html"));
});

app.get("/api/message", (req, res) => {
  res.json({ message: greeting });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});