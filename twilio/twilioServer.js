const accountSid = 'AC42d07a220565fa42b7e322978222ac94'
const authToken = '90179d7bae57116cf8dc885e8fbd58f8'
const serviceId = 'VA53d1b760838a60494f3f471206b59c27'
const twilio = require('twilio')
const client = new twilio(accountSid, authToken)

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) =>
  res.send('Welcom to Verfication service!'),
)

app.get('/verify/:to', async (req, res) => {
  const to = req.params.to

  client.verify.v2
    .services(serviceId)
    .verifications.create({ to, channel: 'sms' })
    .then((verification) => {
      res.json(verification)
    })
    .catch((err) => {
      res.json(err)
    })
})

app.get('/check/:to/:code', async (req, res) => {
  const to = req.params.to
  const code = req.params.code
  client.verify.v2
    .services(serviceId)
    .verificationChecks.create({ to, code })
    .then((verification) => {
      res.json(verification)
    })
    .catch((err) => {
      res.json(err)
    })
})

app.listen(port)