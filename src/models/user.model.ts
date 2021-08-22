import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');
const fetch = require("node-fetch");

export interface IUser extends Document {
  _id: string,
  email: string,
  password: string,
  riotAccountValidate: boolean,
  riot_summoner: { 
    accountId: string,
    profileIconId: number,
    revisionDate: number,
    name: string,
    id: string,
    puuid: string,
    summonerLevel: number
  },
  birthdate: Date,
  tokens: [string]
}

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  riotAccountValidate: Boolean,
  riot_summoner: {
    accountId: String,
    profileIconId: Number,
    revisionDate: Number,
    name: String,
    id: String,
    puuid: String,
    summonerLevel: Number
  },
  birthdate: Date,
  tokens: [String]
},{
  timestamps: true, // add createdAt and updatedAt
  versionKey: false // remove __v proprety
});

userSchema.pre<IUser>(['save', 'updateOne'], async function(next: any) {
 
  if (this.isModified('riot_summoner.name')) {
    const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${this.riot_summoner.name}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    })
    const data = await response.json()

    if (data?.status?.status_code == 404) {
      return next(new Error('usernameRiot'))
    } else {
      this.riot_summoner = data
      this.riotAccountValidate = false
    }
  }

  if (this.isModified('email')) {
    const emailExists: boolean = await User.exists({ email: this.email })
    if (emailExists) return next(new Error('emailExist'))
  }

  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error) {
    return next(error)
  }

})

const User = mongoose.model<IUser>('User', userSchema)

export { User }