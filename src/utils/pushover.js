const Push = require('pushover-notifications')

const userKey = process.env.userKey
const appToken = process.env.appToken

const pushNotifications = message => {
  const push = new Push({
    user: userKey,
    token: appToken,
  })

  const msg = {
    message,
    title: 'Pushover Notification',
    sound: 'magic',
  }

  push.send(msg, (error, response) => {
    if (error) {
      console.error('Error sending Pushover notification:', error)
    } else {
      console.log('Pushover notification sent:', response)
    }
  })
}
module.exports = { pushNotifications }
