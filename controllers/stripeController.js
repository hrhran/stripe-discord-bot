const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const client = require('../config/bot')
const stripe = require('stripe')

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
        client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${data.email} has signed up.`)
        console.log(JSON.stringify(data))
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
            if (isOnTrial) {
              user.inTrial = true
            } else if (data.status === 'active') {
              user.inTrial = false
            }
            console.log(user.endDate)
            console.log(data.current_period_end * 1000)
            if(data.cancel_at_period_end){
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has cancelled their subscription - ends on ${user.endDate.toString().split('+')[0]}.`)
            }else if(new Date(user.endDate).getTime() === data.current_period_end * 1000 && !data.cancel_at_period_end){
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has decided to renew/continue their subscription - ends on ${user.endDate.toString().split('+')[0]}.`)
            }else{
              client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} has started their next billing cycle till ${user.endDate.toString().split('+')[0]}.`)
            }
            user.endDate = new Date(data.current_period_end * 1000)
            await user.save()
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
  