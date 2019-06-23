const express = require('express')

const router = express.Router()
module.exports = router

router.get('/', (req, res) => {
  res.send({ ok: 1 })
})

//   /api/card/*
router.use('/card', require('./card'))
