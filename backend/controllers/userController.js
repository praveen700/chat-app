const asyncHanlder  = require('express-async-handler'); 
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHanlder(async (req, res) => { 
    const {name,  email, password, pic} = req.body;
    if(!name || !email || !password){
        res.status(404);
        throw new Error('Please Enter All the Feilds');
    }

    const userExits = await User.findOne({ email })
    if(userExits){
        res.status(404);
        throw new Error('User Already Exists');
    }

    const newUser = await User.create({
        name,
        email,
        password,
        pic
    });
    if(newUser){
        res.status(200).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id,)
        });

    }else{
        res.status(404);
        throw new Error('Failes to create new user');
    }
});

const authUser = asyncHanlder(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(401);
        throw new Error('Invalid Email and Password');
    }

})


const allUsers = asyncHanlder(async(req, res) => {

    const keyword = req.query.search ? 
    {
        $or: [
            {
                name : { $regex: req.query.search, $options: "i"},
                email : { $regex: req.query.search, $options: "i"},
            }
        ]
    }: {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users)
   
})

module.exports = {registerUser, authUser, allUsers}