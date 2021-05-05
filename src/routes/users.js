const mongoose = require('mongoose')
const userSchema = require('../models/User')

async function routes(fastify, options) {

  fastify.get('/', async () => {
    const result = await userSchema.find()
    return { res: result }
  })

  fastify.get('/:userId', async (request, reply) => {
    const result = await userSchema.findById(request.params.userId)
    if (result) {
      return { res: result }
    } else {
      reply.code(404)
      return { res: 'User not found' }
    }
  })

  fastify.post('/', async (request, reply) => {

    const user = new userSchema({ 
      _id: new mongoose.Types.ObjectId(),
      ...request.body
    })

    try { 
      const newUser = await user.save()
      reply.code(201)
      return { res: newUser }
    } catch (err) { 
      reply.code(400)
      return { res: err.message }
    }

  })

  fastify.patch('/:userId', async (request, reply) => {

    const user = await userSchema.findById(request.params.userId)

    if (user) {
      try {
        user.set(request.body)
        await user.save()

        reply.code(200)
        return { res: 'User updated successfully' }
      } catch (err) {
        reply.code(400)
        return { res: err.message }
      }
    } else {
      reply.code(404)
      return { res: 'User not found' }
    }

  })

  fastify.delete('/:userId', async (request, reply) => {

    const result = await userSchema.findByIdAndRemove(request.params.userId)
    if (result) {
      reply.code(204)
    } else {
      reply.code(404)
      return { res: 'User not found' }
    }

  })

}

module.exports = routes
module.exports.autoPrefix = '/users'