import mongoose from 'mongoose';
import express from "express";
import { UserController } from '../controllers/user.controller';
import { Team, User } from '../models'
import auth from '../middlewares/auth.middleware'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fetch = require("node-fetch");

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
    try {
      const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-account/${result?.riot_summoner?.accountId}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
      })
      const data = await response.json()

      if (data?.status?.status_code == 404) {
        return res.status(404).json('usernameRiot')
      } else if (Object.entries(data).toString() !== Object.entries(result?.toJSON().riot_summoner).toString()) {
        result.riot_summoner = data
        await result.save()
      }
      res.json({ res: result })

    } catch (e) {
      res.status(400).end()
    }

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
    ...req.body,
    riot_summoner: {
      name: req.body.username_riot
    }
  })

  try {
    const newUser = await user.save()
    res.status(201).json({ res: newUser })
  } catch (err) {
    res.status(400).json(err.message)
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

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

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
userRouter.patch('/:userId', auth, async (req: express.Request, res: express.Response) => {

  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const userModified = await User.findById(req.params.userId)

  if (userModified) {
    try {
      userModified.set(req.body)
      await userModified.save()
      res.status(200).end()
    } catch (err) {
      res.status(400).json(err.message)
    }
  } else {
    return res.status(404).end()
  }

})

/**
 * Verify user riot account
 */
 userRouter.post('/verifyRiotCode/:userId', auth, async (req: express.Request, res: express.Response) => {

  if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

  const result = await User.findById(req.params.userId)

  if (result) {

    try {

      console.log(process.env.RIOT_API_KEY);
      
      const response = await fetch(`https://euw1.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${result.riot_summoner.id}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
      })
      
      const data = await response.json()

      console.log(req.body.generatedCode);
      console.log(data);
      console.log(req.body.generatedCode === data);
      
      if (data?.status?.status_code === 400) {
        return res.status(400).json('problemRiot')
      } else if (req.body.generatedCode === data) {
        result.riotAccountValidate = true
        await result.save()
      } else {
        return res.status(400).json('codesDoNotMatch')
      }
      
      res.status(200).end()

    } catch (e) {
      res.status(400).end()
    }
  } else {
    res.status(400).end()
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