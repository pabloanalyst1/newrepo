const pool = require("../database/")

/* ***************************
 *  Register new account
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

module.exports = { registerAccount }
