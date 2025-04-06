const { Pool } = require("pg")
require("dotenv").config()

let pool

// SSL always required in production, optional in dev
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Render requires SSL too
    }
  })
}

// Export query helper for both environments
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("query error", { text, error })
      throw error
    }
  }
}
