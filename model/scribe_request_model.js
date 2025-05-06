const mongoose = require('mongoose')

const scribeReqSchema = new mongoose.Schema(
    {
        examName:{
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true
        },
        date:{
            type: String,
            required:true,
        },
        time: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            min: 1, max: 6
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true,
            match: /^[0-9]{6}$/
        },
        board: {
            type: String,
            required: true,
        },
        modeOfExam: {
            type: String,
            required: true
        },
        studentId: {
            type: String,
            required: true,
            ref: "Student"
        },
        scribeId: {
            type: String,
            required: false,
            ref: "Scribe",
            default: null
        },
        isOpen: {
            type: Boolean,
            default: true
        },
        isComplete: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const ScribeReq = mongoose.model("Scribe Request", scribeReqSchema)

module.exports = ScribeReq