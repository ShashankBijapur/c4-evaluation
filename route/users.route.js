const express = require("express");
const userRoute = express.Router()
const {UserModel} = require("../model/users.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Registration for users

userRoute.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married} = req.body
    try {
        const totalUsers = await UserModel.find({email})
        if(totalUsers){
            res.status(400).send("User already exist, please login")
        }
        bcrypt.hash(password,6,async(err,hash)=>{
            const user = new UserModel({name,email,gender,password:hash,age,city,is_married})
            await user.save()
            res.status(200).send("Registration Successfull")
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// login using token
userRoute.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user= await UserModel.findOne({email,password})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).send({"msg":"Login successfull","token":jwt.sign({"userID":user_id},"C4-eval")})
                }else{
                    res.status(400).send("Wrong credentials")
                }
            })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports={
    userRoute
}