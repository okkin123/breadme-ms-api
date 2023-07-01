const express = require("express")  
const router = express.Router()

const controller = require("../controllers/user.controller")

router.route("/").get(controller.getAllUsers);
router.route("/authUser").post(controller.authUser);
router.route("/getUser").post(controller.getUser);

module.exports = router;