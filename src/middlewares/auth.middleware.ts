const jwt = require('jsonwebtoken')
import express from "express";
import { User } from '../models'

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  try {
    const token = req.headers["authorization"]?.slice(7)
    if (!token) return res.status(401).end()

    const tokenPayload = jwt.verify(token, process.env.TOKEN_SECRET)

    const user = await User.findById(tokenPayload._id)
    //if(!user?.tokens.includes(token)) return res.status(401).end()

    req.params.user = tokenPayload
  } catch (err) {
    return res.status(400).end()
  }

  next()
  
}