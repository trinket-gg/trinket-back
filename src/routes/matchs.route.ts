import mongoose from 'mongoose';
import express from "express";
import { Match } from '../models';

const matchRouter = express.Router()

/**
 * Get all Matchs
 */
 matchRouter.get('/', async (_, res: express.Response) => {
    const result = await Match.find();
    res.json({ res: result });
})

/**
 * Get Match by id
 */
matchRouter.get('/:MatchId', async (req: express.Request, res: express.Response) => {

    if (!req.params.MatchId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const result = await Match.findById(req.params.MatchId);

    if (result) {
        res.json({ res: result });
    } else {
        res.status(404).end();
    }
})

/**
 * Create new Match
 */
matchRouter.post('/', async (req: express.Request, res: express.Response) => {

    const match = new Match({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    })

    try {
        const newMatch = await match.save();
        res.status(201).json({ res: newMatch });
    } catch (err) {
        res.status(400).end();
    }
})

/**
 * Update created Match
 */
matchRouter.patch('/:MatchId', async (req: express.Request, res: express.Response) => {

    if (!req.params.MatchId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const match = await Match.findById(req.params.MatchId);

    if (match) {
        try {
            match.set(req.body);
            await match.save();

            res.status(200).end();
        } catch (err) {
            res.status(400).end();
        }
    } else {
        return res.status(404).end();
    }

})

/**
 * Delete Match
 */
matchRouter.delete('/:MatchId', async (req: express.Request, res: express.Response) => {

    if (!req.params.MatchId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end()

    const result = await Match.findByIdAndRemove(req.params.MatchId);

    if (result) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})

export { matchRouter }