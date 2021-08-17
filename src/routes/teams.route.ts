import mongoose from 'mongoose';
import express, { Express } from "express";
import * as socketio from 'socket.io';
import { Team, ITeam } from '../models';
import { TeamController, UserController, MatchmakingController } from '../controllers';
import { authMiddleware } from '../middlewares';

const teamRouter = express.Router()

/**
 * Get all teams
 */
teamRouter.get('/', async (req: any, res: any) => {
    const result = await Team.find();
    res.json({ res: result });
})

/**
 * Get team by id
 */
teamRouter.get('/:teamId', async (req: any, res: any) => {

    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const result = await Team.findById(req.params.teamId);

    if (result) {
        res.json({ res: result });
    } else {
        res.status(404).end();
    }
})

/**
 * Create new team
 */
teamRouter.post('/', async (req: any, res: any) => {

    const team = new Team({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    })

    try {
        const newTeam = await team.save();
        res.status(201).json({ res: newTeam });
    } catch (err) {
        res.status(400).end();
    }
})

/**
 * Update created team
 */
teamRouter.patch('/:teamId', async (req: any, res: any) => {

    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const team = await Team.findById(req.params.teamId);

    if (team) {
        try {
            team.set(req.body);
            await team.save();

            res.status(200).end();
        } catch (err) {
            res.status(400).end();
        }
    } else {
        return res.status(404).end();
    }

})

/**
 * Allow users to invite new players in their team 
 */
teamRouter.post('/invitation/:teamId', async (req: any, res: any) => {

    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const teamExist = await Team.findById(req.params.teamId)

    if (!teamExist) return res.status(404).end();

    const userIds = req.body.user_ids;

    if(userIds === undefined) return res.status(400).end();
    
    const teamController = new TeamController();
    const inviteUsers = await teamController.inviteUsers(userIds, teamExist);

    if(!inviteUsers) return res.status(409).end();
        
    res.status(200).end();
})

/**
 * Crete new team lobby
 */
teamRouter.get('/create/:teamId', async (req: any, res: any) => {    
    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end();

    const teamExist = await Team.findById(req.params.teamId);

    if (teamExist) {
        res.sendFile(__dirname + '/ready.html');
    } else {
        res.status(404).end();
    }
});

/**
 * Join a team lobby to start a matchmaking
 */
teamRouter.get('/lobby/:teamId', /*authMiddleware,*/ async (req: any, res: any) => {
    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const teamExist = await Team.findById(req.params.teamId)

    if (!teamExist) return res.status(404).end();

    const userId = '60c8d9309fe81b008b414ab1'/*req.user._id*/;

    if(userId === undefined) return res.status(403).end();

    const userController = new UserController();
    const isPlayerOf = await userController.isPlayerOf(userId, req.params.teamId);

    if(!isPlayerOf) return res.status(401).end();

    if (teamExist) {    
        res.sendFile(__dirname + '/join.html');
    } else {
        res.status(404).end();
    }
});

/**
 * Find an ennemy team
 */
teamRouter.get('/find/:teamId', authMiddleware, async (req: any, res: any) => {
    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const teamExist = await Team.findById(req.params.teamId)

    if (!teamExist) return res.status(404).end();

    const matchmakingController = new MatchmakingController();
    const joinQueue = await matchmakingController.joinQueue(teamExist);

    if (joinQueue) {    
        res.status(201).json({ res: teamExist });
    } else {
        res.status(404).end();
    }
})

/**
 * Delete team
 */
teamRouter.delete('/:teamId', async (req: any, res: any) => {

    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const result = await Team.findByIdAndRemove(req.params.teamId);

    if (result) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})

export { teamRouter }