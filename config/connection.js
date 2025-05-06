const mongoose = require('mongoose')

async function connectDb(url){
    mongoose.connect(url)
    .then(() => console.log("Connected to db"))
    .catch(() => console.log("An error occurred while connecting to db"))
}

module.exports ={
    connectDb
}