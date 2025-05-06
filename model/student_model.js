const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        gender:{
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        age: {
            type: Number,
            min: 5, max: 100,
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
            match: /^[0-9]{6}$/
        }
    },
     {timestamps: true}
)

const student = mongoose.model('Student', studentSchema)

module.exports = student;