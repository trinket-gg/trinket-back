import express from "express";
import { User } from '../models';

const jwt = require('jsonwebtoken')

async function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if (!auth) return res.status(401).send('');

    const token = auth.slice(7);
      
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findById(verified._id)
        if(!user?.tokens.includes(token)) return res.status(400).send('');

    } catch (err) {
        return res.status(400).send('')
    }

  next()
}

export { adminMiddleware };