const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Inventory Management View
router.get("/", invController.buildManagementView)

// Form to Add New Classification
router.get("/add-classification", invController.buildAddClassification)

// Process New Classification
router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, invController.addClassification)

// Form to Add New Inventory
router.get("/add-inventory", invController.buildAddInventory)

// Process Add Inventory
router.post("/add-inventory", validate.vehicleRules(), validate.checkVehicleData, invController.addInventory)

// Display vehicles by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

// Display details for a specific vehicle
router.get("/detail/:invId", invController.buildByInventoryId)

//Gent JSON for inventory by classification_id
router.get("/getInventory/:classificationId", invController.getInventoryJSON)

module.exports = router
