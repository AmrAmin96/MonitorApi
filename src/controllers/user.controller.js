const User = require('../model/User.model')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { monitorApiError } = require('../errors/monitorApiError')
const { sendEmail } = require('../utils/mailer')

// Sign up controller
const signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(302).send({
        message: 'Email already exists',
      })
    }
    let hashPassword = await bcrypt.hash(req.body.password, 8)
    const newUser = new User({ ...req.body, password: hashPassword })
    sendEmail(
      newUser.email,
      newUser,
      'Please Verify your Account',
      'verification',
    )
    await newUser.save()
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully , Please verify your email and signin',
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

// Login controller
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body)
    if (!user) {
      return res.status(404).send({
        message: 'User does not exists',
      })
    }
    if (!user.verified) {
      return res.status(403).send({
        message: 'Verify your Account.',
      })
    }

    await user.generateAuthToken(user)

    return res.json({
      success: true,
      message: 'You have been logged in successfully!',
      data: user,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, ...e })
  }
}

// Logout controller
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.authData._id, { token: '' }, { new: true })

    return res.json({
      success: true,
      message: 'You have been logged out successfully!',
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

// Verify email
const verifyEmail = async (req, res) => {
  let token = req.params.id
  if (!token) {
    return res.status(422).send({
      message: 'Missing Token',
    })
  }
  let payload = null
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
  } catch (err) {
    return res.status(500).send(err)
  }
  try {
    const user = await User.findOne({ _id: payload._id })
    if (!user) {
      return res.status(404).send({
        message: 'User does not  exists',
      })
    }
    user.verified = true
    await user.save()
    return res.status(200).send({
      message: 'Account Verified',
    })
  } catch (err) {
    return res.status(500).send(err)
  }
}

module.exports = { signup, login, logout, verifyEmail }
