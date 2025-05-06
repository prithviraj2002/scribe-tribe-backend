const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        scribeId: {
            type: String,
            ref: "Scribe",
            required: true
        },
        studentId: {
            type: String,
            ref: "Student",
            required: true
        },
        reviewText:{
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1, max: 5
        }
    },
    {
        timestamps: true
    }
)

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review