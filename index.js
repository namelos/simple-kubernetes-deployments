const express = require('express')
const { MongoClient } = require('mongodb')
const os = require('os')
const app = express()

let collection = null
const dbName = 'counter-integration'

;(async () => {
  try {
    console.log(`Connecting to mongo: ${process.env.MONGO}`)
    const client = await MongoClient.connect(process.env.MONGO)

    const db = client.db(dbName)
    collection = db.collection('counter')

    const counter = await collection.findOne()

    if (!counter && counter !== 0) {
      await collection.insertOne({ n: 0 })
    }

    console.log('Mongo connected.')

    app.get('/', async (req, res) => {
      console.log('GET /')
      const counter = await collection.findOne()
      console.log(`RESPONSE: ${counter.n}\n`)
      res.send(`${counter.n}\n`)
    })

    app.post('/', async (req, res) => {
      console.log('POST /')
      let counter = await collection.findOne()
      counter++
      await collection.update({ _id: counter._id }, { n: counter.n })
      console.log(`RESPONSE: ${counter.n}\n`)
      res.send(`${counter.n}\n`)
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

    app.get('*', (req, res) => {
      console.log(`GET /${req.path}`)
      res.send(`404 /${req.path}`)
    })

    app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
  } catch (e) {
    console.log('CRASHED')
    console.log(e)
  }
})()


