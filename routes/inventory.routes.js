const express = require("express")  
const router = express.Router()

const controller = require("../controllers/inventory.controller")

router.route("/getInventoryDates").get(controller.getInventoryDates);
router.route("/insertInventoryDate").post(controller.insertInventoryDate);
router.route("/insertInventory").post(controller.insertInventory);
router.route("/getInventoryPieceByDate").post(controller.getInventoryPieceByDate);
router.route("/submitInventoryPieceByDate").post(controller.submitInventoryPieceByDate);
router.route("/deleteInventoryDate/:inventoryDateID").delete(controller.deleteInventoryDate);
router.route("/exportInventoryToPacks").post(controller.exportInventoryToPacks);
router.route("/pullOutStocks").post(controller.pullOutStocks);
router.route("/getCategories").get(controller.getCategories);
router.route("/getPulledOutStocks").post(controller.getPulledOutStocks);
router.route("/getStockInProducts").post(controller.getStockInProducts);
module.exports = router;