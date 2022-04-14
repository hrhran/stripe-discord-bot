const transporter = require('../config/mailer')
const constants = require('../helpers/constants')

const sendWelcomeMail= (user) =>{
    const mailList = [
        user.email,
      ];
      transporter.sendMail({
        from: "mongodb343@gmail.com",
        to: mailList,
        subject: `Welcome to tradewithMAK`,
        html: constants.welcomeMail(user),
      });
}


const sendCancelMail= (user) =>{
    const mailList = [
        user.email,
      ];
      transporter.sendMail({
        from: "mongodb343@gmail.com",
        to: mailList,
        subject: `Subscription Ended`,
        html: constants.cancelMail(user),
      });
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}