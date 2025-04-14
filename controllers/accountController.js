const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
 *  Build Login View
 **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: [],
    messages: req.flash("notice"),
    account_email: "",
  })
}

/* ****************************************
 *  Build Registration View
 **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: [],
    messages: req.flash("notice"),
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  })
}

/* ****************************************
 *  Process Registration
 **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"),
        account_email,
      })
    } else {
      req.flash("notice", "Registration failed. Please try again.")
      return res.status(500).render("account/register", {
        title: "Register",
        nav,
        messages: req.flash("notice"),
        account_firstname,
        account_lastname,
        account_email,
        errors: []
      })
    }
  } catch (error) {
    console.error("❌ registerAccount error:", error)
    req.flash("notice", "An unexpected error occurred.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      messages: req.flash("notice"),
      account_firstname,
      account_lastname,
      account_email,
      errors: []
    })
  }
}

/* ****************************************
 *  Process Login
 **************************************** */
async function loginAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "No account found with that email.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      account_email,
      errors: [],
    })
  }

  const match = await bcrypt.compare(account_password, accountData.account_password)
  if (!match) {
    req.flash("notice", "Incorrect password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      account_email,
      errors: [],
    })
  }

  // Gpara guardar guardar datos en sesión
  req.session.loggedin = true
  req.session.accountId = accountData.account_id
  req.session.accountFirstName = accountData.account_firstname
  req.session.accountLastName = accountData.account_lastname
  req.session.accountEmail = accountData.account_email
  req.session.accountType = accountData.account_type

  req.flash("notice", `Welcome back, ${accountData.account_firstname}.`)
  res.redirect("/account/dashboard")
}

/* ****************************************
 *  Logout
 **************************************** */
function logoutAccount(req, res) {
  req.session.destroy(() => {
    res.redirect("/")
  })
}

/* ****************************************
 *  Build Dashboard (protected)
 **************************************** */
async function buildDashboard(req, res) {
  const nav = await utilities.getNav()

  const accountData = {
    account_id: req.session.accountId,
    account_firstname: req.session.accountFirstName,
    account_lastname: req.session.accountLastName,
    account_email: req.session.accountEmail,
    account_type: req.session.accountType
  }

  res.render("account/dashboard", {
    title: "Dashboard",
    nav,
    accountData,
    messages: req.flash("notice")
  })
}

/* ****************************************
 *  Build Update Account View
 **************************************** */
async function buildUpdateForm(req, res) {
  const nav = await utilities.getNav()
  const accountData = {
    account_firstname: req.session.accountFirstName,
    account_lastname: req.session.accountLastName,
    account_email: req.session.accountEmail
  }

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    messages: req.flash("notice"),
    errors: []
  })
}

/* ****************************************
 *  Processing Update Account Info (name & email)
 **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  try {
    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      req.session.accountFirstName = account_firstname
      req.session.accountLastName = account_lastname
      req.session.accountEmail = account_email

      req.flash("notice", "Account information updated successfully.")
      res.redirect("/account/dashboard")
    } else {
      req.flash("notice", "Update failed. Try again.")
      res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: { account_firstname, account_lastname, account_email },
        messages: req.flash("notice"),
        errors: []
      })
    }
  } catch (error) {
    console.error("❌ updateAccount error:", error)
    req.flash("notice", "An unexpected error occurred.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_firstname, account_lastname, account_email },
      messages: req.flash("notice"),
      errors: []
    })
  }
}


/* ****************************************
 *  Processin Update Password
 **************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updateAccountPassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/dashboard")
    } else {
      req.flash("notice", "Password update failed.")
      res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: {
          account_firstname: req.session.accountFirstName,
          account_lastname: req.session.accountLastName,
          account_email: req.session.accountEmail
        },
        messages: req.flash("notice"),
        errors: []
      })
    }
  } catch (error) {
    console.error("❌ updatePassword error:", error)
    req.flash("notice", "An unexpected error occurred.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: {
        account_firstname: req.session.accountFirstName,
        account_lastname: req.session.accountLastName,
        account_email: req.session.accountEmail
      },
      messages: req.flash("notice"),
      errors: []
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logoutAccount,
  buildDashboard,
  buildUpdateForm,
  updateAccount,
  updatePassword
}
