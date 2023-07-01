const conn = require("../config/db.config") 

module.exports = {
    insertInventoryDate: (req, res)=>
    {
        const inventoryDate = req.body.inventoryDate;
        conn.query("INSERT INTO tbl_inventory_dates(date) VALUES(?)", 
        [inventoryDate],
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
              message: "New date created for inventory!"
              });
            }
        })
    },
    deleteInventoryDate: (req, res) =>
    {
      const inventoryDateID = req.params.inventoryDateID;
      conn.query(
        "DELETE FROM tbl_inventory_dates WHERE inventory_date_id=?",
        [inventoryDateID],
        function (err, data, fields) {
          if(err)
          {
            res.send(err);
          }
          else
          {
            res.status(201).json({
            status: "Success",
            message: "Inventory date deleted!"
            });
          }
      }
      )
    },
    getInventoryDates: (req, res)=>
    {

        conn.query("SELECT * FROM vw_inventory_dates ORDER BY date DESC", 
        function(err, data, fields){
            if(err){
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
    insertInventory: (req, res) => {
      const inventoryPieceData = req.body.products;
      const inventoryDate = req.body.inventoryDate;
      const unitID = req.body.unitID;
      conn.query("INSERT INTO tbl_stock_in(date, category_id, product_id, qty, price_per_pc, price_per_pack, unit_id) VALUES ?", 
      [inventoryPieceData
        .map((inventoryPiece)=>[inventoryPiece.date, inventoryPiece.category_id, inventoryPiece.product_id, inventoryPiece.qty, inventoryPiece.price_per_pc, inventoryPiece.price_per_pack, unitID])],
      function (err, data, fields) {  
          if(err)
          {
            console.log(err)
          }
          else
          {
            if(unitID === 2)
            {
              conn.query("INSERT INTO tbl_stocks_to_pack(date, category_id, qty, unit_id) VALUES ?", 
              [inventoryPieceData
                .filter((inventoryPiece)=>parseInt(inventoryPiece.qty) !== 0)
                .filter(inventoryPiece => inventoryPiece.qty !== '')
                .filter(inventoryPiece => inventoryPiece.isApplicable === true)
                .map((inventoryPiece)=>[inventoryPiece.date, inventoryPiece.category_id, (Number(inventoryPiece.qty) * 5), 1])],
                function(err, data, fields){
                  if(err)
                  {
                    console.log(err)
                  }
                  else
                  {
                    conn.query("UPDATE tbl_inventory_dates SET isPackMade=? WHERE date=?",
                    [true, inventoryDate],
                    function (err, data, fields) {
                      if(err)
                      {
                        res.send(err);
                      }
                      else
                      {
                        res.status(201).json({
                          status: "Success",
                          message: "New product inventory created!"
                          });
                      }
                    })
                  }
                })
            }
            else
            {
              conn.query("UPDATE tbl_inventory_dates SET isSubmitted=? WHERE date=?",
              [true, inventoryDate],
              function (err, data, fields) {
                if(err)
                {
                  res.send(err);
                }
                else
                {
                  res.status(201).json({
                    status: "Success",
                    message: "New product inventory created!"
                    });
                }
              })
            }

          }
       }
      )
    },
    getInventoryPieceByDate: (req, res) => {
      
      const inventoryPieceDate = req.body.inventoryPieceDate;
      const unitID = req.body.unit_id;
      const categories = req.body.categories;
      
      let joinedValues;
      if (categories.length === 0) {
        joinedValues = "'%%'";
      } else {
        joinedValues = categories
          .map(category => "'%" + category.id + "%'")
          .join(" OR category_id LIKE ");
      }
      //"SELECT * FROM vw_stock_balance WHERE date=? and unit_id=? and category_id LIKE "+joinedValues+""
      conn.query("SELECT *, (SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM breadme.vw_stock_balance b) AS total_old_stock,"+
      "(SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM breadme.vw_stock_balance b) + a.total_stock_balance AS running_stock_balance FROM breadme.vw_stock_balance a"+
      " WHERE date=? and unit_id=? and category_id LIKE "+joinedValues+"",
        [inventoryPieceDate, unitID],
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
    
    submitInventoryPieceByDate: (req, res) => {
      const inventoryPieceDate = req.body.inventoryPieceDate;

      conn.query("UPDATE tbl_inventory_dates SET isExported=? WHERE date=?",
      [true, inventoryPieceDate],
      function (err, data, fields) {
        if(err)
        {
          res.send(err);
        }
        else
        {
          res.status(201).json({
          status: "Success",
          message: "Inventory date "+inventoryPieceDate+" is exported!"
          });
        }
      })
    },
    exportInventoryToPacks: (req, res) => {
      const inventoryPieceData = req.body.products;
      const inventoryPieceDate = req.body.inventoryPieceDate;
      conn.query("INSERT INTO tbl_stocks_to_pack(date, product_id, qty, unit_id) VALUES ?", 
      [inventoryPieceData
        .filter(inventoryPiece =>inventoryPiece.selected === true)
        .filter(inventoryPiece =>inventoryPiece.stock_balance !== 0)
        .map((inventoryPiece)=>[inventoryPiece.date, inventoryPiece.product_id, inventoryPiece.stock_balance - (inventoryPiece.stock_balance%5), inventoryPiece.unit_id])],
      function (err, data, fields) {
          if(err)
          {
            console.log(err)
          }
          else
          {
            conn.query("INSERT INTO tbl_stock_in(date, category_id, product_id, qty, price, unit_id) VALUES ?", 
            [inventoryPieceData
              .filter(inventoryPiece =>inventoryPiece.selected === true)
              .filter(inventoryPiece =>inventoryPiece.stock_balance !== 0)
              .map((inventoryPiece)=>[inventoryPiece.date, inventoryPiece.category_id, inventoryPiece.product_id, (Math.floor(inventoryPiece.stock_balance/5)), (inventoryPiece.price*5), 2])],
            function (err, data, fields) {
              if(err)
              {
                console.log(err)
              }
              else
              {
                conn.query("UPDATE tbl_inventory_dates SET isExported=? WHERE date=?",
                [true, inventoryPieceDate],
                function (err, data, fields) {
                  if(err)
                  {
                    console.log(err)
                  }
                  else
                  {
                    res.status(201).json({
                      status: "Success",
                      message: "Product exported to inventory packs!"
                    });
                  }
                })

              }
            })
    
          }
       }
      )
    },
    pullOutStocks: (req, res)=>
    {
      const stocksData = req.body.products;
      const comments = req.body.comments;

      conn.query("INSERT INTO tbl_pulled_out_stocks(date, category_id, qty, unit_id, comments) VALUES ?", 
      [stocksData
        .filter(stocks => parseInt(stocks.qty) !== 0)
        .filter(stocks => stocks.qty !== '')
        .map((stocks)=>[stocks.date, stocks.category_id, stocks.qty, stocks.unit_id, comments])],
      function (err, data, fields) {
          if(err)
          {
            console.log(err)
          }
          else
          {
            res.status(201).json({
              status: "Success",
              message: "Pulled out successfully!"
            });
          }
       }
      )
    },
    getCategories: (req, res) =>
    {
     
      conn.query("SELECT category_id, category FROM vw_stock_balance GROUP BY category_id",
      function(err, data, fields)
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
    getPulledOutStocks: (req, res)=>
    {
      const inventoryDate = req.body.inventoryDate;
      const unitID = req.body.unitID;
      conn.query("SELECT * FROM vw_pulled_out_stocks WHERE date=? and unit_id=?",[inventoryDate, unitID],
      function(err, data, fields)
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
    getStockInProducts: (req, res)=>
    {
      const inventoryDate = req.body.inventoryDate;
      const unitID = req.body.unitID;

      conn.query("SELECT * FROM vw_stock_in_products WHERE date=? AND unit_id=?",[inventoryDate, unitID],
      function(err, data, fields)
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
    }
    

}