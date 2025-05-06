const express = require('express')
const controller = require('../controllers/volunteer_req_controller')

const router = express.Router();

router.route('/createReq/:id').post(async (req, res) => {
    return await controller.createVolunteerReq(req, res);
})


router.route('/getReqById/:id').get(async (req, res) => {
    return await controller.getVolunteerReqById(req, res);
})

router.route('/applied').get(async (req, res) => {
    return await controller.getReqsAppliedByScribe(req, res);
})

router.route('/checkApplied/:id').get(async (req, res) => {
    return await controller.checkScribeApplied(req, res);
})

module.exports = router;