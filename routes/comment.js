const { Router } = require("express");
const User = require("../models/user");


const router = Router();


router.get('/',(req,res)=>{
    res.render('comment',);
})



module.exports = router;
