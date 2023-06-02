const User = require('../model/User.model')
const UrlCheck = require('../model/UrlCheck.model')
const { monitorUrl } = require('../utils/urlMonitor')

// Sign up controller
const createUrlCheck = async (req, res) => {
  const newUrlCheck = new UrlCheck(req.body)
  let outages, downtime, uptime
  outages = downtime = uptime = 0
  try {
    await monitorUrl(
      newUrlCheck,
      req.authData._id,
      outages,
      downtime,
      uptime,
      true,
    )
    res.status(200).json({
      success: true,
      data: newUrlCheck,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

// update url check
const updateUrlCheck = async (req, res) => {
  let urlCheckId = req.params.id
  let user = await User.findById(req.authData._id)
  if (user.urlCheckIds.includes(urlCheckId)) {
    try {
      let urlCheck = await UrlCheck.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      )
      res.status(200).json({ success: true, data: urlCheck })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ success: false, errors: e })
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Not authorized to get another user's url check",
    })
  }
}

// get url check by id
const getUrlCheckById = async (req, res) => {
  let urlCheckId = req.params.id
  let user = await User.findById(req.authData._id)
  if (user.urlCheckIds.includes(urlCheckId)) {
    try {
      let urlCheck = await UrlCheck.findById(req.params.id)
      res.status(200).json({
        success: true,
        data: urlCheck,
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ success: false, errors: e })
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Not authorized to get another user's url check",
    })
  }
}

// delete url check by url id
const deleteUrlCheck = async (req, res) => {
  let urlCheckId = req.params.id
  let user = await User.findById(req.authData._id)
  if (user.urlCheckIds.includes(urlCheckId)) {
    try {
      const c = await User.findByIdAndUpdate(req.authData._id, {
        $pull: { urlCheckIds: urlCheckId },
      })
      await UrlCheck.findByIdAndDelete(urlCheckId)
      res.status(200).json({
        success: true,
        message: 'Check has been deleted',
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ success: false, errors: e })
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Not authorized to delete another user's url check",
    })
  }
}

// get url check by tags
const getUrlCheckByTags = async (req, res) => {
  let tags = req.body.tags
  try {
    const user = await User.findById(req.authData._id)

    const urlCheckIds = user.urlCheckIds

    const urlChecks = await UrlCheck.find({
      _id: {
        $in: urlCheckIds,
      },
      tags: {
        $in: tags,
      },
    })
    if (urlChecks.length == 0) {
      res.status(200).json({
        success: true,
        message: 'No results founds for the specified tag',
      })
    } else {
      res.status(200).json({
        success: true,
        data: urlChecks,
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

module.exports = {
  createUrlCheck,
  updateUrlCheck,
  getUrlCheckById,
  deleteUrlCheck,
  getUrlCheckByTags,
}
