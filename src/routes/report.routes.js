const router = require('express').Router()
const {
  createReport,
  getReportByUrlCheckId,
  getReportsByTags,
} = require('../controllers/report.controller')
const { isAuth } = require('../middleware/auth.middleware')

// create report route
router.post('/create', isAuth, createReport)

// get report route
router.get('/get/:id', isAuth, getReportByUrlCheckId)

// get report by tags route
router.get('/getByTags', isAuth, getReportsByTags)

module.exports = router
