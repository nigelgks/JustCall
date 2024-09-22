import Config from 'react-native-config';

const accountSid = Config.TWILIO_SID;
const authToken = Config.TWILIO_AUTHTOKEN;
const serviceId = Config.TWILIO_SERVICEID;
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