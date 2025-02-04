const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.connection

db.on('connected',()=>{
    console.log("Connected to DB")
})

db.on('err',()=>{
    console.log("Connected failed to DB")
})


module.exports = db