const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")
const messageModel = require("../models/message-model")

const messageValidate = {}

/* ****************************************
 * Validation rules for sending a message
 **************************************** */
messageValidate.sendMessageRules = () => {
  return [
    body("message_to")
      .isInt({ min: 1 })
      .withMessage("Please enter a valid recipient ID."),
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Subject is required."),
    body("body")
      .trim()
      .notEmpty()
      .withMessage("Message body cannot be empty.")
  ]
}

/* ****************************************
 * Middleware to check validation results
 **************************************** */
messageValidate.checkMessageData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    const accountId = req.session.accountId
    const recipients = await messageModel.getAllAccountsExcept(accountId)

    return res.status(400).render("message/compose", {
      title: "New Message",
      nav,
      messages: req.flash("notice"),
      errors: errors.array(),
      recipients,
      subject: req.body.subject,
      body: req.body.body
    })
  }

  next()
}

module.exports = messageValidate