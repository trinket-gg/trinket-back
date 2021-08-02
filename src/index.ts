import express, { Express } from "express";

import { config } from "dotenv";
config();

import { buildRoutes } from "./routes";

import cors from "cors";

const app: Express = express();

const mongoose = require('mongoose')

try {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
} catch (e) {
  console.error(e)
}

const options: cors.CorsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(options))

app.use(express.json())

buildRoutes(app)

const port = 4000;
app.listen(port, '0.0.0.0', function() {
    console.log(`Listening on ${port}...`);
});