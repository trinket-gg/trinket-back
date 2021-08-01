import mongoose, {Schema, Document} from 'mongoose'

export interface IMatch extends Document {
    _id: string,
    game_duration: string,
    participants: [{
      team_id: string,
      champion_id: string,
      rune_id: string,
      stats: [{
        kills: number,
        deaths: number,
        assists: number
      }],
      side: number,
      spell1id: string,
      spell2id: string,
      item_ids: [ string ],
      champ_lvl: string,
      cs: number
    }],
    stats: [{
      side: number,
      win: boolean
    }]
}

const matchSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game_duration: { type: String, required: true },
    participants: [{
      team_id: { type: String, required: true },
      champion_id: { type: String, required: true },
      rune_id: { type: String, required: true },
      stats: [{
        kills: { type: Number, required: true },
        deaths: { type: Number, required: true },
        assists: { type: Number, required: true }
      }],
      side: { type: Number, required: true },
      spell1id: { type: String, required: true },
      spell2id: { type: String, required: true },
      item_ids: [ { type: String, required: true } ],
      champ_lvl: { type: Number, required: true },
      cs: { type: Number, required: true }
    }],
    stats: [{
      side: { type: Number, required: true },
      win: { type: Boolean, required: true }
    }]
},{
    timestamps: true 
});

const Match = mongoose.model<IMatch>('Match', matchSchema);

export { Match }