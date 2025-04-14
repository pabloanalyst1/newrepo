const utilities = require("../utilities/")

async function buildHome(req, res) {
  const nav = await utilities.getNav()
  const message = req.flash("notice") // Captura una sola vez el flash
  res.render("index", {
    title: "Home",
    nav,
    message,
    session: req.session // Para el nombre en el header
  })
}

module.exports = { buildHome }
