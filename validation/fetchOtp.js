const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateMobileToGetOtp(data) {
    console.log(data);
    let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
    data.mobile = !isEmpty(data.mobile) ? data.mobile : "";
    console.log("Inside validation.");
    console.log(data.mobile);
  // Mobile checks
    if (Validator.isEmpty(data.mobile)) {
      errors.mobile = "Mobile number is required";
    } else if (!Validator.isMobilePhone(data.mobile,'en-IN',strictMode=true)) {
      errors.mobile = "Mobile Number is invalid";
    }
  return {
      errors,
      isValid: isEmpty(errors)
    };
  };