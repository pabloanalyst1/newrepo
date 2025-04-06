const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/server-validation") // ✅ CORRECTO

// Route to build the login view
router.get("/login", accountController.buildLogin)

// Route for Registration view
router.get("/register", accountController.buildRegister)

// Route to process Registration with validation ✅
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)

// Error handler middleware
router.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav
  })
})

module.exports = router
