const mysql = require("mysql")
const DBConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'breadme'
});

//mysql://b71dca3b8ebba6:b512a057@us-cdbr-east-06.cleardb.net/heroku_d6d74deb2a9e65d?reconnect=true

DBConnection.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('MySql Connected...');
});

module.exports = DBConnection;