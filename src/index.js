const path = require('path')
const autoload = require('fastify-autoload')
const mongoose = require('mongoose')

require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

try {
  mongoose.connect(process.env.DB_URL)
} catch (e) {
  console.error(e);
}

fastify.register(autoload, { dir: path.join(__dirname, 'routes')})

const start = async () => {
  try {
    await fastify.listen(4000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()