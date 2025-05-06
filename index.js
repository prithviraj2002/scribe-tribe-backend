const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const multer = require('multer')

const app = express()
const PORT = 8000
const url = 'mongodb://127.0.0.1:27017/scribe-tribe'

const studentRouter = require('./router/student_router')
const reviewRouter = require('./router/review_router')
const scribeRouter = require('./router/scribe_router')
const scribeReqRouter = require('./router/scribe_req_router')
const volunteerRouter = require('./router/volunteer_router')

const {connectDb} = require('./config/connection')
const middleware = require('./middleware/auth_middleware');

//add db url here
connectDb(url)

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true}))
app.use(cors())
app.use(middleware.authenticateToken)

app.use('/student', studentRouter),
app.use('/review', reviewRouter),
app.use('/scribe', scribeRouter),
app.use('/scribeReq', scribeReqRouter),
app.use('/volunteer', volunteerRouter),

upload = multer({dest: "uploads/"});

app.post('/upload', upload.single('file'), async(req, res) => {
    
})

app.post('/user/setRole', async(req, res) => {
    try{
        const {uid, role} = req.body;

        if(!uid || !role){
            return res.status(400).json({msg: "User id and role missing"});
        }
        else{
            await admin.auth().setCustomUserClaims(uid, {role});

            console.log(`${role} set to ${uid}`);
            return res.status(201).json({msg: `${uid} set to ${role}`})
        }
    } catch(e){
        console.log(e);
        return res.status(500).json({msg: "User role missing"})
    }
});

app.get('/user/getUserRole', async(req, res) => {
    const { uid } = req.query;

  try {

    if(!uid){
        return res.status(400).json({msg: "No uid found!"})
    }

    else{
        const userRecord = await admin.auth().getUser(uid);
        const role = userRecord.customClaims?.role || ""; 

        res.status(200).json({role: role});
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching role" });
  }
});

app.post('/auth/verifyToken', async(req, res) => {
    const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ msg: "Invalid or missing token" });
        }

        const token = authHeader.split(" ")[1];

        console.log("Extracted Token:", token);

        const decodedToken = await admin.auth().verifyIdToken(token);

        if (decodedToken) {
            console.log("Decoded Token:", decodedToken);
            req.user = decodedToken; 
            return res.status(200).json({valid: true});
        } else {
            return res.status(401).json({valid: false});
        }
})

app.listen(PORT, (() => console.log("Server running at ", PORT)))