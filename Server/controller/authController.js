const router = require('express').Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require('../Models/User')

router.post("/signup", async(req,res) => {
    try {

        const user = await User.findOne({email : req.body.email})

        if(user){
            return res.send({
                message : "User Already Exists",
                success : false
            })
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashPassword

        const newUser = new User(req.body)
        await newUser.save()

        res.status(201).send({
            message : "User Registered Successfully",
            success : true
        })


    } catch (error) {
        res.send({
            message : error.message,
            success : false
        })

    }
})

router.post("/login", async(req,res) => {
    try {

        const user = await User.findOne({email : req.body.email})
        if(!user){
            return res.send({
                message : "User Not Exists",
                success : false
            })
        }

        const isValid = await bcrypt.compare(req.body.password, user.password)
        if(!isValid){
            return res.send({
                message : "Invalid Password",
                success : false
            })
        }

        const token = jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn : '1d'})

        return res.send({
            message : 'User Login Successful',
            success : true,
            token : token
        })
        
    } catch (error) {
        res.send({
            message : error.message,
            success : false
        }) 
    }
})


module.exports = router