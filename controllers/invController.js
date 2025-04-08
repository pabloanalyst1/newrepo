const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Building inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

  if (!data || data.length === 0) {
    let nav = await utilities.getNav()
    return res.status(404).render("errors/error", {
      title: "Clasificación no encontrada",
      message: "No se encontraron vehículos para esta clasificación.",
      nav,
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)

  if (!data) {
    let nav = await utilities.getNav()
    return res.status(404).render("errors/error", {
      title: "Vehículo no encontrado",
      message: "No se encontró un vehículo con ese ID.",
      nav,
    })
  }

  const detail = await utilities.buildVehicleDetail(data)
  const nav = await utilities.getNav()
  const name = `${data.inv_year} ${data.inv_make} ${data.inv_model}`

  res.render("inventory/detail", {
    title: name,
    nav,
    detail,
  })
}

module.exports = invCont
