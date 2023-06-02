const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

function isSignupAuth(req, res, next) {
  const authorization = req.headers['authorization']

  if (!authorization) {
    return res.status(401).send({
      success: false,
      errors: [{ message: 'Not authorized', field: 'notAuthorized' }],
    })
  }
  const token = authorization.split(' ')[1]
  verify(token, process.env.JWT_SECRET_KEY, function (e, auth) {
    if (e) {
      res.status(401).send({ error: 'Not Authorized!' })
    } else {
      req.authData = {
        _id: auth._id,
      }
      return next()
    }
  })
}

async function isAuth(req, res, next) {
  const authorization = req.headers['authorization']

  if (!authorization) {
    return res.status(401).send({
      success: false,
      errors: [{ message: 'Not authorized', field: 'notAuthorized' }],
    })
  }
  try {
    const token = authorization.split(' ')[1]
    const decoded = verify(token, process.env.JWT_SECRET_KEY)

    req.authData = {
      _id: decoded._id,
    }
  } catch (e) {
    return res.status(401).send({
      success: false,
      errors: [{ message: 'Failed to authorize token', field: 'authToken' }],
    })
  }

  return next()
}

module.exports = {
  isSignupAuth,
  isAuth,
}
