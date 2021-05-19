import mongoose from 'mongoose';
import express from "express";
import { Team, ITeam } from '../models';
import { TeamController } from '../controllers';

const teamRouter = express.Router()

/**
 * Get all teams
 */
 teamRouter.get('/', async (_, res: express.Response) => {
    const result = await Team.find();
    res.json({ res: result });
})

/**
 * Get team by id
 */
teamRouter.get('/:teamId', async (req: express.Request, res: express.Response) => {

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
teamRouter.post('/', async (req: express.Request, res: express.Response) => {

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
teamRouter.patch('/:teamId', async (req: express.Request, res: express.Response) => {

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
teamRouter.post('/invitation/:teamId', async (req: express.Request, res: express.Response) => {

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
 * Delete team
 */
teamRouter.delete('/:teamId', async (req: express.Request, res: express.Response) => {

    if (!req.params.teamId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const result = await Team.findByIdAndRemove(req.params.teamId);

    if (result) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})

export { teamRouter }