'use strict';

const router     = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.use(require('../../routes/ws'))

module.exports = router
