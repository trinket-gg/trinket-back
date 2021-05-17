import express, { Express } from "express";
import bodyParser from "body-parser";

import { config } from "dotenv";
config();

import { buildRoutes } from "./routes";

const app: Express = express();

const path = require('path')
const mongoose = require('mongoose')

try {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
} catch (e) {
  console.error(e)
}

app.use(express.json())

buildRoutes(app)

const port = 4000;
app.listen(port, '0.0.0.0', function() {
    console.log(`Listening on ${port}...`);
});