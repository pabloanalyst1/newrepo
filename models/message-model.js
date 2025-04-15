const pool = require("../database")

/* ===========================
 * Get messages by account_id
 * =========================== */
async function getMessagesByAccountId(account_id) {
  try {
    const sql = `
      SELECT m.message_id, m.message_subject, m.message_body, m.message_created,
             a.account_firstname || ' ' || a.account_lastname AS sender_name
      FROM message m
      JOIN account a ON m.message_from = a.account_id
      WHERE m.message_to = $1
      ORDER BY m.message_created DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getMessagesByAccountId error:", error)
    return []
  }
}

/* ===========================
 * Get a single message by ID
 * =========================== */
async function getMessageById(message_id) {
  try {
    const sql = `
      SELECT m.*, 
             a.account_firstname || ' ' || a.account_lastname AS sender_name
      FROM message m
      JOIN account a ON m.message_from = a.account_id
      WHERE m.message_id = $1
    `
    const result = await pool.query(sql, [message_id])
    return result.rows[0]
  } catch (error) {
    console.error("getMessageById error:", error)
    return null
  }
}

/* ===========================
 * Send a new message
 * =========================== */
async function sendMessage(message) {
  try {
    const { message_subject, message_body, message_from, message_to } = message
    const sql = `
      INSERT INTO message (message_subject, message_body, message_from, message_to)
      VALUES ($1, $2, $3, $4)
      RETURNING message_id
    `
    const result = await pool.query(sql, [
      message_subject,
      message_body,
      message_from,
      message_to
    ])
    return result.rowCount > 0
  } catch (error) {
    console.error("sendMessage error:", error)
    return false
  }
}

/* ===========================
 * Mark message as read
 * =========================== */
async function markAsRead(message_id) {
  try {
    const sql = `UPDATE message SET message_read = true WHERE message_id = $1`
    await pool.query(sql, [message_id])
  } catch (error) {
    console.error("markAsRead error:", error)
  }
}

/* ===========================
 * Delete message by ID
 * =========================== */
async function deleteMessage(message_id) {
  try {
    const sql = `DELETE FROM message WHERE message_id = $1`
    const result = await pool.query(sql, [message_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteMessage error:", error)
    return false
  }
}

/* ==============================
 * Get all accounts except current
 ============================== */
async function getAllAccountsExcept(accountId) {
    try {
      const sql = `
        SELECT account_id, account_firstname, account_lastname
        FROM account
        WHERE account_id != $1
        ORDER BY account_firstname
      `
      const result = await pool.query(sql, [accountId])
      return result.rows
    } catch (error) {
      console.error("getAllAccountsExcept error:", error)
      return []
    }
  }
  

module.exports = {
  getMessagesByAccountId,
  getMessageById,
  sendMessage,
  markAsRead,
  deleteMessage,
  getAllAccountsExcept
}
