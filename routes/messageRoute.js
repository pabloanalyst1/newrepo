const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const auth = require("../utilities/auth-middleware")
const validate = require("../utilities/message-validation")
const utilities = require("../utilities")


// Inbox view
router.get("/", auth.checkLogin, messageController.buildInbox)

// Compose message form
router.get("/compose", auth.checkLogin, messageController.buildComposeForm)

// Process sending message
router.post(
  "/compose",
  auth.checkLogin,
  validate.sendMessageRules(),
  validate.checkMessageData,
  messageController.sendMessage
)

// View specific message by ID
router.get("/detail/:messageId", auth.checkLogin, messageController.buildMessageDetail)

// Delete message
router.post("/delete/:messageId", auth.checkLogin, messageController.deleteMessage)

router.get("/testview", async (req, res) => {
  const nav = await utilities.getNav() // html del menú dinámico
  res.render("test", { title: "Test View", nav }) //ahora sí pasa nav
})

module.exports = router
