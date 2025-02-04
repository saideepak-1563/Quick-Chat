const dotenv = require('dotenv')

dotenv.config({path : './config.env'})

const dbConfig = require('./DBconfig/db')

const server = require('./app')

PORT = process.env.PORT_NUM || 4000

server.listen(PORT,()=>{
    console.log("Listening on PORT : " + PORT)
})