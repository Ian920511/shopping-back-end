const express = require('express')
const app = express()

const PORT = 3000

const db = require('./models')

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(PORT, () => {
  console.log(`Sever is running on http://localhost:${PORT}`)
})