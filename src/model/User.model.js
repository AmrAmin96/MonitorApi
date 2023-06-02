const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { RequestValidationError } = require('../errors/request-validator-error')

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    token: {
      type: String,
      trim: true,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      select: false,
    },
    urlCheckIds: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
)

// Auto populate plugin
userSchema.plugin(require('mongoose-autopopulate'))

// Generate auth token to user
userSchema.methods.generateAuthToken = async function () {
  let user = this
  const userTokenAuth = {
    _id: user._id.toString(),
  }
  console.log(userTokenAuth)
  const token = jwt.sign(userTokenAuth, process.env.JWT_SECRET_KEY, {
    expiresIn: '2 hours',
  })

  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.REFRESH_SECRET_KEY,
  )

  user.token = token
  // user.refreshToken = refreshToken
  await user.save()

  return { token, refreshToken }
}

// Generate a refresh token for users
userSchema.methods.generateRefreshToken = async function () {
  let user = this

  const isExist = await User.findById()
}

// Generate signup token to user
userSchema.methods.generateSignupToken = async function () {
  let user = this

  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '60 mins' },
  )
  user.token = token

  return token
}

// Validate user password before login
userSchema.statics.findByCredentials = async authData => {
  const user = await User.findOne({
    email: authData.email,
  })
  const userPassword = await User.findOne({
    email: authData.email,
  }).select({ password: 1 })

  if (!user) {
    throw new RequestValidationError([
      { message: 'No user with this credentials', field: 'user' },
    ])
  }

  const isMatched = await bcrypt.compare(
    authData.password,
    userPassword.password,
  )

  if (!isMatched) {
    throw new RequestValidationError([
      { message: 'Password is not match', field: 'password' },
    ])
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
