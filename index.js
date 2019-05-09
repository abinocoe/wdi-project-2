const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const environment = app.get("env");
const config = require("./config/config");
const router = require("./config/routes");

mongoose.connect(config.db[environment], { useMongoClient: true });

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(`${__dirname}/public`));
app.use("/", router);
app.use("/api", router);

app.listen(config.port, () => console.log(`WooooHoooo on port ${config.port}`));
module.exports = app;
