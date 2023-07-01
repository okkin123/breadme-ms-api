const conn = require("../config/db.config") 
const Employee = require("../models/employee.model");

module.exports = {
    getAllEmployees: (req, res) =>
    {
        conn.query("SELECT * FROM tbl_employees WHERE role!='Rider'", function (err, data, fields) {
            if(err) return next(new AppError(err))
            res.status(200).json({
              status: "success",
              length: data?.length,
              data: data,
            });
          });
    },
    getAllAttendanceDate: (req, res) =>
    {
      conn.query("SELECT * FROM tbl_attendance_dates ORDER BY date DESC", function (err, data, fields) {
        if(err){

        }
        else{
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
     
      });
    },
    getAttendanceByDate: (req, res) =>
    {
        const attendanceDate = req.body.attendanceDate;
   
        conn.query("SELECT * FROM vw_attendance_details WHERE date=?",
        [attendanceDate], function (err, data, fields) {
          if(err) return next(new AppError(err))
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        });
    },
    insertAttendanceDate: (req, res)=>
    {
        const attendanceDate = req.body.attendanceDate;
        conn.query("INSERT INTO tbl_attendance_dates(date) VALUES(?)", 
        [attendanceDate],
        function (err, data, fields) {
            if(err)
            {
              res.send({
                status: "Error",
                message: "Date is already created!"
              })
            }
            else
            {
              res.status(201).json({
              status: "Success",
              message: "New date created for attendance!"
              });
            }
        })
    },
    deleteAttendanceDate: (req, res) =>
    {
      const attendanceDateID = req.params.attendanceDateID;
      conn.query(
        "DELETE FROM tbl_attendance_dates WHERE attendance_date_id=?",
        [attendanceDateID],
        function (err, data, fields) {
          if(err)
          {
            res.send(err);
          }
          else
          {
            res.status(201).json({
            status: "Success",
            message: "Attendance date deleted!"
            });
          }
      }
      )
    },
    insertAttendance: (req, res) =>
    {
      const attendanceData = req.body.employees;
      const attendanceDate = req.body.attendanceDate;
      console.log(attendanceDate)
      conn.query(
        "INSERT INTO tbl_attendance (employee_id, date, isPresent, isHalfDay) VALUES ?",
        [attendanceData.map(attendance=>[attendance.employee_id, attendance.date, attendance.isPresent, attendance.isHalfDay])],
        function (err, data, fields) {
            if(err)
            {
              console.log(err)
            }
            else
            {
              conn.query("UPDATE tbl_attendance_dates SET isExported=? WHERE date=?",
              [true, attendanceDate],
              function (err, data, fields) {
                if(err)
                {
                  res.send(err);
                }
                else
                {
                  res.status(201).json({
                    status: "Success",
                    message: "New attendance created!"
                   });
                }
              })

            }
        }
        );
    },
    getVoucherByDate: (req, res) =>
    {
        const voucherDate = req.body.voucherDate;
   
        conn.query("SELECT * FROM vw_voucher_details WHERE date=? AND amount!=0",
        [voucherDate], function (err, data, fields) {
          if(err) return next(new AppError(err))
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        });
    },
    insertVoucherDate: (req, res)=>
    {
      const voucherDate = req.body.voucherDate;
        conn.query("INSERT INTO tbl_voucher_dates(date) VALUES(?)", 
        [voucherDate],
        function (err, data, fields) {
            if(err)
            {
              res.send({
                status: "Error",
                message: "Date is already created!"
              })
            }
            else
            {
              res.status(201).json({
              status: "Success",
              message: "New date created for voucher!"
              });
            }
        })
    },
    deleteVoucherDate: (req, res) =>
    {
      const voucherDateID = req.params.voucherDateID;
      conn.query(
        "DELETE FROM tbl_voucher_dates WHERE voucher_date_id=?",
        [voucherDateID],
        function (err, data, fields) {
          if(err)
          {
            res.send(err);
          }
          else
          {
            res.status(201).json({
            status: "Success",
            message: "Voucher date deleted!"
            });
          }
      }
      )
    },
    insertVoucher: (req, res)=>{
      const voucherData = req.body;
      conn.query(
        "INSERT INTO tbl_vouchers (employee_id, date, amount) VALUES ?",
        [voucherData
          .filter(voucher => voucher.amount !== 0)
          .map(voucher=>[voucher.employee_id, voucher.date, voucher.amount])],
        function (err, data, fields) {
            if(err)
            {
              res.send(err);
            }
            else
            {
              res.status(201).json({
              status: "Success",
              message: "New voucher created!"
              });
            }
        }
        );
    },
    submitVoucherByDate: (req, res) => {
      const voucherDate = req.body.voucherDate;

      conn.query("UPDATE tbl_voucher_dates SET isSubmitted=? WHERE date=?",
      [true, voucherDate],
      function (err, data, fields) {
        if(err)
        {
          res.send(err);
        }
        else
        {
          res.status(201).json({
          status: "Success",
          message: "Voucher date "+voucherDate+" is submitted!"
          });
        }
      })
    },
    getAllVoucherDates: (req, res) =>
    {
      conn.query("SELECT * FROM tbl_voucher_dates ORDER BY date DESC", function (err, data, fields) {
        if(err){

        }
        else{
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
     
      });
    },
    getRiders: (req, res) =>
    {
        conn.query("SELECT * FROM tbl_employees WHERE role='Rider'", function (err, data, fields) {
            if(err) return next(new AppError(err))
            res.status(200).json({
              status: "success",
              length: data?.length,
              data: data,
            });
          });
    },
    getEmployeeAttendance: (req, res) =>
    {
      const employeeID = req.body.employeeID;
      const fromDate = req.body.fromDate;
      const toDate = req.body.toDate;

      conn.query("SELECT * FROM vw_attendance_for_payroll WHERE employee_id="+employeeID+" AND date BETWEEN CAST(? AS DATE) AND CAST(? AS DATE) ORDER BY date", 
      [fromDate, toDate],function(err, data, fields)
      {
        if(err)
        {
          console.log(err)
        }
        else
        {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      })
    },
    insertPayroll: (req, res) =>
    {
      const attendances = req.body.attendances;
      const employeeName = req.body.employeeName;
      conn.query("INSERT INTO tbl_payroll(employee_id, date, salary, voucher, isPresent, isHalfDay) VALUES ?",
      [attendances
        .filter(attendance=>attendance.isPaid === 0)
        .map((attendance)=>[attendance.employee_id, attendance.attendanceDate, attendance.salary, attendance.voucher, attendance.isPresent, attendance.isHalfDay    ])],
        function(err, data, fields)
        {
        if(err)
        {
          console.log(err)
        }
        else
        {
           res.status(201).json({
            status: "Success",
            message: "New Payroll for "+employeeName+" has been created!"
            });
        }
      })
    },
    getEmployeesForPayroll: (req, res) =>
    {
        conn.query("SELECT * FROM vw_employee_for_payroll", function (err, data, fields) {
            if(err) return next(new AppError(err))
            res.status(200).json({
              status: "success",
              length: data?.length,
              data: data,
            });
          });
    },
    getEmployeePayroll: (req, res) =>
    {
        const employeeID = req.body.employeeID;
        conn.query("SELECT * FROM vw_payroll WHERE employee_id=?", [employeeID], function (err, data, fields) {
            if(err)
            {
              console.log(err)
            }
            else
            {
              res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
              });
            }
 
          });
    }
}