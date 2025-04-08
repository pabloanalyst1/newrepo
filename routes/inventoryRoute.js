const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// 2 display vehicles by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

// 2 display details for a specific vehicle 
router.get("/detail/:invId", invController.buildByInventoryId)

module.exports = router
