const isEmpty = require("is-empty");
module.exports = function sendOTP(mobile,data) {
const keys = require("../config/keys");
const client = require('twilio')(keys.accountSid,keys.authToken);
let errors = {};

//create message object
client.messages
  .create({
     body: data, //otp
     from: '+12052551559',
     to: mobile //mobile number of receiver
   })
  .then(message=>console.log("This is the state of messages",message.status))
  .catch((error) =>{
      errors.otp = 'OTP not generated';
      console.log(errors.otp);
  });
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
