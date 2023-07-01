const express = require("express")  
const router = express.Router()

const controller = require("../controllers/product.controller")

router.route("/getAllProducts").post(controller.getAllProducts)

module.exports = router;