const express = require('express')
const reviewController = require('../controllers/review_controller')

const reviewRouter = express.Router()

reviewRouter.route('/:id').get(async (req, res) => {
    return await reviewController.getReviewsById(req, res);
})

reviewRouter.route('/').post(async (req, res) => {
    return await reviewController.createReview(req, res);
})

module.exports = reviewRouter
