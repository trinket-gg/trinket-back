import express, { Express } from "express";
import { buildRoutes } from "./routes";
import { config } from "dotenv";
import * as socketio from 'socket.io';
config();

const app: Express = express();

const mongoose = require('mongoose')

try {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
} catch (e) {
  console.error(e)
}

app.use(express.json())

buildRoutes(app)

const port = 4000;
const server = app.listen(port, '0.0.0.0', function() {
    console.log(`Listening on ${port}...`);
});

const io = require('socket.io')(server);

io.on('connection', (socket: socketio.Socket) => {
    console.log('connection');
})
