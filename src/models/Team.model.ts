import mongoose, {Schema, Document} from 'mongoose';

export interface ITeam extends Document {
    _id: string,
    name: string,
    tag: string,
    logo: string,
    last_game_date: Date,
    status: boolean,
    elo: number,
    admin_id: string,
    user_ids: Array<string>
}

const teamSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true,  minLength: 3, maxLength: 24 },
    tag: { type: String, required: true, minLength: 3, maxLength: 5 },
    logo: { type: String, required: true },
    last_game_date: Date,
    status: Boolean, // 0 --> provisionnal | 1 --> ranked

    elo: { type: Number, default: 500 },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_ids: {
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        validate: [validator, '{PATH} exceeds the limit of 10']
    }
},{
    // add created_date and updated date
    timestamps: true 
});

teamSchema.pre<ITeam>('save', async function(next: any) {

    if (this.isModified('name')) {
        const nameExists = await Team.exists({ name: this.name });
        if (nameExists) return next(new Error('Name already exists !'));
    }

    if (this.isModified('tag')) {
        const tagExists = await Team.exists({ tag: this.tag });
        if (tagExists) return next(new Error('Tag already exists !'));
    }

    if (this.isModified('elo')) {
        if (this.elo < 0) {
            this.elo = 0;
        }
    }

    return next();

});

function validator(user_number: Array<mongoose.Schema.Types.ObjectId>) {
    return user_number.length <= 10;
}

const Team =  mongoose.model<ITeam>('Team', teamSchema);

export { Team };
