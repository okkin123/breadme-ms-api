const conn = require("../config/db.config");

module.exports = {
  getEmployeeRider: (req, res) => {
    conn.query(
      "SELECT * FROM tbl_employees WHERE role=? AND hasOrders=?",
      ["Rider", false],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  getOrderDatesByPiece: (req, res) => {
    conn.query(
      "SELECT * FROM tbl_order_piece_dates ORDER BY date DESC",
      function (err, data, fields) {
        if (err) {
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  insertOrderPieceDate: (req, res) => {
    const orderByPieceDate = req.body.orderByPieceDate;
    conn.query(
      "INSERT INTO tbl_order_piece_dates(date) VALUES(?)",
      [orderByPieceDate],
      function (err, data, fields) {
        if (err) {
          res.send({
            status: "Error",
            message: "Date is already created!",
          });
        } else {
          res.status(201).json({
            status: "Success",
            message: "New date created for order by piece!",
          });
        }
      }
    );
  },
  deleteOrderByPieceDate: (req, res) => {
    const orderPieceDateID = req.params.orderPieceDateID;
    conn.query(
      "DELETE FROM tbl_order_piece_dates WHERE order_piece_date_id=?",
      [orderPieceDateID],
      function (err, data, fields) {
        if (err) {
          res.send(err);
        } else {
          res.status(201).json({
            status: "Success",
            message: "Order date deleted!",
          });
        }
      }
    );
  },
  getProductStocks: (req, res) => {
    const unitID = req.body.unitID;
    const inventoryDate = req.body.inventoryDate;

    conn.query(
      "SELECT *, (SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM vw_stock_balance b) AS total_old_stock," +
        "(SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM vw_stock_balance b) + a.total_stock_balance AS running_stock_balance FROM vw_stock_balance a" +
        " WHERE unit_id=? AND date=?",
      [unitID, inventoryDate],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  insertOrderByRider: (req, res) => {
    const orderByPieceData = req.body.products;
    const unitID = req.body.unitID;
    let orderDateTable;

    if (unitID === 1) {
      orderDateTable = "tbl_order_piece_dates";
    } else {
      orderDateTable = "tbl_order_pack_dates";
    }

    conn.query(
      "INSERT INTO tbl_stock_out(date, employee_id, commission, category_id, qty, price_per_pc, price_per_pack, unit_id) VALUES ?",
      [
        orderByPieceData
          .filter((orderByPiece) => parseInt(orderByPiece.qty) !== 0)
          .filter((orderByPiece) => orderByPiece.qty !== "")
          .map((orderByPiece) => [
            orderByPiece.date,
            orderByPiece.rider_id,
            orderByPiece.commission,
            orderByPiece.category_id,
            Number(orderByPiece.qty),
            orderByPiece.price_per_pc,
            orderByPiece.price_per_pack,
            orderByPiece.unit_id,
          ]),
      ],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          conn.query(
            "UPDATE " + orderDateTable + " SET isSubmitted=? WHERE date=?",
            [true, req.body.orderDate],
            function (err, data, fields) {
              if (err) {
                console.log(Error);
              } else {
                conn.query(
                  "UPDATE tbl_employees SET hasOrders=? WHERE employee_id=?",
                  [true, req.body.riderID],
                  function (err, data, fields) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.status(201).json({
                        status: "Success",
                        message: "New Order Created!",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  },
  getOrderPieceRider: (req, res) => {
    const orderDate = req.body.orderDate;
    const hasOrders = req.body.hasOrders;
    const unitID = req.body.unitID;

    conn.query(
      "SELECT * FROM vw_stock_out WHERE date=? AND hasOrders=? AND unit_id=? GROUP BY employee_id",
      [orderDate, hasOrders, unitID],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  getOrderPieceRiderByDate: (req, res) => {
    const orderDate = req.body.orderDate;
    const riderID = req.body.riderID;
    const unitID = req.body.unitID;
    conn.query(
      "SELECT * FROM vw_stock_out WHERE date=? AND employee_id=? AND qty!=0 AND unit_id=? AND isClosed=?",
      [orderDate, riderID, unitID, false],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  insertOrderSaleByPiece: (req, res) => {
    const orderSaleData = req.body.products;
    const orderDiscounts = req.body.discounts;

    conn.query(
      "INSERT INTO tbl_sold_orders(date, employee_id, commission, category_id, price_per_pc, price_per_pack, order_qty, balance_qty, sold_qty, subtotal, unit_id)" +
        " VALUES ?",
      [
        orderSaleData.map((orderSales) => [
          orderSales.order_date,
          orderSales.employee_id,
          orderSales.commission,
          orderSales.category_id,
          orderSales.price_per_pc,
          orderSales.price_per_pack,
          orderSales.qty,
          Number(orderSales.balance),
          orderSales.sold,
          orderSales.subtotal,
          orderSales.unit_id,
        ]),
      ],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          if (req.body.unitID === 2) {
            conn.query(
              "INSERT INTO tbl_old_stock(date, employee_id, category_id, qty, price_per_pc, unit_id) VALUES ?",
              [
                orderSaleData
                  .filter((orderSales) => Number(orderSales.old_stock) !== 0)
                  .map((orderSales) => [
                    orderSales.order_date,
                    orderSales.employee_id,
                    orderSales.category_id,
                    Number(orderSales.old_stock),
                    orderSales.price_per_pc,
                    orderSales.unit_id,
                  ]),
              ],
              function (err, data, fields) {
                if (err) {
                  console.log(err);
                }
              }
            );

            if (orderDiscounts.length > 0) {
              conn.query(
                "INSERT INTO tbl_order_discounts(date, employee_id, category_id, qty, price, unit_id) VALUES ?",
                [
                  orderDiscounts.map((orderDiscount) => [
                    orderDiscount.date,
                    orderDiscount.employee_id,
                    orderDiscount.category_id,
                    Number(orderDiscount.qty),
                    orderDiscount.price,
                    orderDiscount.unit_id,
                  ]),
                ],
                function (err, data, fields) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          }

          conn.query(
            "UPDATE tbl_employees SET hasOrders=? WHERE employee_id=?",
            [false, req.body.riderID],
            function (err, data, fields) {
              if (err) {
                console.log(err);
              } else {
                conn.query(
                  "INSERT tbl_close_order(stock_out_id, isClosed) VALUES ?",
                  [
                    orderSaleData.map((orderSales) => [
                      orderSales.stock_out_id,
                      true,
                    ]),
                  ],
                  function (err, data, fields) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.status(201).json({
                        status: "Success",
                        message: "New order has been transact!.",
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  },
  getSoldOrdersPieceByDate: (req, res) => {
    const orderDate = req.body.orderDate;
    let riderID;
    const orderUnitID = req.body.orderUnitID;
    if (req.body.riderID === undefined) {
      riderID = "";
    } else {
      riderID = req.body.riderID;
    }
    conn.query(
      "SELECT * FROM vw_sold_orders WHERE date=? AND employee_id LIKE ? AND unit_id=?",
      [orderDate, "%" + riderID + "%", orderUnitID],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  getTotalSoldOrdersByDate: (req, res) => {
    const orderDate = req.body.orderDate;
    const orderUnitID = req.body.orderUnitID;
    conn.query(
      "SELECT * FROM vw_total_sold_orders WHERE date=? AND unit_id=?",
      [orderDate, orderUnitID],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  closePieceOrder: (req, res) => {
    const orderDate = req.body.orderDate;
    const unitID = req.body.unitID;

    if (unitID === 1) {
      query = "UPDATE tbl_order_piece_dates SET isClosed=? WHERE date=?";
    } else {
      query = "UPDATE tbl_order_pack_dates SET isClosed=? WHERE date=?";
    }

    conn.query(query, [true, orderDate], function (err, data, fields) {
      if (err) {
        console.log(err);
      } else {
        res.status(201).json({
          status: "Success",
          message: "The selected order has been closed.",
        });
      }
    });
  },
  insertOrderPackDate: (req, res) => {
    const orderPackDate = req.body.orderPackDate;
    conn.query(
      "INSERT INTO tbl_order_pack_dates(date) VALUES(?)",
      [orderPackDate],
      function (err, data, fields) {
        if (err) {
          console.log(err);
          res.send({
            status: "Error",
            message: "Date is already created!",
          });
        } else {
          res.status(201).json({
            status: "Success",
            message: "New date created for order by packs!",
          });
        }
      }
    );
  },
  getOrderDatesByPack: (req, res) => {
    conn.query(
      "SELECT * FROM tbl_order_pack_dates ORDER BY date DESC",
      function (err, data, fields) {
        if (err) {
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
  deleteOrderByPackDate: (req, res) => {
    const orderPackDateID = req.params.orderPackDateID;
    conn.query(
      "DELETE FROM tbl_order_pack_dates WHERE order_pack_date_id=?",
      [orderPackDateID],
      function (err, data, fields) {
        if (err) {
          res.send(err);
        } else {
          res.status(201).json({
            status: "Success",
            message: "Order date deleted!",
          });
        }
      }
    );
  },
  getPendingOrders: (req, res) => {
    const orderDate = req.body.orderDate;
    const unitID = req.body.unitID;
    conn.query(
      "SELECT * FROM vw_stock_out WHERE date=? AND unit_id=?",
      [orderDate, unitID],
      function (err, data, fields) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
          });
        }
      }
    );
  },
};
