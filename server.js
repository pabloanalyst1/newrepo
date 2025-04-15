const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require('./database/')
const env = require("dotenv").config()

// Controllers y rutas
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const messageRoute = require("./routes/messageRoute")
const static = require("./routes/static")
const utilities = require("./utilities")

// View engine
app.set("view engine", "ejs")
app.set("layout", "./layouts/layout")
app.use(expressLayouts) 
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// Session + Flash + Messages
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

// Hacer datos de sesión disponibles a las vistas
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

const flash = require("connect-flash")
const messages = require("express-messages")

app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = messages(req, res)
  next()
})

// Rutas principales
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/messages", messageRoute) // la nueva para los messages

// Ruta simulada para errores
app.get("/cause-error", (req, res, next) => {
  throw new Error("This is a simulated error.")
})

// 404
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

// Error handler global
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

// Iniciar servidor
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`✅ app listening on ${host}:${port}`)
})
