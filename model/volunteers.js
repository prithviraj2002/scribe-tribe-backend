const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema(
    {
        scribe_req_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scribe Request",
        },
        scribe_id:{
            type: String,
            ref: "Scribe"
        },
        isOpen: {
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
)

const Volunteer = mongoose.model('Volunteer', volunteerSchema)

module.exports = Volunteer