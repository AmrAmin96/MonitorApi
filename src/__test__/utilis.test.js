const { monitorUrl } = require('../utils/urlMonitor')
const User = require('../model/User.model')

const urlMonitor = require('url-monitor')

jest.mock('url-monitor')

describe('monitorUrl', () => {
  let urlCheck, userId, outages, uptime, downtime, firstTime, website

  beforeEach(() => {
    // create and save a user
    let user = new User()
    urlCheck = {
      url: 'www.google.com',
      interval: 3000,
      timeout: 5000,
    }
    userId = user._id
    outages = 0
    uptime = 0
    downtime = 0
    firstTime = true

    website = {
      start: jest.fn(),
      on: jest.fn(),
      stop: jest.fn(),
    }

    urlMonitor.mockReturnValue(website)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new urlMonitor object with the correct configuration', async () => {
    await monitorUrl(urlCheck, userId, outages, uptime, downtime, firstTime)

    expect(urlMonitor).toHaveBeenCalledWith({
      url: urlCheck.url,
      interval: urlCheck.interval,
      timeout: urlCheck.timeout,
    })
  })

  it('should call the start method on the website object', async () => {
    await monitorUrl(urlCheck, userId, outages, uptime, downtime, firstTime)

    expect(website.start).toHaveBeenCalled()
  })

  it('should call the handleError function when the website emits an error or is unavailable', async () => {
    const handleError = jest.fn()
    const errorData = { message: 'Error message' }

    website.on.mockImplementation((event, callback) => {
      if (event === 'error') {
        callback(errorData)
      }
    })

    await monitorUrl(urlCheck, userId, outages, uptime, downtime, firstTime)

    expect(handleError).toHaveBeenCalledWith(
      website,
      downtime,
      urlCheck.interval,
      urlCheck.timeout,
      urlCheck,
      firstTime,
      userId,
    )
  })

  it('should call the handleSuccess function when the website emits an available event', async () => {
    const handleSuccess = jest.fn()

    website.on.mockImplementation((event, callback) => {
      if (event === 'available') {
        callback()
      }
    })

    await monitorUrl(urlCheck, userId, outages, uptime, downtime, firstTime)

    expect(handleSuccess).toHaveBeenCalledWith(
      website,
      downtime,
      uptime,
      urlCheck,
      firstTime,
      userId,
    )
  })
})
