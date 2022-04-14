const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    //sending from a Gmail account
    user: "mongodb343@gmail.com",
    pass: "Mongo@2022",
  },
});


