import mongoose from 'mongoose';
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import User from '../models/User'
import auth from '../middlewares/auth.middleware'

async function routes(fastify: any, options: any) {


  // Get all users
  fastify.get('/', async () => {
    const result = await User.find()
    return { res: result }
  })
  
  // Get one user
  fastify.get('/:userId', async (request: any, reply: any) => {
    const result = await User.findById(request.params.userId)
    if (result) {
      return { res: result }
    } else {
      reply.code(404)
      return { res: 'User not found' }
    }
  })


  // Create user
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

  // Login User
  fastify.post('/login', async (request: any, reply: any) => {

    const user = await User.findOne({ email: request.body?.email })

    if (user) {

      const validPwd = await bcrypt.compare(request.body?.password ?? '', user.password)
      if (!validPwd) return reply.code(400).send('')

      const token = jwt.sign({ _id : user._id }, process.env.TOKEN_SECRET)

      try {
        user.tokens.push(token)
        await user.save()
      } catch (err) {
        return reply.code(400).reply('')
      }
      
      return reply.code(200).send(token)

    } else {
      return reply.code(404).send('')
    }

  })


  // Update one user
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


  // Delete one user
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