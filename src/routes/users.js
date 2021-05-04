const mongoose = require('mongoose')

async function routes(fastify, options) {

  const userSchema = require('../models/User')

  fastify.get('/', async (request, reply) => {
    const result = await userSchema.find({})
    return result
  })

  fastify.post('/', async (request, reply) => {
    
    // Test create user
    const user = new userSchema({
      _id: new mongoose.Types.ObjectId(),
      email: 'yes@gmail.com',
      password: 'yes',
      username: 'HoreK',
      username_riot: 'HoreK',
    })

    try { 
      const newUser = await user.save()
      reply.send(newUser)
    } catch (err) {
      console.log(err)
      reply.code(400).send('Error while creating user')
    }

  })

}

module.exports = routes
module.exports.autoPrefix = '/users'