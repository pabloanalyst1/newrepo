const { body, validationResult } = require("express-validator")
const utilities = require("../")

const regValidate = {}

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
regValidate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .matches(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{12,}$/)
      .withMessage(
        "Password must be at least 12 characters and include at least 1 number, 1 uppercase letter, and 1 special character."
      ),
  ]
}

/* **********************************
 *  Check data and return errors or continue
 * ********************************* */
regValidate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
    return
  }
  next()
}

module.exports = regValidate
