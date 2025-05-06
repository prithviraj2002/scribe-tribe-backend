const express = require('express')
const studentController = require('../controllers/student_controller')
const scribeReqController = require('../controllers/scribe_req_controller')

const studentRouter = express.Router()

studentRouter
.post('/', async (req, res) => {
    return await studentController.createStudent(req, res);
})

studentRouter.route('/').get( async (req, res) => {
    return await studentController.getStudent(req, res);
})
.delete(async (req, res) => {
    return await studentController.delStudent(req, res);
})
.patch(async (req, res) => {
    return await studentController.updateStudent(req, res);
})

studentRouter.route('/profile/').get(async (req, res) => {
    return await studentController.getStudentFromToken(req, res);
})

studentRouter.route('/check/').get(async (req, res) => {
    return await studentController.studentProfileExists(req, res);
}) 

studentRouter.route('/scribeReq/').get( async (req, res) => {
    return await scribeReqController.getScribeReqByStudentId(req, res);
})

studentRouter.route('/:id').get( async (req, res) => {
    return await studentController.getStudentFromId(req, res);
})

module.exports = studentRouter