const pool = require("../database/")

/* ***************************
 *  Registerr new account
 * *************************** */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* ***************************
  *  Get account by email
* *************************** */

async function getAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* ****************************************
 * Change account info (name + email)
 **************************************** */
async function updateAccountInfo(accountId, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const result = await pool.query(sql, [firstname, lastname, email, accountId])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccountInfo error:", error)
    return null
  }
}

/* ****************************************
 * Change account password
 **************************************** */
async function updateAccountPassword(accountId, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
    `
    const result = await pool.query(sql, [hashedPassword, accountId])
    return result.rowCount === 1
  } catch (error) {
    console.error("updateAccountPassword error:", error)
    return false
  }
}

module.exports = { registerAccount, getAccountByEmail, updateAccountInfo, updateAccountPassword }
