import mongoose from 'mongoose';
import {Rank} from '../models';

async function routes(fastify: any, options: any) {

    fastify.get('/', async () => {
        const result = await Rank.find();
        return { res: result };
    });

    fastify.get('/:rankId', async (request: any, reply: any) => {
        const result = await Rank.findById(request.params.rankId);
        if (result) {
            return { res: result };
        } else {
            reply.code(404);
            return { res: 'Rank not found' };
        }
    });

    fastify.post('/', async (request: any, reply: any) => {

        const rank = new Rank({
            _id: new mongoose.Types.ObjectId(),
            ...request.body
        });

        try {
            const newRank = await rank.save();
            reply.code(201);
            return { res: newRank };
        } catch (err) {;
            reply.code(400);
            return { res: err.message };
        }

    });

    fastify.patch('/:rankId', async (request: any, reply: any) => {

        const rank = await Rank.findById(request.params.rankId);

        if (rank) {
            try {
                rank.set(request.body);
                await rank.save();

                reply.code(200);
                return { res: 'Rank updated successfully' };
            } catch (err) {
                reply.code(400);
                return { res: err.message };
            }
        } else {
            reply.code(404);
            return { res: 'Rank not found' };
        }

    });

    fastify.delete('/:rankId', async (request: any, reply: any) => {

        const result = await Rank.findByIdAndRemove(request.params.rankId);
        if (result) {
            reply.code(204);
        } else {
            reply.code(404);
            return { res: 'Rank not found' };
        }

    });

}

module.exports = routes;
module.exports.autoPrefix = '/ranks';
