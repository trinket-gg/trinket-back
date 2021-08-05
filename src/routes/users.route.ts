import mongoose from 'mongoose';
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
import express from "express";
import { UserController } from '../controllers/user.controller';
import { Team, User } from '../models'
import auth from '../middlewares/auth.middleware'

const userRouter = express.Router()

/**
 * Get all users
 */
userRouter.get('/', async (_, res: any) => {
  const result = await User.find()
  res.json(result)
})

/**
 * Get user by id
 */
userRouter.get('/:userId', async (req: express.Request, res: express.Response) => {
  
  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const result = await User.findById(req.params.userId)
  
  if (result) {
    res.json({ res: result })
  } else {
    res.status(404).end()
  }

})


/**
 * Create new user
 */
userRouter.post('/', async (req: express.Request, res: express.Response) => {

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body
  })

  try { 
    const newUser = await user.save()
    res.status(201).json({ res: newUser })
  } catch (err) { 
    res.status(400).end()
  }

})

/**
 * User created login
 */
userRouter.post('/login', async (req: express.Request, res: express.Response) => {

  const user = await User.findOne({ email: req.body?.email })

  if (user) {

    const validPwd = await bcrypt.compare(req.body?.password ?? '', user.password)
    if (!validPwd) return res.status(400).end()

    const token = jwt.sign({ user: { _id: user._id, email: user.email, password: user.password, username_riot: user.username_riot, birthdate: user.birthdate }}, process.env.TOKEN_SECRET)

    try {
      user.tokens.push(token)
      await user.save()
    } catch (err) {
      return res.status(400).end()
    }
    
    res.status(200).json({ res: token })

  } else {
    res.status(404).end()
  }

})


/**
 * Update user
 */
userRouter.patch('/:userId', async (req: express.Request, res: express.Response) => {

  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const user = await User.findById(req.params.userId)

  if (user) {
    try {
      user.set(req.body)
      await user.save()

      res.status(200).end()
    } catch (err) {
      res.status(400).end()
    }
  } else {
    return res.status(404).end()
  }

})

/**
 * Allow users to invite new players in their team 
 */
userRouter.post('/invitation/:teamId', async (req: express.Request, res: express.Response) => {

  if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const teamExist = await Team.findById(req.params.teamId)        
  if (!teamExist) return res.status(404).end();
    
  const userres = req.body.res;
  if (userres === undefined) return res.status(404).end();

  // Get user id by COOKIE
  
  // Add verif

  const userController = new UserController();
  const resInvitation = await userController.replyInvitation("609c09c4a9e7f40469c7e163", req.params.teamId, userres);

  if(!resInvitation) return res.status(409).end();
      
  res.status(200).end();
})

/**
 * Delete user
 */
userRouter.delete('/:userId', async (req: express.Request, res: express.Response) => {

  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const result = await User.findByIdAndRemove(req.params.userId)

  if (result) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }

})

export { userRouter }