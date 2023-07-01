const express = require("express")  
const router = express.Router()

const controller = require("../controllers/employee.controller")

router.route("/").get(controller.getAllEmployees);

router.route("/getAllAttendanceDate").get(controller.getAllAttendanceDate);
router.route("/getAttendanceByDate").post(controller.getAttendanceByDate);
router.route("/insertAttendance").post(controller.insertAttendance);
router.route("/insertAttendanceDate").post(controller.insertAttendanceDate);
router.route("/deleteAttendanceDate/:attendanceDateID").delete(controller.deleteAttendanceDate);

router.route("/getVoucherByDate").post(controller.getVoucherByDate);
router.route("/insertVoucher").post(controller.insertVoucher);
router.route("/insertVoucherDate").post(controller.insertVoucherDate);
router.route("/getAllVoucherDates").get(controller.getAllVoucherDates);
router.route("/submitVoucherByDate").post(controller.submitVoucherByDate);
router.route("/deleteVoucherDate/:voucherDateID").delete(controller.deleteVoucherDate);

router.route("/getRiders").get(controller.getRiders);

router.route("/getEmployeeAttendance").post(controller.getEmployeeAttendance);
router.route("/insertPayroll").post(controller.insertPayroll);
router.route("/getEmployeesForPayroll").get(controller.getEmployeesForPayroll);
router.route("/getEmployeePayroll").post(controller.getEmployeePayroll);

module.exports = router;