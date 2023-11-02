const express = require('express')
const ip = require('ip')
const dotenv = require('dotenv')
const cors = require('cors')
const Response = require('./domain/response')

dotenv.config()
const PORT = process.env.PORT || 3030
const app = express()

app.listen(PORT, () => {
  console.log('\n\n-----------------------------------------------------------')
  console.log(`Server is listening on (IP): ${ip.address()}:${PORT}`)
  console.log('-----------------------------------------------------------\n\n')
})

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send(new Response(200, 'OK', 'Patient API, v1.0.0 - All System Go'))
})