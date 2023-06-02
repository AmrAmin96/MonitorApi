const User = require('../model/User.model')
const Report = require('../model/Report.model')
const UrlCheck = require('../model/UrlCheck.model')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { monitorApiError } = require('../errors/monitorApiError')

const createReport = async (req, res) => {
  const newReport = new Report(req.body)
  try {
    const savedReport = await newReport.save()
    return res.status(200).json({
      success: true,
      data: savedReport,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

const getReportByUrlCheckId = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    return res.status(200).json({
      success: true,
      data: report,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

const getAllReport = async (req, res) => {
  try {
    const reports = await Report.find()
    return res.status(200).json({
      success: true,
      data: reports,
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

const getReportsByTags = async (req, res) => {
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
    const reports = []
    urlChecks.forEach(element => {
      const report = element.report
      if (report) {
        reports.push(report)
      }
    })

    if (urlChecks.length == 0) {
      res.status(200).json({
        success: true,
        message: 'No results founds for the specified tag',
      })
    } else {
      res.status(200).json({
        success: true,
        data: reports,
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({ success: false, errors: e })
  }
}

module.exports = {
  createReport,
  getReportByUrlCheckId,
  getAllReport,
  getReportsByTags,
}
