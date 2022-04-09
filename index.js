const dotenv = require("dotenv");
dotenv.config();
const conn = require("./config/connect");
const User = require("./models/userModel");
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5005
const client = require("./config/bot")


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
//     client.users.fetch("302120394243047426").then(dm => {
//     dm.send('Message to send')
// })
// client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`TEST 2`)
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.author.id === client.user.id) return;
    if (message.channel.type === "DM") {
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
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
        const email = message.content;
        if(validateEmail(email)){
          try{
            const hasRole = guild.members.cache
            .get(message.author.id).roles.cache
            .some(role => role.name === 'test');
            console.log(hasRole)
            if(!hasRole){
              const user = await User.findOne({email:email});
              if(user){
                if(user.discord_id === message.author.id){
                  message.author.send(`This e-mail is already active with your account.`)
                }else if(user.discord_id !== ''){
                  message.author.send(`E-mail already associated with a different discord account.`)
                }else{
                  if(user.subscribed === false){
                    message.author.send(`Please enter your e-mail again after completing your payment. If you have any further queries, please message in any public channel of tradewithmak discord server, our moderators will help you.`)
                  }else{
                    user.discord_id = message.author.id;
                    user.save()
                    inServer.roles.add(process.env.ROLE_ID)
                    message.author.send(`${message.author.toString()} Your discord account is active now! You will be able to access everything in discord server. This e-mail address is now linked with your discord account. `)
                    client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(`${user.email} is now linked to ${message.author.toString()}`)
                  }
                }
              }else{
                  message.author.send(`We could not find any account with your email. If you have any further queries, please message in any public channel of tradewithmak discord server, our moderators will help you.`) 
              }
            }else{
              message.author.send(`Your account is already active.`) 
            }
          }catch(err){
            console.log(err)
          }
        }
      }
      // USER_ID = '123123123';
      // if (guild.member(USER_ID)) {
        
      // }
    }
  })

});

// client.on("messageCreate", (message) => {
//   if (message.author.bot) return;

//   const commandBody = message.content.slice(prefix.length);
//   const args = commandBody.split(" ");
//   const command = args.shift().toLowerCase();

//   if (message.channelId === process.env.SOURCE_CHANNEL_ID) {
//   }
// });

client.login(process.env.DISCORD_TOKEN);

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};