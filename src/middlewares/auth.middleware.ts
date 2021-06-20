const jwt = require('jsonwebtoken')
import { User } from '../models'

async function authMiddleware(request: any, reply: any, next: any) {

  const auth = request.headers['authorization'];
  if (!auth) return reply.status(401).send('');

  try {
    const token = auth.slice(7);
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(verified._id)
    if(!user?.tokens.includes(token)) return reply.status(400).send('');

    request.user = verified;
  } catch (err) {
    return reply.status(400).send('');
  }

  next()
  
}

export { authMiddleware };