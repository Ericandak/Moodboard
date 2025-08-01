const express=require('express');
const router=express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async(req,res)=>{
    const{ username,email,password}=req.body;

    try{
        const userByEmail=await User.findOne({email});
        if(userByEmail){
            return res.status(400).json({msg:'a user with that email already exists'});
        }

        const userByUsername=await User.findOne({username});
        if(userByUsername){
            return res.status(400).json({msg:'a user with that Username already exists'});
        }
        const user=new User({
            username,
            email,
            password,
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    }
    catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }

});



router.post('/login',async(req,res)=>{
    const {email,password}=req.body

    try{
        //user exists check?
        const user=await User.findOne({ email});
        if(!User){
            return res.status(400).json({msg:'Invalid credentials'});
        }
        // password check?
        const isMatch=await user.isMatch(password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid credentials'});
        }

        // jwt payload creation
        const payload={
            user:{
                id:user.id,
            },
        };

        //sign token
        jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600},//one hour time window
            (err,token)=>{
            if(err) throw err;
            res.json({token});//send the token  to client
            }
        );
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


module.exports=router
