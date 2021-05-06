import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import fastifyAutoload from "fastify-autoload";
require('dotenv').config()

const path = require('path')
const mongoose = require('mongoose')

const fastify: FastifyInstance = Fastify({});

try {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
} catch (e) {
  console.error(e)
}

fastify.register(fastifyAutoload, { dir: path.join(__dirname, 'routes')})

const start = async () => {
  try {
    await fastify.listen(4000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();