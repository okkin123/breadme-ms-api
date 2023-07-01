const conn = require("../config/db.config") 
module.exports = {
    getAllProducts: (req, res)=>
    {
        const unit = req.body.unit;
        conn.query("SELECT * FROM vw_products WHERE unit=?", 
        [unit],
        function (err, data, fields){
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
