const { body } = require('express-validator')
const User = require('../model/User.model')
const jwt = require('jsonwebtoken')

// Validate signup
const validateSignup = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage("Email address can't be empty")
      .bail()
      .isEmail()
      .withMessage('Invalid email format')
      .bail()
      .custom(async emailAddress => {
        try {
          console.log(emailAddress)
          const email = await User.findOne({ email: emailAddress })
          if (email) {
            throw new Error('Email is already exist')
          }
          console.log(email)
        } catch (e) {
          throw new Error(e)
        }
      }),
  ]
}

module.exports = { validateSignup }
