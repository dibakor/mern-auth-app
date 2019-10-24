const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
// Name of the user
  name: { 
    type: String,
    required: true
  },
// Email of the user
  email: { 
    type: String,
    required: true
  },
//mobile Number of user
  mobile: {
    type: String,
    required: true
  },
//encrypted password of the user
  password: {
    type: String,
    required: true
  },
//generated OTP 
  otp: {
    type:Number
  },

//generated time of OTP
  otpTime: {
    type: Date
  },
// date when this Document was created
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("users", UserSchema);
