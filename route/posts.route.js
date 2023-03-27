const express  = require("express");
const postRoute = express.Router();
const {PostModel} = require("../model/posts.model")
const jwt = require("jsonwebtoken")

postRoute.get("/",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token,"C4-eval")
    try {
        if(decoded){
            const post = await PostModel.find({"userID":decoded.user._id})
            res.status(200).send(post)
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

postRoute.post("/add", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "C4-eval");

        if (decoded) {
            const userId = decoded.user._id;
            const postData = req.body;
            if (postData.user === userId) {
                const post = new PostModel(postData);
                await post.save();
                res.status(200).send("New post added into your account");
            } else {
                res.status(401).send("Unauthorized user");
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

postRoute.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "C4-eval");
        const userId = decoded.user._id;

        const post = await PostModel.findOne({ _id: id, user: userId });
        if (post) {
            const updatedPost = await PostModel.findByIdAndUpdate(
                { _id: id },
                payload,
                { new: true }
            );
            res.status(200).send(updatedPost);
        } else {
            res.status(401).send("Unauthorized user");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

postRoute.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "C4-eval");
        const userId = decoded.user._id;

        const post = await PostModel.findOne({ _id: id, user: userId });
        if (post) {
            await PostModel.findByIdAndDelete({ _id: id });
            res.status(200).send("Post deleted Successfully");
        } else {
            res.status(401).send("Unauthorized user");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports={
    postRoute
}