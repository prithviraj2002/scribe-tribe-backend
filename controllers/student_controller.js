const Student = require('../model/student_model')
const ScribeRequest = require('../model/scribe_request_model');

async function createStudent(req, res){
    try{
        const {name, email, gender, age, address, city, pincode} = req.body;
        var phone = req.user.phone_number;

        if(!phone){
            return res.status(400).json({msg: "Phone number missing"})
        }

        else if(!name || !email || !gender || !age || !address || !city || !pincode){
            return res.status(400).json({msg: "Bad request, missing values!"});
        }
        else{
            var student = await Student.create({
                phone: phone,
                name: name,
                email: email, 
                gender: gender,
                age: age,
                address: address,
                city: city,
                pincode: pincode
            });

            return res.status(201).json({msg: "Student created!", id: student._id})
        }
    } 
    catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function delStudent(req, res){
    try{
        var phone = req.user.phone_number;

    if(!phone){
        return res.status(400).json({msg: "Bad request, no id given"})
    }
    else{
        var student = await Student.findOne({phone})

        if(!student){
            return res.status(404).json({msg: "Not found!"})
        }
        else{
            await Student.findOneAndDelete({phone})
            
            return res.status(200).json({msg: "Deleted successfully!"})
        }
    }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function updateStudent(req, res){
    try{
        var phone = req.user.phone_number;
        var updateData = req.body;

        if(!phone){
            return res.status(400).json({msg: "Bad request, no phone given"});
        }
        else{
            var student = await Student.findOne({phone});

            if(!student){
                return res.status(404).json({msg: "No student found!"});
            }
            else{
                await Student.findOneAndUpdate({phone}, updateData);
                return res.status(200).json({msg: "Updated successfully!"});
            }
        }

    } catch(e){
        return res.status(500).json({msg: "An error occurred: ", error: e});
    }
}

async function studentProfileExists(req, res){
    try{
        var phone = req.user.phone_number;

        if(!phone){
            return res.status(400).json({msg: "No uid found!"});
        }
        else{
            var scribe = await Student.findOne({phone});

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

async function getStudent(req, res) {
    try{
        var phone = req.query.phone;
        console.log(phone);

    if(!phone){
        return res.status(400).json({msg: "Bad request, no id found"})
    }
    else{
        var student = await Student.findOne({phone});

        if(!student){
            return res.status(404).json({msg: "Not found!"});
        }
        else{
            return res.status(200).json({data: student});
        }
    }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function getStudentFromId(req, res){
    try{
        var id = req.params.id;

        if(!id){
            return res.status(400).json({msg: "ID missing"});
        }

        else{
            var student = await Student.findOne({phone: id});

            if(!student){
                return res.status(404).json({msg: "Student not found!"});
            }
            else{
                return res.status(200).json({data: student});
            }
        }
    } catch(e){
        console.log("Internal server error occurred while getting student from id: ", e);
        return res.status(500).json({msg: "Internal server error", error: e});
    }
}

async function getStudentFromToken(req, res) {
    try{
        var phone = req.user.phone_number;
        console.log(phone);

    if(!phone){
        return res.status(400).json({msg: "Bad request, no id found"})
    }
    else{
        var student = await Student.findOne({phone});

        if(!student){
            return res.status(404).json({msg: "Not found!"});
        }
        else{
            return res.status(200).json({data: student});
        }
    }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

async function getStudentScribeReq(req, res){
    try{
        var studentId = req.params.id;
        var status = req.params.status;

        if(!id){
            return res.status(500).json({msg: "Bad request, no id found!"});
        }
        else{
            var student = await Student.findById(studentId);

            if(!student){
                return res.status(404).json({msg: "Student not found!"});
            }
            else{

                let filter = { studentId };

                if (status && (status === true || status === false)) {
                filter.status = status; 
                }

                var reqs = await ScribeRequest.find(filter);

                return res.status(200).json({data: reqs});
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

module.exports = {
    createStudent,
    getStudent,
    updateStudent,
    delStudent,
    getStudentScribeReq,
    studentProfileExists,
    getStudentFromToken,
    getStudentFromId
}