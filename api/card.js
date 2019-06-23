const express = require('express')

const router = express.Router()
module.exports = router

//  /api/card/
router.get('/', (req, res) => {
  res.send({ ok: 1 })
})

router.post('/log', async (req, res) => {
  try {
    // check required
    if (!req.body.cardCode) {
      throw new Error('cardCode is required')
    }

    // query for cardCode
    let card = await req.db('card')
      .where('code', '=', req.body.cardCode)
      .then(rows => rows[0] || {})

    //
    let reader = {}
    if (req.body.readerCode) {
      reader = await req.db('reader')
        .where('code', '=', req.body.readerCode)
        .then(rows => rows[0] || {})
    }

    // insert into cardLog
    await req.db('cardLog').insert({
      logTs: req.db.fn.now(),
      cardCode: req.body.cardCode,
      refType: card.refType || null,
      refCode: card.refCode || null,
      readerCode: reader.code || null,
    })

    let data = {}
    if (card.id) {
      data.card = card
    }
    if (card.refType === 'STUDENT') {
      let student = await req.db('student')
        .where('code', '=', card.refCode)
        .select('code', 'preName', 'firstName', 'lastName')
        .then(rows => rows[0])
      if (student) {
        data.student = {
          code: student.code,
          name: `${student.preName} ${student.firstName} ${student.lastName}`,
        }
      }
    }
    res.send({ ok: 1, ...data })
  } catch (e) {
    res.send({ ok: 0, error: e.message })
  }
})
