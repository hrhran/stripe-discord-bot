const dotenv = require("dotenv");
dotenv.config();
const conn = require("./config/connect");
const User = require("./models/userModel");
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5005
const client = require("./config/bot");



const app = express()

app.use(cors())
app.use('/bot/stripehook',bodyParser.raw({ type: 'application/json' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/bot', require('./routes/stripeRoutes'))
app.listen(port, () => console.log(`Backend running on localhost:${port}`))


const prefix = "-";

client.on("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
//     client.users.fetch("302120394243047426").then(dm => {
//     dm.send('Message to send')
// })
// client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`TEST 2`)
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.author.id === client.user.id) return;

    if (message.channelId === process.env.QUERY_CHANNEL_ID) {
      const args = message.content.split(" ");
      const command = args.shift().toLowerCase();
      if(command === 'whois'){
        if (!args.length)
          return message.channel.send(`Provide valid argument, ${message.author}!`);
        if(validateEmail(args[0])){
          const user = await User.findOne({email:args[0]});
          if(user){
            const isUser = client.users.cache.get(user.discord_id)
            return message.channel.send(`${message.author},\n**Email:** ${user.email}\n**Subscribed:** ${(user.subscribed)?"Yes":"No"}\n**In Trial:** ${(user.inTrial)?"Yes":"No"}\n**Discord Acc:** ${(user.discord_id!=='')?"<@"+user.discord_id+">":"Not linked"}${(isUser && user.discord_id!=='')?"\n**Discord Tag**: "+isUser.tag:""}\n**Name:** ${user.name}\n**Twitter:** ${(user.twitter!=='')?user.twitter:"null"}\n**Exp:** ${user.experience}\n**Acc size:** ${user.acc_size}`);
          }
          else
            return message.channel.send(`No such user in database.`);
        }else if(args.join(" ").match(/^((.+?)#\d{4})/)){
          try{
            console.log(args.join(" "))
            guild.members.fetch().then((member) => {
              member.forEach(async (m)=> {
                if (m.user.username+"#"+m.user.discriminator=== args.join(" ")) {
                  const user = await User.findOne({discord_id:m.user.id})
                  if(user){
                    const isUser = client.users.cache.get(user.discord_id)
                    return message.channel.send(`${message.author},\n**Email:** ${user.email}\n**Subscribed:** ${(user.subscribed)?"Yes":"No"}\n**In Trial:** ${(user.inTrial)?"Yes":"No"}\n**Discord Acc:** ${(user.discord_id!=='')?"<@"+user.discord_id+">":"Not linked"}${(isUser && user.discord_id!=='')?"\n**Discord Tag**: "+isUser.tag:""}\n**Name:** ${user.name}\n**Twitter:** ${(user.twitter!=='')?user.twitter:"null"}\n**Exp:** ${user.experience}\n**Acc size:** ${user.acc_size}`);
                  }
                  else
                    return message.channel.send(`No linked account found for the user.`);
                }
              })
            })
          }catch(err){
            console.log(err)
          }
        }
      }

      if(command === 'welcome'){
        const tag = args.join(" ")
        guild.members.fetch().then((member) => {
          member.forEach(async (m)=> {
            if (m.user.username+"#"+m.user.discriminator === tag) {
              m.send(`${m.user.toString()}, Welcome to the tradewithMAK server!\nLink your e-mail address and discord account to access subscription features.\n\nPlease share your e-mail address by replying to this message:`).then(()=>{
                return message.channel.send(`${m.user.toString()} was sent welcome message.`)
              }).catch((err) =>{
                return message.channel.send(`Could not send welcome message to ${m.user.toString()}.`)
              })
            }
          })
        })
      }

      if(command === 'whoare'){
        if (!args.length)
          return message.channel.send(`Provide valid argument, ${message.author}!`);
        if(args[0]==="trialing"){
          try{
            const res = await User.find({inTrial:true});
            if(res.length){
                let str=''
                for(let i = 0; i < res.length; i++) {
                    str += res[i].email + ' - ' + ((res[i].discord_id)?'<@'+res[i].discord_id+'>':'Not Linked') + '\n'
                  }
                  return message.channel.send(`${message.author}, Trial Users:\n${str}`);
            }
            else{
              return message.channel.send(`No members are currently trialing, ${message.author}!`);
            } 
          }catch(err){
            return message.channel.send(`Error while fetching data, ${message.author}!`);
          }   
        }
      }

      if(command === 'link'){
        if (!args.length)
          return message.channel.send(`Provide valid argument, ${message.author}!`);
        const temp = args.splice(1,args.length)
        const disc_id = temp.join(" ")
        if(validateEmail(args[0])){
          const user = await User.findOne({email:args[0]});
          if(user){
            guild.members.fetch().then((member) => {
              let flag = false
              member.forEach(async (m)=> {
                if (m.user.username+"#"+m.user.discriminator=== disc_id) {
                  user.discord_id = m.user.id;
                  user.save()
                  try{
                  if(user.subscribed){
                    m.roles.add(process.env.ROLE_ID)
                  }}catch(err){console.log(err)}
                  flag = true
                  return message.channel.send(`Successfully linked.`);
                }
              })
              if(!flag){
                return message.channel.send(`User has to be in the discord server.`);
              }
            })
          }else{
            return message.channel.send(`User not found for the given e-mail.`);
          }
        }else{
          return message.channel.send(`Not a valid e-mail address.`);
        }
      }


      if(command === 'unlink'){
          if (!args.length)
            return message.channel.send(`Provide valid argument, ${message.author}!`);
          if(validateEmail(args[0])){
            const user = await User.findOne({email: args[0]});
            if(user){
              if(user.discord_id===''){
                return message.channel.send(`User not linked to any discord account`)
              }else{
                try{
                const inServer = await guild.members.fetch(user.discord_id)
                inServer.roles.remove(process.env.ROLE_ID)
                }catch(err){console.log(err)}
                user.discord_id=''
                user.save()
                return message.channel.send(`Account unlinked from: ${user.email}`)
              }
          }else{
              return message.channel.send(`User not found for the given e-mail.`)
          }
        }
      }
    }


    if (message.channel.type === "DM") {

      const inServer = await guild.members.fetch(message.author.id).catch(() => {
        message.author.send("You must be part of tradewithMAK server.")
      })
      if(message.content === "unlink"){
        const user = await User.findOne({discord_id: message.author.id});
        if(user){
          user.discord_id=''
          user.save()
          inServer.roles.remove(process.env.ROLE_ID)
          message.author.send(`Account unlinked from: ${user.email}`)
          client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} is now unlinked from ${message.author.toString()}`)
        }else{
          message.author.send(`Account currently not linked to any e-mail adress.`)
        }
      }
      if(inServer){
        const email = message.content.toLowerCase();
        if(validateEmail(email)){
          try{
            // const hasRole = guild.members.cache
            // .get(message.author.id).roles.cache
            // .some(role => role.name === 'paid');
            // console.log(hasRole)
            const userById = await User.findOne({discord_id:message.author.id});
            if(!userById){
              const user = await User.findOne({email:email});
              if(user){
                if(user.discord_id === message.author.id){
                  message.author.send(`E-mail already linked with your discord account.`)
                }else if(user.discord_id !== ''){
                  message.author.send(`E-mail already associated with a different discord account. If you have any further queries, please message in #lounge-support of tradewithmak discord server, our moderators will help you.`)
                }else{
                  user.discord_id = message.author.id;
                  user.save()
                  if(user.subscribed === false){
                    message.author.send(`${message.author.toString()} This e-mail address is now linked with your discord account. Once you complete the subscription payment, you will be able access everything in discord.`)
                  }else{
                    inServer.roles.add(process.env.ROLE_ID)
                    message.author.send(`${message.author.toString()} Your discord account is activated. You will be able to `+
                    `access everything in discord server. This e-mail address is now linked with your discord account. `)
                    client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} is now linked to ${message.author.toString()}`)
                  }
                }
              }else{
                  message.author.send(`We could not find any account with your e-mail address. Please register here:\n **dashboard.tradewithmak.com/signup**\nAfter registration, reply with your e-mail address once again.  In order to access all features, `+
                    `please subscribe to our service after registration.\n\nIf `+
                    `you have any further inquiries, please post a message in the #lounge-support `+
                    `channel or email us at contact@tradewithMAK.com; one of our moderators will help you. `)
              }
            }else{
              message.author.send(`Your account is already linked with an E-mail address.\nIf you have any further queries, please message in #lounge-support of tradewithmak discord server, our moderators will help you.`)
            }
          }catch(err){
            console.log(err)
          }
        }
      }

    }
  })
  client.on('guildMemberAdd', member => {
    member.send(`${member.toString()}, Welcome to the tradewithMAK server!\nLink your e-mail address and discord account to access subscription features.\n\nPlease share your e-mail address by replying to this message:`).then(()=>{
      client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${member.toString()} was sent welcome message.`)
    }).catch((err) =>{
      client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`<@&914904220350697493>, Could not send welcome message to ${member.toString()}.`)
    })
 });

});


client.login(process.env.DISCORD_TOKEN);

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
