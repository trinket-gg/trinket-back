import mongoose, {Schema, Document} from 'mongoose'

export interface IInvitation extends Document {
    _id: string,
    status: string,
    team_id: string,
    user_id: string
}

const invitationSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    status: { type: String, required: true },
    
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    user_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{
    timestamps: true 
});

const Invitation = mongoose.model<IInvitation>('Invitation', invitationSchema);

export { Invitation }