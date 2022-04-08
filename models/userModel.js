const mongoose = require('mongoose')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    twitter:{
        type: String,
        required: [true, 'Please add a twitter username'],
    },
    from:{
        type:String,
    },
    referrer:{
      type: String,
      default: '',
    },
    affliateID:{
        type:String,
    },
    experience:{
        type: String,
        required: [true, 'Please add an experience'],
    },
    acc_size:{
        type: String,
        required: [true, 'Please add an account size'],
    },
    referral_code:{
      type: String,
    },
    billingID:{
      type: String,
    },
    subscribed:{
      type: Boolean,
      default: false,
    },
    discord_id:{
      type: String,
      default: '',
    },
    inTrial:{
      type: Boolean,
      default: false,
    },
    endDate: { type: Date,
       default: null,
   }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
