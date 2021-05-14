import mongoose, {Schema, Document} from 'mongoose'
import {RankInfo, RankController} from "../controllers";

export interface IRank extends Document {
    _id: string,
    elo: number,
    rank: string
}

const rankSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    elo: { type: Number, required: true, unique: true },
    rank: { type: String, required: true }
});

rankSchema.pre<IRank>('save', async function(next: any) {

    if (this.isModified('elo')) {
        if (this.elo < 0) {
            this.elo = 0;
        }
        const rankController: RankController = await RankController.getInstance();
        const rank: RankInfo = await rankController.getCorrespondingRank(this.elo);
        this.rank = rank.name;
    }
    return next();

});

export const Rank = mongoose.model<IRank>('User', rankSchema);
