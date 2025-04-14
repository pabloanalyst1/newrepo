/* ******************************************
 * server.js – Controla el ciclo completo del servidor
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require('./database/')
const env = require("dotenv").config()

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const static = require("./routes/static")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Not at views root
app.use(express.urlencoded({ extended: true })) // To handle form data
app.use(express.static("public")) // Serve static files

/* ***********************
 * Session & Flash Middleware (en orden correcto)
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// To have session data available to all views
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

const flash = require("connect-flash")
const messages = require("express-messages")

app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = messages(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// Simulated error route
app.get("/cause-error", (req, res, next) => {
  throw new Error("This is a simulated error.")
})

// 404 handler – must be last
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Server Start
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`✅ app listening on ${host}:${port}`) //Así lo miro más bonito //
})
