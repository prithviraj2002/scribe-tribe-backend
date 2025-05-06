const Scribe = require('../model/scribe_model')
const Volunteer = require('../model/volunteers')

async function createScribe(req, res){
    console.log("Creating scribe!");
    try{
        const {name, email, gender, address, city, pincode, age, contact, languagesKnown} = req.body;
        var phone = req.user.phone_number;

        if(!name || !email || !gender || !city || !pincode || !address || !age || !contact || !languagesKnown){
            return res.status(400).json({msg: "Bad request, missing values"});
        }
        else{
            var scribe = await Scribe.create({
                phone: phone,
                name: name,
                email: email,
                gender: gender,
                address: address,
                city: city,
                pincode: pincode,
                contact: contact,
                age: age,
                languagesKnown: languagesKnown 
            });

            return res.status(201).json({data: 
                scribe._id
            });
        }
    } catch(e){
        return res.status(500).json({msg: "An error occured", error: e});
    }
}

async function delScribe(req, res){
    try{
        var phone = req.user.phone_number;

        if(!phone){
            return res.status(400).json({msg: "Bad request, no id given"});
        }
        else{
            var scribe = await Scribe.findOne({phone});

            if(!scribe){
                return res.status(404).json({msg: "No scribe found!"});
            }
            else{
                await Scribe.findOneAndDelete({phone});

                return res.status(200).json({msg: "Scribe deleted successfully!"})
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function getAllScribe(req, res){
    try{
        var scribes = await Scribe.find({});

        return res.status(200).json({data: scribes});
    } catch(e){
        console.log(e);
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function updateScribe(req, res){
    try{
        var phone = req.user.phone_number;
        var updateData = req.body;

        if(!phone){
            return res.status(400).json({msg: "Bad request, no id found!"})
        }
        else{
            var scribe = await Scribe.findOne({phone});

            if(!scribe){
                return res.status(404).json({msg: "No scribe found with the given id"});
            }
            else{
                await Scribe.findOneAndUpdate({phone}, updateData)

                return res.status(200).json({msg: "Scribe updated!"});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function getScribe(req, res) {
    try {
        const phone = req.user.phone_number; 
        console.log(phone);

        if (!phone) {
            return res.status(400).json({ msg: "Phone number is required" });
        }

        const scribe = await Scribe.findOne({phone}); 

        if (!scribe) {
            return res.status(404).json({ msg: "Scribe not found" });
        }

        return res.status(200).json({ data: scribe });
    } catch (e) {
        console.error("Error fetching scribe:", e);
        return res.status(500).json({ msg: "An error occurred", error: e });
    }
}

async function getReqByScribe(req, res){
    try{
        var phone = req.user.phone_number;
        var status = req.params.status;

        if(!phone){
            return res.status(400).json({msg: "Bad request!"});
        }
        else{
            var scribe = await Scribe.findOne({phone});

            if(!scribe){
                return res.status(404).json({msg: "No scribe found!"});
            }
            else{
                var reqs = await Volunteer.find({phone}, status);

                return res.status(200).json({data: reqs});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e})
    }
}

async function scribeProfileExists(req, res){
    try{
        var phone = req.user.phone_number;

        if(!phone){
            return res.status(400).json({msg: "No uid found!"});
        }
        else{
            var scribe = await Scribe.findOne({phone});

            if(!scribe){
                return res.status(200).json({exists: false});
            }
            else{
                return res.status(200).json({exists: true});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function getScribeFromId(req, res){
    try{
        var scribeId = req.params.id;

        if(!scribeId){
            return res.status(400).json({msg: "Scribe id missing!"});
        }
        else{
            var scribe = await Scribe.findOne({phone: scribeId});

            if(!scribe){
                return res.status(404).json({msg: "No scribe found with given id"});
            }
            else{
                return res.status(200).json({data: scribe});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

module.exports = {
    createScribe,
    delScribe,
    updateScribe, 
    getScribe,
    getReqByScribe,
    scribeProfileExists,
    getAllScribe,
    getScribeFromId
}