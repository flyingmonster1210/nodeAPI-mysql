const express = require('express')
const { getPatient, createPatient, getPatients, updatePatient, deletePatient } = require('../controller/patient.controller')

const patientRoutes = express.Router()

patientRoutes.route('/')
  .get(getPatients)
  .post(createPatient)

patientRoutes.route('/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient)

module.exports = patientRoutes