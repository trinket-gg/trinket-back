import express, { Express } from "express";
import bodyParser from "body-parser";
import * as socketio from 'socket.io';

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

const port = parseInt(process.env.DB_BACK || '4000',10);
const server = app.listen(port, '0.0.0.0', function() {
    console.log(`Listening on ${port}...`); 
});

const io = require('socket.io')(server);

io.on('connection', (socket: socketio.Socket) => {

  /**
   * Remove this and put session userId
   */
  function generateRandomId() {
    return 'xxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }

  console.log(generateRandomId() + ' user connected');

  socket.on('create-room', (room: any) => {
    socket.join(room);
    console.log(room + " room has been created !");
  });

  socket.on('join-room', (room: any, id: any) => {
    socket.join(room);
    console.log(id + " join the room " + room + " !");
  });

  // Look
  socket.on('show-user-room', (room: any) => {
    console.log(room);
    const lobby = io.sockets.adapter.rooms[room];
    console.log(lobby);
  });

  socket.on('find-game', (room: any) => {
    io.sockets.in(room);
    console.log(room + " : Waiting for a game ...");
  });
  
})