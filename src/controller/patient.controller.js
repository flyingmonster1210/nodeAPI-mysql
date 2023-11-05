const database = require('../config/mysql.config')
const Response = require('../domain/response')
const logger = require('../log/logger')
const QUERY = require('../query/patient.query')

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' },
}

const getPatients = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, fetching patients`)
  database.query(QUERY.SELECT_PATIENTS, (error, results) => {
    if (!results) {
      res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No patients found`))
    }
    else {
      res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patients retrieved`, { patients: results }))
    }
  })
}

const getPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, fetching patient`)
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id:${req.params.id} not found`))
    }
    else {
      res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient retrieved`, results[0]))
    }
  })
}

const createPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, creating patient`)
  const body = req.body
  const values = [body.first_name, body.last_name, body.email, body.address, body.diagnosis, body.phone, body.image_url]
  database.query(QUERY.CREATE_PATIENT, values, (error, results) => {
    if (!results) {
      logger.error(error.message)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`))
    }
    else {
      const patient = { id: results.insertId, ...req.body, created_at: new Date() }
      res.status(HttpStatus.CREATED.code).send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Patient created`, { patient }))
    }
  })
}

const updatePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, updating patient`)
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
    if (!results[0]) {
      res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id:${req.params.id} not found`))
    }
    else {
      const body = req.body
      const values = [body.first_name, body.last_name, body.email, body.address, body.diagnosis, body.phone, body.image_url]
      database.query(QUERY.UPDATE_PATIENT, [...values, req.params.id], (error, results) => {
        if (!error) {
          res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient updated`, { id: req.params.id, ...req.body }))
        }
        else {
          logger.error(error.message)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`))
        }
      })
    }
  })
}

const deletePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalurl}, deleting patient`)
  database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
    if (results.affectedRows > 0) {
      res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient deleted`, results[0]))
    }
    else {
      res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id:${req.params.id} not found`))
    }
  })
}

module.exports = {
  HttpStatus,
  createPatient,
  updatePatient,
  deletePatient,
  getPatient,
  getPatients,
}

