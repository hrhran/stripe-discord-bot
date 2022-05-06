const transporter = require('../config/mailer')
const constants = require('../helpers/constants')

const sendWelcomeMail= (user) =>{
    const mailList = [
        user.email,
      ];
      transporter.sendMail({
        from: "contact@tradewithmak.com",
        to: mailList,
        subject: `tradewithMAK - Refer and Earn`,
        html: constants.welcomeMail(user),
      });
}


const sendCancelMail= (user) =>{
    const mailList = [
        user.email,
      ];
      transporter.sendMail({
        from: "contact@tradewithmak.com",
        to: mailList,
        subject: `Subscription Ended`,
        html: constants.cancelMail(user),
      });
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}