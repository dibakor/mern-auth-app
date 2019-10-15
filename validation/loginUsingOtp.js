const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInputForOtp(data) {
    let errors = {};
    console.log("data mobile: "+data.mobile);
    console.log("data otp: "+data.otp);
  // Convert empty fields to an empty string so we can use validator functions
    data.mobile = !isEmpty(data.mobile) ? data.mobile : "";
    data.otp = !isEmpty(data.otp) ? data.otp : "";
  // Email checks
    if (Validator.isEmpty(data.mobile)) {
      errors.email = "Mobile number is required";
    } else if (!Validator.isMobilePhone(data.mobile,'en-IN',strictMode=true)) {
      errors.mobile = "Mobile Number is invalid";
    }
  // Password checks
    if (Validator.isEmpty(data.otp)) {
      errors.otp = "OTP field is required";
    } else if (!Validator.isLength(data.otp.toString(), { min: 4, max: 4 })){
      errors.otp = "OTP must be of four digit";
      console.log("Inside here");
    }
  return {
      errors,
      isValid: isEmpty(errors)
    };
  };