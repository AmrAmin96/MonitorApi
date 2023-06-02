const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const sendEmail = async (email, newUser, subject, type) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  const verificationToken = await newUser.generateSignupToken(newUser)
  const url = `http://localhost:3000/user/verify/${verificationToken}`
  let text
  if (type == 'verification') {
    text = `Hey, Please Click on the following link <a href = '${url}'>here</a> to confirm your email.`
  } else {
    text = subject
  }
  transporter.sendMail(
    {
      to: email,
      subject: subject,
      html: text,
    },
    function (error, info) {
      if (error) throw Error(error)
      console.log('Email Sent Successfully')
    },
  )
  return
}

module.exports = { sendEmail }
