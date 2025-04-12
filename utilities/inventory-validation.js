const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

const invValidate = {}

/**
 * Validation rules for classification form
 */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha()
      .withMessage("Classification name must contain only letters.")
  ]
}

/**
 * Validation handler for classification form
 */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name
    })
    return
  }
  next()
}

/**
 * Validation rules for vehicle form
 */
invValidate.vehicleRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide a full-size image path."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail image path."),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide mileage as a number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color."),
    body("classification_id")
      .isInt()
      .withMessage("Please select a valid classification.")
  ]
}

/**
 * Validation handler for vehicle form
 */
invValidate.checkVehicleData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList: classificationSelect,
      errors: errors.array(),
      ...req.body
    })
    return
  }
  next()
}

module.exports = invValidate
