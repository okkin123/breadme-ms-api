const mysql = require("mysql")
const DBConnection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'b71dca3b8ebba6',
  password: 'b512a057',
  database: 'heroku_d6d74deb2a9e65d'
});

//mysql://b71dca3b8ebba6:b512a057@us-cdbr-east-06.cleardb.net/heroku_d6d74deb2a9e65d?reconnect=true

DBConnection.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('MySql Connected...');
});

module.exports = DBConnection;