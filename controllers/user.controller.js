const conn = require("../config/db.config") 

module.exports = {
    getAllUsers: (req, res) => 
    {
        conn.query("SELECT * FROM tbl_users", function (err, data, fields) {
            if(err) return next(new AppError(err))
            res.status(200).json({
              status: "success",
              length: data?.length,
              data: data,
            });
          });
    },
    authUser: (req, res) =>
    {
      const username = req.body.username;
      const password = req.body.password;

      conn.query("SELECT * FROM tbl_users WHERE username=? AND password=?"
      ,[username, password], function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      });
    },
    getUser: (req, res) => {
      const token = req.body.token
      conn.query("SELECT * FROM tbl_users WHERE token=?"
      ,[token], function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      });
    }
   
};

