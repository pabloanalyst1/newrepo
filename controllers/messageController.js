const messageModel = require("../models/message-model")
const utilities = require("../utilities/")

/* Show inbox */
async function buildInbox(req, res) {
  const nav = await utilities.getNav()
  const accountId = req.session.accountId
  const messages = await messageModel.getMessagesByAccountId(accountId)

  res.render("message/inbox", {
    title: "Inbox",
    nav,
    messages,
    messagesExist: messages.length > 0,
    messagesCount: messages.length,
    errors: [],
  })
}

/* Show message detail */
async function buildMessageDetail(req, res) {
  const nav = await utilities.getNav()
  const messageId = parseInt(req.params.messageId)

  const message = await messageModel.getMessageById(messageId)
  await messageModel.markAsRead(messageId)

  if (!message) {
    req.flash("notice", "Message not found.")
    return res.redirect("/account/dashboard")
  }

  res.render("message/detail", {
    title: "Message Detail",
    nav,
    message,
    errors: [],
  })
}

/* Show form to write a new message */
async function buildComposeForm(req, res) {
  const nav = await utilities.getNav()

  res.render("message/compose", {
    title: "New Message",
    nav,
    recipients: [
      { account_id: 1, account_firstname: "Pablo", account_lastname: "Test" },
      { account_id: 2, account_firstname: "Chiquillo", account_lastname: "Demo" }
    ],
    errors: [],
    messages: [],
    subject: "",
    body: ""
  })
}



/* Handle send message POST */
async function sendMessage(req, res) {
  const nav = await utilities.getNav()
  const { message_to, subject, body } = req.body
  const message_from = req.session.accountId
  const recipients = await messageModel.getAllAccountsExcept(message_from)

  const result = await messageModel.sendMessage({
    message_subject: subject,
    message_body: body,
    message_from,
    message_to: parseInt(message_to)
  })

  if (result) {
    req.flash("notice", "Message sent successfully.")
    res.redirect("/messages")
  } else {
    req.flash("notice", "Message sending failed.")
    res.status(500).render("message/compose", {
      title: "New Message",
      nav,
      recipients,
      subject,
      body,
      errors: [],
      messages: req.flash("notice")
    })
  }
}

/* Handle delete message */
async function deleteMessage(req, res) {
  const messageId = parseInt(req.params.messageId)
  const success = await messageModel.deleteMessage(messageId)

  if (success) {
    req.flash("notice", "Message deleted successfully.")
  } else {
    req.flash("notice", "Failed to delete the message.")
  }

  res.redirect("/messages")
}

module.exports = {
  buildInbox,
  buildMessageDetail,
  buildComposeForm,
  sendMessage,
  deleteMessage,
}
