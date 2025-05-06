const mongoose = require('mongoose')

const scribeSchema = new mongoose.Schema(
    {
        phone:{
            type: String,
            required: true,
            unique: true
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
        },
        age: {
            type: Number,
            min: 16, max: 100,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        languagesKnown: { 
            type: [String], 
            required: true,
            default: [] 
        },
    },
    {timestamps: true}
)

const Scribe = mongoose.model('Scribe', scribeSchema)

module.exports = Scribe