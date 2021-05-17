const jwt = require('jsonwebtoken')
import { User } from '../models'

export default async function authMiddleware(request: any, reply: any, next: any) {

  const token = request.headers('Authorization')
  if (!token) return reply.code(401).send('')

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)

    const user = await User.findById(verified._id)
    if(!user?.tokens.includes(token)) return reply.code(400).send('')

    request.user = verified
  } catch (err) {
    return reply.code(400).send('')
  }

  next()
  
}