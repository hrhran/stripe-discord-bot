const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const client = require('../config/bot')
const stripe = require('stripe')
const mailUser = require('../helpers/mailUser')

const Stripe = stripe(
  process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

const listenHook = asyncHandler(async (req, res) => {
    let event
    try {
      event = Stripe.webhooks.constructEvent(req.body, req.header('Stripe-Signature'),process.env.WEBHOOK_KEY)
    } catch (err) {
      console.log(err)
      return res.sendStatus(400)
    }

    const data = event.data.object
    console.log(event.type, data)
    switch (event.type) {
      case 'customer.created':{
        try{
          setTimeout(async()=>{
            const user = await User.findOne({ email: data.email })
            if(user){
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${data.email} has signed up.`)
              mailUser.sendWelcomeMail(user)
            }  
            console.log(JSON.stringify(data))
          },2250)
        }catch(err){
          console.log(err)
        }
        break
      }
  
      case 'customer.subscription.created': {
        try{
          const user = await User.findOne({ billingID: data.customer })
          if(user){
            user.subscribed = true
            user.inTrial = true
            user.endDate = new Date(data.current_period_end * 1000)
            await user.save()
            //mailUser.sendWelcomeMail(user)
            client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has started their trial period - ends on ${user.endDate.toString().split('+')[0]}.`)
          }
          break
        }
        catch(err){
          console.log(err)
          break
        }
      }
      case 'customer.subscription.deleted': {
        try{
          const user = await User.findOne({ billingID: data.customer })
          if(user){
            user.subscribed = false
            user.inTrial = false
            user.endDate= null
            await user.save()
            if(user.discord_id !== ''){
                const guild = client.guilds.cache.get(process.env.GUILD_ID);
                const inServer = await guild.members.fetch(user.discord_id)
                inServer.roles.remove(process.env.ROLE_ID)
            }
            client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} 's subscription period has ended.`)
          }
          break
        }catch(err){
          console.log(err)
          break
        }
      }

      case "customer.subscription.updated":{
        try{
          const user = await User.findOne({ billingID: data.customer })
          const isOnTrial = data.status === 'trialing'
          if(user){
            const prevDate = user.endDate;
            if (isOnTrial) {
              user.inTrial = true
            } else if (data.status === 'active') {
              user.inTrial = false
            }
            user.endDate = new Date(data.current_period_end * 1000)
            await user.save()
            if(data.cancel_at_period_end){
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has cancelled their subscription - ends on ${user.endDate.toString().split('+')[0]}.`)
            }else if(new Date(prevDate).getTime() === data.current_period_end * 1000 && !data.cancel_at_period_end){
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has decided to renew/continue their subscription - ends on ${user.endDate.toString().split('+')[0]}.`)
            }else{
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has started their next billing period till ${user.endDate.toString().split('+')[0]}.`)
            }
          }
          break;
        }catch(err){
          console.log(err)
          break
        }
    }

      // case 'invoice.payment_succeeded':
      //   const user = await User.findOne({ billingID: data.customer })
      //   const isOnTrial = data.status === 'trialing'
      //   if (isOnTrial) {
      //     user.inTrial = true
      //     user.endDate = new Date(data.current_period_end * 1000)
      //   } else if (data.status === 'active') {
      //     user.inTrial = false
      //     user.endDate = new Date(data.current_period_end * 1000)
      //   }
      //   await user.save()
      //   break;

      default:
    }
    res.sendStatus(200)
  })

  module.exports = {
    listenHook
  }
  