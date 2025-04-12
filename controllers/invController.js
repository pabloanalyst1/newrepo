const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ================================
 * Build inventory by classification view
 * ================================ */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

  if (!data || data.length === 0) {
    const nav = await utilities.getNav()
    return res.status(404).render("errors/error", {
      title: "Classification Not Found",
      message: "No vehicles found for this classification.",
      nav,
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: `${className} Vehicles`,
    nav,
    grid,
  })
}

/* ================================
 * Build vehicle detail view
 * ================================ */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)

  if (!data) {
    const nav = await utilities.getNav()
    return res.status(404).render("errors/error", {
      title: "Vehicle Not Found",
      message: "No vehicle found with that ID.",
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

/* ================================
 * Build inventory management view
 * ================================ */
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList: classificationSelect,
    messages: req.flash("notice")
  })
}

/* ================================
 * Build add classification form
 * ================================ */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
    errors: []
  })
}

/* ================================
 * Process add classification
 * ================================ */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added "${classification_name}" as a new classification.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash("notice"),
      errors: []
    })
  }
}

/* ================================
 * Build add inventory form
 * ================================ */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    messages: req.flash("notice"),
    errors: [],
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: ""
  })
}

/* ================================
 * Process add inventory (vehicle)
 * ================================ */
invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.addVehicle({
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  })

  if (result) {
    req.flash("notice", `Successfully added "${inv_make} ${inv_model}" to inventory.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages: req.flash("notice"),
      errors: [],
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
  }
}

/* ================================
 * Return Inventory by Classification in JSON
 * ================================ */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId)
  try {
    const inventoryData = await invModel.getInventoryByClassificationId(classification_id)
    return res.json(inventoryData)
  } catch (error) {
    console.error("getInventoryJSON error:", error)
    return res.status(500).json({ error: "Failed to fetch inventory data" })
  }
}

module.exports = invCont
