const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config();
const {auth} = require("./middleware/auth.middleware")
const {userRoute} = require("./route/users.route")
const {postRoute} = require("./route/posts.route")


app.use(express.json())
app.use(cors)
app.use("/users",userRoute)
app.use(auth)
app.use("./posts",postRoute)

app.listen(process.env.port,async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to DB")
    } catch (error) {
        console.log(error.message)
    }
})