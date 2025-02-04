const router = require('express').Router()

const User = require('../Models/User')
const cloudinary = require('../couldinary')
const middleware = require('../middleware/middleware')



router.get("/getlogginuser", middleware, async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.userId })

        res.send({
            message: "User Fetched Successful",
            success: true,
            data: user
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

router.get("/getalluser", middleware, async (req, res) => {
    try {

        const allUsers = await User.find({ _id: { $ne : req.body.userId} })

        res.send({
            message: "All User Fetched Successful",
            success: true,
            data: allUsers
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

router.post('/upload-profile-pic', middleware, async (req, res) => {
    try{
        const image = req.body.image;

        //UPLOAD THE IMAGE TO CLODINARY
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'Quick-Chat'
        });

        //UPDATE THE USER MODEL & SET THE PROFILE PIC PROPERTY
        const user = await User.findByIdAndUpdate(
            {_id: req.body.userId},
            { profilePic: uploadedImage.secure_url},
            { new: true}
        );

        res.send({
            message: 'Profic picture uploaded successfully',
            success: true,
            data: user
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false
        })
    }
})


module.exports = router