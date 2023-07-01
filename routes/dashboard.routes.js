const express = require("express")  
const router = express.Router()

const controller = require("../controllers/dashboard.controller")

router.route("/getCashFlow").get(controller.getCashFlow);
router.route("/chartsTheme").get(controller.chartsTheme);
router.route("/getInventory").get(controller.getInventory);
module.exports = router;