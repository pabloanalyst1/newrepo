const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/server-validation")
const validate = require("../utilities/account-validation")
const auth = require("../utilities/auth-middleware")

// Build login view
router.get("/login", accountController.buildLogin)

// Process login with validation
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  accountController.loginAccount
)

// Logout
router.get("/logout", accountController.logoutAccount)

// Build registration view
router.get("/register", accountController.buildRegister)

// Process registration with validation
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)

// Protected dashboard
router.get("/dashboard", auth.checkLogin, accountController.buildDashboard)

// Build update account view
router.get("/edit", auth.checkLogin, accountController.buildUpdateForm)

// Procesar update info
router.post("/update", auth.checkLogin, accountController.updateAccount)

// Procesar password update
router.post("/update-password", auth.checkLogin, accountController.updatePassword)

// Error handler middleware (this stays last)
router.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  })
})

module.exports = router
