const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cors = require("cors")


const User = require("./models/UsersModel.js") 

app.use(express.json());
app.use(cors());


function tokenAuthentication(req,res,next){

    try{
    const token = req.headers.autherization?.split(" ")[1];
    if(!token){
        res.redirect("/login");
    }
    else{
    const verified = jwt.verify(token,process.env.SECRET_KEY);
    req.user = verified;
    next()


    }
}catch(err){
    console.log(err);
}



}



app.listen(8000,()=>{
    console.log("listening");
});


mongoose.connect(process.env.MONGO_URL)
.then(console.log("connected to db")).catch("error")


app.post("/signup",async(req,res)=>{

    try{
    const checkUser = await User.findOne({name:req.body.name});
    if(checkUser){
        res.status(409).json({msg:"User Already Exist"})

    }
    else{
        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const newUser = new User({
            name : req.body.name,
            password:hashedPassword
        })

        await newUser.save();
        res.status(201).json({ msg: "User saved" });
    }
}catch(error){
    res.status(500).json({ msg: "Signup failed", error: err.message})

}
            


        
    }
)

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const newUser = await User.findOne({ name });

    if (!newUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    const checkPass = newUser.password === password; // In real apps, use bcrypt.compare

    if (checkPass) {
      const token = jwt.sign(
        { name: newUser.name },
        process.env.SECRET_KEY,
        { expiresIn: '5m' }
      );
      return res.json({ msg: "WELCOME " + newUser.name, token });
    } else {
      return res.status(404).json({ msg: "Wrong Password" });
    }

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ msg: "Login Failed" });
  }
});