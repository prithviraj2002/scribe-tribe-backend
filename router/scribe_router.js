const express = require('express')
const scribeController = require('../controllers/scribe_controller')
const scribeReqController = require('../controllers/scribe_req_controller')

const scribeRouter = express.Router()

scribeRouter.post('/', async (req, res) => {
    return await scribeController.createScribe(req, res);
})

scribeRouter.route('/all/').get(async (req, res) => {
    return await scribeController.getAllScribe(req, res);
})

scribeRouter.route('/').get(async (req, res) => {
    return await scribeController.getScribe(req, res);
})
.delete(async (req, res) => {
    return await scribeController.delScribe(req, res);
})
.patch(async (req, res) => {
    return await scribeController.updateScribe(req, res);
})

scribeRouter.route('/check/').get(async (req, res) => {
    return await scribeController.scribeProfileExists(req, res);
})

scribeRouter.route('/req/:id').get(async (req, res) => {
    return await scribeReqController.getScribeReqByScribeId(req, res);
})

scribeRouter.route('/:id').get(async (req, res) => {
    return await scribeController.getScribeFromId(req, res);
})
 
module.exports = scribeRouter