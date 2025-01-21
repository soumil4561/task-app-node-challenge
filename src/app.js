const express = require("express");
const app = express();
const routes = require("./routes/api");

app.use("/api",routes);

module.exports = app;