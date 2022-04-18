const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    //sending from a Gmail account
    user: "contact@tradewithmak.com",
    pass: "ibrsdvjcwaumzrig",
  },
});


