const Validator = require("validator");
const passwordValidator = require("password-validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  let schema = new passwordValidator();
  schema
.is().min(6)
.is().max(30)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols();

// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.mobile = !isEmpty(data.mobile) ? data.mobile : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

// mobile checks
 if(Validator.isEmpty(data.mobile)){
   errors.mobile = "Mobile Number field is required";
 } else if (!Validator.isMobilePhone(data.mobile,'en-IN',strictMode=true)) {
   errors.mobile = "Mobile Number is invalid";
 }
//Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
// if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
//     errors.password = "Password must be at least 6 characters";
//   }
if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

//Check whether the password is strong or not
if(!schema.validate(data.password)){ 
  errors.password = "Password should have atleast one uppercase,one lowercase,one digit";
}
return {
    errors,
    isValid: isEmpty(errors)
  };
};
