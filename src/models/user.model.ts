import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');
const RiotRequest = require('riot-lol-api');

export interface IUser extends Document {
  _id: string,
  email: string,
  password: string,
  username_riot: string,
  birthdate: Date,
  tokens: [string]
}

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username_riot: { type: String, required: true },
  birthdate: Date,
  tokens: [String]
});

userSchema.pre<IUser>('save', async function(next: any) {

  if (this.isModified('username_riot')) {
    const riotRequest = new RiotRequest(process.env.RIOT_API_KEY)
    riotRequest.request('euw1', 'summoner', `/lol/summoner/v4/summoners/by-name/${this.username_riot}`, (err : any, data : any) => {
        if (data?.status?.status_code == 404) return next(new Error('usernameRiot'))
    });
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