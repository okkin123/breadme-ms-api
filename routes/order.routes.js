const express = require("express")  
const router = express.Router()

const controller = require("../controllers/order.controller")

router.route("/getEmployeeRider").get(controller.getEmployeeRider);
router.route("/getProductStocks").post(controller.getProductStocks);
router.route("/insertOrderByRider").post(controller.insertOrderByRider);

router.route("/getOrderDatesByPiece").get(controller.getOrderDatesByPiece);
router.route("/insertOrderPieceDate").post(controller.insertOrderPieceDate);
router.route("/deleteOrderByPieceDate/:orderPieceDateID").delete(controller.deleteOrderByPieceDate);
router.route("/getOrderPieceRider").post(controller.getOrderPieceRider);
router.route("/getOrderPieceRiderByDate").post(controller.getOrderPieceRiderByDate);
router.route("/insertOrderSaleByPiece").post(controller.insertOrderSaleByPiece);
router.route("/getSoldOrdersPieceByDate").post(controller.getSoldOrdersPieceByDate);
router.route("/closePieceOrder").post(controller.closePieceOrder);

router.route("/insertOrderPackDate").post(controller.insertOrderPackDate);
router.route("/getOrderDatesByPack").get(controller.getOrderDatesByPack);
router.route("/deleteOrderByPackDate/:orderPackDateID").delete(controller.deleteOrderByPackDate);
router.route("/getTotalSoldOrdersByDate").post(controller.getTotalSoldOrdersByDate);
router.route("/getPendingOrders").post(controller.getPendingOrders);

module.exports = router;