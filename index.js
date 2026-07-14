require("dotenv").config();

const functions = require("@google-cloud/functions-framework");
const express = require("express");
const cors = require("cors");

const { requireApiKey } = require("./src/middleware/requireApiKey");
const { errorHandler } = require("./src/middleware/errorHandler");
const customerPointsRouter = require("./src/routes/customerPoints");

const app = express();

app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "").split(",").map((origin) => origin.trim()),
    methods: ["POST"],
  })
);

app.use("/api/customers", requireApiKey, customerPointsRouter);

app.use(errorHandler);

functions.http("yotpoProxy", app);
