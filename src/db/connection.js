const mongoose = require('mongoose'),
  mongoURI = require('../config/keys').mongoURI

mongoose.Promise = global.Promise

mongoose
  .connect(mongoURI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () =>
      process.env.NODE_ENV !== 'test' &&
      console.log('Mongodb production connected!'),
  )
  .catch(e => console.log(e))

module.exports = { mongoose }
