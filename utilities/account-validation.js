const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const validate = {}

/* ****************************************
 * Reglas de validación para Login
 **************************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty.")
  ]
}

/* ****************************************
 * Middleware para manejar errores del Login
 **************************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email
    })
  }
  next()
}

module.exports = validate
