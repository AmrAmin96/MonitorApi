const router = require('express').Router()
const {
  signup,
  login,
  logout,
  verifyEmail,
} = require('../controllers/user.controller')
const { validateSignup } = require('../middleware/auth-validator.middleware')
const { isAuth } = require('../middleware/auth.middleware')

// Sign up route
router.post('/signup', validateSignup(), signup)

// Login route
router.post('/login', login)

// logout route
router.get('/logout', isAuth, logout)

// verify route
router.get('/verify/:id', verifyEmail)

module.exports = router
