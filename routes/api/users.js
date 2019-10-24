const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateLoginInputForOtp = require("../../validation/loginUsingOtp")
const validateMobileToGetOtp = require("../../validation/fetchOtp")
// Load User model
const User = require("../../models/User")

//Load OTP service
const sendOTP = require("../../util/sendOtp")

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
 //Check if email ID exists
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      }
      else {
 //Check if mobile number exists
        User.findOne({ mobile: req.body.mobile }).then(user => {
          if (user) {
            return res.status(400).json({ mobile: "Mobile Number already exists" });
          }  
          else{
	//get User details from request body
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
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
    })
    } 
    });
  });

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
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
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
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

// @route POST api/users/loginOtp
// @desc Login user using mobile and return JWT token
// @access Public
router.post("/loginOtp", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInputForOtp(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const mobile = req.body.mobile;
const otp = req.body.otp;
const dateOtp = new Date();
// Find user by email
  User.findOne({ mobile }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ mobilenotfound: "Mobile Number not found" });
    }
    let seconds = (dateOtp.getTime() - user.otpTime.getTime())/1000;
    
    // Check if the generated OTP and user provided OTP are the same
    // and check if the OTP is still valid
    // criteria to check OTP validation is OTP should not be less than 5 mins old
      if (Number(otp)===Number(user.otp) && (seconds<300)){ 
        // User matched
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
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ otpincorrect: "OTP incorrect" });
      }
    });
  });

// @route POST api/users/fetchOtp
// @desc generate OTP
// @access Public
router.post("/fetchOtp", (req, res) => {
  // Form validation
const { errors, isValid } = validateMobileToGetOtp(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const mobile = req.body.mobile;

//function to create OTP
const generateOtp = () => {
  return Math.floor(1000+Math.random() * 9000);
}
const generatedotp = generateOtp();
console.log("Generate OTP: ",generatedotp);
// Find user by email
  User.findOne({ mobile }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ mobilenotfound: "Mobile Number not found" });
    }
    //send generated OTP to twilio service
    const { errors, isValid } = sendOTP(user.mobile,generatedotp);
    if(!isValid){
      console.log("Errors in OTP");
      return res.status(400).json(errors);
    }
    
    //update details of User OTP and OTP generated time in DB
    User.updateOne({_id:user._id},{$set:{ otp: generatedotp,otpTime: Date.now()}})
    .then(db =>{
        console.log(db);
        res.status(200).json({ dbUpdated: 'Otp updated' });
    })
    .catch(err=>{
      res.status(404).json({ errors: 'Otp not updated.' });
    })
    });
  });
  module.exports = router;
