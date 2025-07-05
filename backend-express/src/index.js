const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const router = require("./routes");

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.get("/uploads/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads/", req.params.filename));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server.`);
});
