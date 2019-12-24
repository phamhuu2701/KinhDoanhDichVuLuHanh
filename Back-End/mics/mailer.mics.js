const nodemailer = require("nodemailer");
const config = require("../config/mailer.config");

const transport = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: config.MAILGUN_USER,
    pass: config.MAILGUN_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendEmail = (from, to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};
