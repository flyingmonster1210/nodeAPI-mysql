const express = require('express')
const ip = require('ip')
const dotenv = require('dotenv')
const cors = require('cors')
const logger = require('./log/logger')
const Response = require('./domain/response')
const { HttpStatus } = require('./controller/patient.controller')

dotenv.config()
const PORT = process.env.PORT || 3030
const app = express()

app.listen(PORT, () => {
  logger.info(`Server is listening on (IP): ${ip.address()}:${PORT}`)
})

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Patient API, v1.0.0 - All System Go'))
})