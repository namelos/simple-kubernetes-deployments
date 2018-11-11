const express = require('express')
const os = require('os')
const app = express()

let counter = 0

app.get('/', (req, res) => {
  console.log('GET /')
  console.log(`RESPONSE: ${counter}\n`)
  res.send(`${counter}\n`)
})

app.post('/', (req, res) => {
  console.log('POST /')
  counter++
  console.log(`RESPONSE: ${counter}\n`)
  res.send(`${counter}\n`)
})

app.get('/env/:name', (req, res) => {
  console.log(`GET /env/${req.params.name}`)
  const value = process.env[req.params.name]
  const responseMessage = `${value ? value.toString() : 'NONE'}\n`
  console.log(`RESPONSE: ${responseMessage}`)
  res.send(responseMessage)
})

app.get('/os/:name', (req, res) => {
  console.log(`GET /os/${req.params.name}`)
  const property = os[req.params.name]
  const value = typeof property === 'function' ? property() : property
  const responseMessage = `${value ? value.toString() : 'NONE'}\n`
  console.log(`RESPONSE: ${responseMessage}`)
  res.send(responseMessage)
})

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))

