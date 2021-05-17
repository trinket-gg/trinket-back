import mongoose from 'mongoose';
import { Team } from '../models';
import { TeamController } from '../controllers';

async function routes(fastify: any, options: any) {

    /**
     * Get all teams
     */
    fastify.get('/', async (request: any, reply: any) => {
        const result = await Team.find();
        return reply.code(200).send({ res: result });
    })

    /**
     * Get team by id
     */
    fastify.get('/:teamId', async (request: any, reply: any) => {
        const result = await Team.findById(request.params.teamId);
        if (result) {
            return reply.code(200).send({ res: result });
        } else {
            return reply.code(404).send('');
        }
    })

    /**
     * Create new team
     */
    fastify.post('/', async (request: any, reply: any) => {
        const team = new Team({
            _id: new mongoose.Types.ObjectId(),
            ...request.body
        })

        try {
            const newTeam = await team.save();
            return reply.code(201).send({ res: newTeam });
        } catch (err) {
            return reply.code(400).send('');
        }
    })

    /**
     * Update created team
     */
    fastify.patch('/:teamId', async (request: any, reply: any) => {

        const team = await Team.findById(request.params.teamId);

        if (team) {
            try {
                team.set(request.body);
                await team.save();

                return reply.code(200).send('');
            } catch (err) {
                return reply.code(400).send('');
            }
        } else {
            return reply.code(404).send('');
        }

    })

    /**
     * Allow users to invite new players in their team 
     */
    fastify.post('/invitation/:teamId', async (request: any, reply: any) => {
        const teamExist = await Team.findById(request.params.teamId)
        const userIds = request.body.user_ids;
        if (!teamExist) {
            return reply.code(404).send('');
        }

        if(userIds === undefined) {
            return reply.code(400).send('');
        }
        
        const teamController = new TeamController();
        const inviteUsers = await teamController.inviteUsers(userIds, teamExist);

        if(!inviteUsers){
            return reply.code(409).send('');
        }
            
        return reply.code(200).send('');
    })

    /**
     * Delete team
     */
    fastify.delete('/:teamId', async (request: any, reply: any) => {
        const result = await Team.findByIdAndRemove(request.params.teamId);
        if (result) {
            return reply.code(204).send('');
        } else {
            return reply.code(404).send('');
        }
    })
    
}

module.exports = routes;
module.exports.autoPrefix = '/teams';