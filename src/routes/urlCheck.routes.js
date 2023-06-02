const router = require('express').Router()
const {
  createUrlCheck,
  deleteUrlCheck,
  getUrlCheckById,
  getUrlCheckByTags,
  updateUrlCheck,
} = require('../controllers/urlCheck.controller')
const { isAuth } = require('../middleware/auth.middleware')

// create url check route
router.post('/create', isAuth, createUrlCheck)

// update url check route
router.put('/update/:id', isAuth, updateUrlCheck)

// get url check route
router.get('/get/:id', isAuth, getUrlCheckById)

// delete url check route
router.delete('/delete/:id', isAuth, deleteUrlCheck)

// get url check by tags route
router.get('/getByTags', isAuth, getUrlCheckByTags)

module.exports = router
