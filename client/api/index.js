'use strict';

const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.use('/admin', require('../../routes/admin'))
router.use('/auth', require('../../routes/auth'))
router.use('/feedback', require('../../routes/feedback'))
router.use('/format', require('../../routes/format'))
router.use('/info', require('../../routes/info'))
router.use('/logs', require('../../routes/logs'))
router.use('/views', require('../../routes/views'))

module.exports = router
