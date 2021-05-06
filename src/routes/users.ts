import mongoose from 'mongoose';
import User from '../models/User'

async function routes(fastify: any, options: any) {

  fastify.get('/', async () => {
    const result = await User.find()
    return { res: result }
  })

  fastify.get('/:userId', async (request: any, reply: any) => {
    const result = await User.findById(request.params.userId)
    if (result) {
      return { res: result }
    } else {
      reply.code(404)
      return { res: 'User not found' }
    }
  })

  fastify.post('/', async (request: any, reply: any) => {

    const user = new User({
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

  fastify.patch('/:userId', async (request: any, reply: any) => {

    const user = await User.findById(request.params.userId)

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

  fastify.delete('/:userId', async (request: any, reply: any) => {

    const result = await User.findByIdAndRemove(request.params.userId)
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