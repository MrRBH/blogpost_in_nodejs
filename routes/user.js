const {Router}= require("express");
const User = require("../models/user");
const router = Router();
router.get("/signin",(req,res)=>{
return res.render("signin")
})
router.post("/signin", async(req,res)=>{
    const {email,password} = req.body
    await User.matchPassword({email,password});
 console.log("User",User);
 res.redirect('/')
    })
router.get("/signup",(req,res)=>{
return res.render("signup")
})
router.post("/signup",async(req,res)=>{
    const {fullname,email,password} = req.body;
await User.create({ 
    fullname,email,password
}); 
res.redirect("/");
})
module.exports = router 