const conn = require("../config/db.config") 
const chartTheme = require("../config/chartTheme.json")

module.exports = {
    getCashFlow: (req, res) =>
    {
        conn.query("SELECT * FROM vw_cash_flow AS a WHERE date=(SELECT MAX(date) FROM vw_cash_flow AS b)",
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
                    data: data
                  });
            }
        })
    },
    chartsTheme: (req, res) => 
    {
        res.status(200).json(chartTheme)
        
    },
    getInventory: (req, res) => {
    
        conn.query("SELECT *, (SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM breadme.vw_stock_balance b) AS total_old_stock,"+
        "(SELECT SUM(IF(b.date < a.date and b.unit_id = a.unit_id and b.category_id = a.category_id, total_stock_balance, 0)) FROM breadme.vw_stock_balance b) + a.total_stock_balance AS running_stock_balance FROM breadme.vw_stock_balance a"+
        " WHERE date=(SELECT MAX(date) FROM vw_stock_balance) ORDER BY unit_id",
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
}