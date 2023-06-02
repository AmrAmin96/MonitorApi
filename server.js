const express = require('express')
const app = express()
const dotenv = require('dotenv')
const { monitorApiError } = require('./src/errors/monitorApiError')

// Initialize .env file
dotenv.config()
// Import mongoDB connection
require('./src/db/connection')

app.use(express.json())

// Server routes
const authRoutes = require('./src/routes/user.routes')
const urlCheckRoutes = require('./src/routes/urlCheck.routes')
const reportRoutes = require('./src/routes/report.routes')

app.use('/user', authRoutes)
app.use('/urlCheck', urlCheckRoutes)
app.use('/report', reportRoutes)

// Error handler
app.use((e, req, res, next) => {
  console.log(e)
  if (e instanceof monitorApiError) {
    return res
      .status(e.statusCode)
      .send({ success: false, errors: e.serializeErrors().flat() })
  }
  // console.log(e)
  res.status(500).send({
    success: false,
    errors: [
      {
        message: 'Something went wrong',
      },
    ],
  })
})

// Start Server function
function startServer(port = process.env.PORT || 3000) {
  return app.listen(
    port,
    () =>
      process.env.NODE_ENV !== 'test' && console.info(`listen to port ${port}`),
  )
}
startServer()

module.exports = app
