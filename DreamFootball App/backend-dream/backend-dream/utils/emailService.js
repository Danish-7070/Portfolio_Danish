const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

const sendEmail = async (to, subject, template, data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  const html = await ejs.renderFile(
    path.join(__dirname, `../templates/emails/${template}.ejs`),
    data
  );

  const mailOptions = {
    from: {
      name: "Dream Football",
      address: process.env.EMAIL_USER
    },
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;