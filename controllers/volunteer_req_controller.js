const Volunteer = require('../model/volunteers')
const ScribeReq = require('../model/scribe_request_model');
const admin = require('../config/firebase-config')

async function createVolunteerReq(req, res){
    try{
        var scribeId = req.body.scribeId;
        var scribeReqId = req.body.scribeReqId;
        var isOpen = req.body.isOpen;

        if(!scribeId || !scribeReqId || !isOpen){
            console.log("Empty values")
            return res.status(400).json({msg: "Incomplete values"})
        }

        else{
            await Volunteer.create({
                scribe_id: scribeId,
                scribe_req_id: scribeReqId,
                isOpen: isOpen
            });

            var scribeReq = await ScribeReq.findById(scribeReqId);
            var studentId = scribeReq.studentId;

            var topic = `student_${studentId.substring(1)}`;
            console.log("topic:", topic);

            const payload = {
                notification: {
                    title: "Scribes are applying to your request!",
                    body: "A scribe has applied, check now under view details of scribe request.",
                },
                topic: topic,
            };
            
            try {
                await admin.messaging().send(payload);
                    console.log(`Notification sent to topic ${topic}`);
            } catch (error) {
                    console.error("Error sending notification:", error);
            }

            return res.status(201).json({msg: "Volunteer request created"})
        }
    } catch(e){
        console.log(e);
        return res.status(500).json({msg: "Internal server error", error: e})
    }
}

async function getVolunteerReqById(req, res){
    try{

        var scribeReqId = req.params.scribeReqId;

        if(!scribeReqId){
            return res.status(400).json({msg: "Scribe request id not found!"});
        }

        else{
            var volunteerReq = await Volunteer.find({scribe_req_id: scribeReqId});

            return res.status(200).json({data: volunteerReq})
        }

    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e})
    }
}

async function checkScribeApplied(req, res) {
    try {
        const scribeReqId = req.params.id;
        const scribeId = req.user.phone_number;

        if (!scribeReqId) {
            return res.status(400).json({ msg: "Missing scribe request ID" });
        }

        const existingApplication = await Volunteer.findOne({
            scribe_req_id: scribeReqId,
            scribe_id: scribeId
        });

        if (!existingApplication) {
            return res.status(200).json({ msg: false });
        } else {
            return res.status(200).json({ msg: true });
        }

    } catch (e) {
        console.error("An error occurred:", e);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


async function getReqsAppliedByScribe(req, res){
    try{
        var scribeId = req.user.phone_number;

        var reqs = await Volunteer.find({scribe_id: scribeId});
        var appliedReqs = [];

        for(const r of reqs){
            const applied = await ScribeReq.findOne({_id: r.scribe_req_id});

            if(applied){
                appliedReqs.push(applied);
            }
        }

        return res.status(200).json({data: appliedReqs});
    } catch(e){
        console.log("An error occurred:", e);
        res.status(500).json({msg: "Internal server error"});
    }
}

module.exports = {
    createVolunteerReq,
    getVolunteerReqById,
    getReqsAppliedByScribe,
    checkScribeApplied
}