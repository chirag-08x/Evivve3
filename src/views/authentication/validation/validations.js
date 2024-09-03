import { toast } from "react-toastify";
import validator from "validator";

export const validateSignupValues = (
  fname,
  lname,
  email,
  password,
  password1,
  timezone
) => {
  if (!fname || !validator.isAlpha(fname)) {
    toast.warning("Please enter a valid first name.");
    return false;
  }
  if (!lname || !validator.isAlpha(lname)) {
    toast.warning("Please enter a valid last name.");
    return false;
  }
  if (!email || !validator.isEmail(email)) {
    toast.warning("Please enter a valid email.");
    return false;
  }
  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
  ) {
    toast.warning("Please enter a valid password.");
    return false;
  }
  if (!password1 || !password === password1) {
    toast.warning("Password does not match.");
    return false;
  }
  if (!timezone) {
    toast.warning("Please select a valid timezone.");
    return false;
  }
  return true;
};
