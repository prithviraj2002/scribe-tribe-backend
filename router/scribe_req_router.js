const express = require('express')
const controller = require('../controllers/scribe_req_controller')

const scribeReqRouter = express.Router()

scribeReqRouter.get('/', async (req, res) => {
    return await controller.getScribeReq(req, res);
})

scribeReqRouter.route('/:id')
.get(async (req, res) => {
    return await controller.getScribeReqById(req, res);
})
.delete(async (req, res) => {
    return await controller.delScribeReq(req, res);
})
.patch(async (req, res) => {
    return await controller.updateScribeRequest(req, res);
})

scribeReqRouter.post('/', async (req, res) => {
    return await controller.createReq(req, res);
})

scribeReqRouter.route('/scribe/:id').get(async (req, res) => {
    return await controller.getScribeReqByScribeId(req, res);
})

scribeReqRouter.route('/scribes/:id').get(async (req, res) => {
    return await controller.getInterestedScribes(req, res);
})

module.exports = scribeReqRouter
