const express = require('express')
const router = express.Router()
const {
  listenHook
} = require('../controllers/stripeController')


router.post('/stripehook', listenHook)


module.exports = router
