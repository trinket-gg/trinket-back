import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');

export interface IUser extends Document {
  _id: string,
  email: string,
  password: string,
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
});

userSchema.pre<IUser>('save', async function(next: any) {

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