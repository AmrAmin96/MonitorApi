const urlMonitor = require('url-monitor')
const getServerResponseTime = require('get-server-response-time')
const UrlCheck = require('../model/UrlCheck.model')
const User = require('../model/User.model')
const Report = require('../model/Report.model')
const { sendEmail } = require('../utils/mailer')
const { pushoverNotification } = require('../utils/pushover')

const monitorUrl = async (
  urlCheck,
  userId,
  outages,
  uptime,
  downtime,
  firstTime,
) => {
  let website = new urlMonitor({
    url: urlCheck.url,
    interval: urlCheck.interval,
    timeout: urlCheck.timeout,
  })
  let report
  const user = await User.findById(userId)
  if (firstTime) firstTime = false
  await website.on('error' || 'unavailable', async data => {
    try {
      downtime += urlCheck.interval + urlCheck.timeout
      outages++
      let status = 'unavailable'
      let availabilityPercentage =
        uptime > 0 ? `${(uptime / uptime + downtime) * 100}%` : '0%'
      let responseTime = 0 //get response time
      report = prepareReport(
        status,
        availabilityPercentage,
        outages,
        downtime,
        uptime,
        responseTime,
        urlCheck,
      )
      if (
        urlCheck.report?.status === 'available' &&
        check.report.status != status
      ) {
        pushoverNotification(
          `Status of ${url} has changed ! It is ${status} right now`,
        )
        sendEmail(user.email, user, `URL ${url} went down`, 'notification')
      }

      saveCreatedUrlCheck(urlCheck, report, userId, website, firstTime)
    } catch (e) {
      console.log(e)
    }
  })

  await website.on('available', async data => {
    try {
      uptime += urlCheck.interval
      let status = 'available'
      let responseTime

      let availabilityPercentage = `${(uptime / uptime + downtime) * 100}%`

      try {
        responseTime = await getServerResponseTime(website.url)
      } catch (e) {
        console.log(e)
      }

      report = prepareReport(
        status,
        availabilityPercentage,
        outages,
        downtime,
        uptime,
        responseTime,
        urlCheck,
      )
      if (
        urlCheck.report?.status === 'available' &&
        check.report.status != status
      ) {
        pushoverNotification(
          `Status of ${url} has changed ! It is ${status} right now`,
        )
        sendEmail(user.email, user, `URL ${url} is available`, 'notification')
      }
      saveCreatedUrlCheck(urlCheck, report, userId, website, firstTime)
        .then()
        .catch(err => {
          website.stop()
        })
    } catch (e) {
      console.log(e)
    }
  })
  website.start()
}

const saveCreatedUrlCheck = async (
  urlCheck,
  report,
  userId,
  website,
  firstTime,
) => {
  try {
    urlCheck.report = report

    //save Report and UrlCheck to database
    await report.save()
    const savedUrlCheck = await urlCheck.save()

    const user = await User.findById(userId)
    const oldCheckBoolean = user.urlCheckIds.includes(savedUrlCheck.id)
    if (!oldCheckBoolean && firstTime) {
      website.stop() //the channel is down
    } else {
      if (!user.urlCheckIds.includes(savedUrlCheck.id)) {
        user.urlCheckIds.push(savedUrlCheck.id)
      }
      await user.save({ urlCheckIds: savedUrlCheck.id })
    }
  } catch (error) {
    throw error
  }
}

const prepareReport = (
  status,
  availabilityPercentage,
  outages,
  downtime,
  uptime,
  responseTime,
  urlCheck,
) => {
  let newReport = new Report({
    status: status,
    availability: availabilityPercentage,
    outages: outages,
    uptime: uptime,
    downtime: downtime,
    responseTime: responseTime,
  })

  const history = {
    status: status,
    responseTime: responseTime,
    timestamp: Date.now(),
  }
  newReport.history = urlCheck.report
    ? [...urlCheck.report.history, history]
    : [history]

  return newReport
}

module.exports = { monitorUrl }
