const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validat
// Load User model
const User = require("../../models/UserSchema");
const Host = require("../../models/HostSchema");
const Room = require("../../models/RoomSchema");
// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {

    User.findOne({email:req.body.email}).then(user=>{
        if(user){
            return res.status(400).json({email:"Email already exists"});
        } else{
            const newUser = new User({
                name:req.body.name,
                password:req.body.password,
                email:req.body.email
            });

            // Hash password before storing in database
            const rounds  = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }

    });

});

router.post("/roominfo",(req,res)=>{
    const roomname = req.body.roomname;
    const roomcode = req.body.roomcode;
    const host = req.body.host;
    const attend = req.body.attend;
    const NewRoom= new Room({
        roomcode: roomcode,
        roomname: roomname,
        host : host,
        attendees : [],
        
    }) 
    NewRoom.save()
    .then(roomcode => res.json(roomcode))
    .catch(err => console.log(err));
    
     });
router.get("/roomques",async (req,res)=>{
const roomcode = req.body.roomcode;
let questions = await Host.findOne({roomcode : roomcode});
if(questions === null){
    res.status(400).send("Error: No room found");
}
else{
    res.status(200).send({success:true,questions});
}
});
router.post("/hostquestion",(req,res)=>{
const roomname = req.body.roomname;
const roomcode = req.body.roomcode;
const questions = req.body.questions;
const options = req.body.options;
const correctanswers = req.body.correctanswers;
const hoster = req.body.host;
const NewHost = new Host({
    roomcode: roomcode,
    roomname: roomname,
    questions:questions,
    options : options,
    correctanswers : correctanswers,
    host : hoster,
});
NewHost.save()
.then(roomcode => res.json(roomcode))
.catch(err => console.log(err));
 });
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login",(req,res) => {

    const email = req.body.email;
    const password = req.body.password;
   
    //Find user by Email
    User.findOne({email}).then(user=>{
        if(!user){
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            const name = user.name
            // Create JWT Payload
            const payload = {
                id: user.id,
                name: user.name
            };

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                 expiresIn: 31556926 
                },
                (err, token) => {
                res.json({
                    success: true,
                    name: name,
                    token: "Bearer " + token
                });
                }
            );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
});

module.exports = router;