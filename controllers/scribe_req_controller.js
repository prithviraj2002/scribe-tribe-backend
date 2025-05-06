const ScribeReq = require('../model/scribe_request_model');
const Volunteer = require('../model/volunteers');
const Scribe = require('../model/scribe_model');
const {sendNotification} = require('../notif_service');
const admin = require('../config/firebase-config');

async function createReq(req, res){
    try{
        const {
            examName, subject, language, date, time,
            duration, address, city, pincode, board,
            modeOfExam, studentId, scribeId, isOpen} = req.body;
        const phone = req.user.phone_number;

        if(!phone){
            return res.status(400).json({msg: "Unauthorized, student phone not found!"});
        }

        else if(
            !examName || !subject || !language ||
            !date || !time || !duration || !address||
            !city || !pincode || !board || !modeOfExam||
            !studentId || !isOpen
        ){
            return res.status(400).json({msg: "Missing values!"});
        }

        else{
            var scribeReq = await ScribeReq.create({
                examName: examName,
                subject: subject,
                language: language,
                date: date,
                time: time,
                duration: duration,
                address: address,
                city: city,
                pincode: pincode,
                board: board,
                modeOfExam: modeOfExam,
                studentId: phone,
                scribeId: scribeId,
                isOpen: isOpen,
            })

            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(date);

            await sendNotification({
                sender: "New Scribe Request",
                content: `New request for ${subject} on ${formattedDate} at ${city}.`,
            });

            return res.status(201).json({msg: "Created request!", data: scribeReq._id});
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function getScribeReq(req, res) {
    try {
        const { isComplete } = req.query;
        const {isOpen} = req.query;

        let filter = {};

        if (isComplete === 'true') {
            filter.isComplete = true;
        } else if (isComplete === 'false') {
            filter.isComplete = false;
        }

        if (isOpen === 'true') {
            filter.isOpen = true;
        } else if (isOpen === 'false') {
            filter.isOpen = false;
        }

        const reqs = await ScribeReq.find(filter);

        return res.status(200).json({ data: reqs });
    } catch (e) {
        return res.status(500).json({ msg: "Internal server error", error: e });
    }
}

async function getScribeReqById(req, res){
    try{
        var reqId = req.params.id;

        if(!reqId){
            return res.status(400).json({msg: "Scribe req id not found"});
        }

        else{
            var scribeReq = await ScribeReq.findById(reqId);

            return res.status(200).json({data: scribeReq});
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function getScribeReqByScribeId(req, res){
    try{
        var scribeUid = req.params.id;
        var isComplete = req.query.isComplete;
        var {isOpen} = req.query;

        if(!scribeUid){
            return res.status(400).json({msg: "Unauthorized, uid not found!"});
        }

        else{
            let filter = {};

            if (isComplete === 'true') {
                filter.isComplete = true;
            } else if (isComplete === 'false') {
                filter.isComplete = false;
            }

            if (isOpen === 'true') {
                filter.isOpen = true;
            } else if (isOpen === 'false') {
                filter.isOpen = false;
            }

            var reqs = await ScribeReq.find({scribeId: scribeUid, ...filter});

            return res.status(200).json({data: reqs});
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function getScribeReqByStudentId(req, res){
    try{
        var studentUid = req.user.phone_number;
        var isComplete = req.query.isComplete;
        var {isOpen} = req.query;

        if(!studentUid){
            return res.status(400).json({msg: "Unauthorized, uid not found!"});
        }

        else{
            let filter = {};

            if (isComplete === 'true') {
                filter.isComplete = true;
            } else if (isComplete === 'false') {
                filter.isComplete = false;
            }

            
            if (isOpen === 'true') {
                filter.isOpen = true;
            } else if (isOpen === 'false') {
                filter.isOpen = false;
            }
            var reqs = await ScribeReq.find({studentId: studentUid, ...filter});

            return res.status(200).json({data: reqs});
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function delScribeReq(req, res){
    try{
        var reqId = req.params.id;

        if(!reqId){
            return res.status(400).json({msg: "Scribe request id not found!"});
        }

        else{
            var scribeReq = await ScribeReq.findById(reqId);

            if(!scribeReq){
                return res.status(404).json({msg: "Scribe request id not found!"});
            }
            else{
                await ScribeReq.findByIdAndDelete(reqId);

                return res.status(200).json({msg: "Scribe request deleted successfully!"});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function updateScribeRequest(req, res) {
    try {
        const updateData = req.body;
        const scribeReqId = req.params.id;

        if (!scribeReqId) {
            return res.status(400).json({ msg: "No scribe request id found!" });
        }

        if (!updateData) {
            return res.status(400).json({ msg: "No data found to update!" });
        }

        const existingReq = await ScribeReq.findById(scribeReqId);

        if (!existingReq) {
            return res.status(404).json({ msg: "No req with id found!" });
        }

        // Update the request
        await ScribeReq.findByIdAndUpdate(scribeReqId, updateData);

        // ✅ Trigger notification only if both conditions are met
        if (updateData.scribeId && updateData.isOpen === false && !updateData.isComplete) {
            const topic = `scribe_${updateData.scribeId.substring(1)}`;
            console.log("topic: ", topic);

            const payload = {
                notification: {
                    title: "You've been selected!",
                    body: "A student has selected you as a scribe! Find the scribe request under ongoing requests",
                },
                topic: topic,
            };

            try {
                await admin.messaging().send(payload);
                console.log(`Notification sent to topic ${topic}`);
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        }

        if(updateData.scribeId && updateData.isOpen === false && updateData.isComplete === true){
            const topic = `scribe_${updateData.scribeId.substring(1)}`;
            console.log("topic: ", topic);

            const payload = {
                notification: {
                    title: "Scribe request completed successfully!",
                    body: "A student has completed the request and added a review for you, Check now!",
                },
                topic: topic,
            };

            try {
                await admin.messaging().send(payload);
                console.log(`Notification sent to topic ${topic}`);
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        }

        return res.status(200).json({ msg: "Updated successfully!" });

    } catch (e) {
        return res.status(500).json({ msg: "Internal server error", error: e });
    }
}

async function getInterestedScribes(req, res){
    try{
        var scribeReqId = req.params.id;

        if(!scribeReqId){
            return res.status(500).json({msg: "No id found!"});
        }
        else{
            const scribes = [];

            const reqs = await Volunteer.find({scribe_req_id: scribeReqId});
            console.log("Reqs", reqs);

            for (const req of reqs) {
                const scribe = await Scribe.findOne({ phone: req.scribe_id }); // Use findOne instead of find
                if (scribe) {
                    console.log("Interested scribe:", scribe);
                    scribes.push(scribe);
                }
            }

            return res.status(200).json({scribes: scribes});
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error"});
    }
}

module.exports = {
    createReq,
    getScribeReq,
    getScribeReqById,
    getScribeReqByScribeId,
    delScribeReq,
    updateScribeRequest,
    getScribeReqByStudentId,
    getInterestedScribes
}