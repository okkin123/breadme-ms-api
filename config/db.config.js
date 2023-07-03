const mysql = require("mysql")
const DBConnection = mysql.createConnection({
  host: 'bpsqtm8qvpkd7tcfmz2k-mysql.services.clever-cloud.com',
  user: 'uvyxlhkrsg6hwd0z',
  password: 'jRao7jWzOPQUOFYnlOGd',
  database: 'bpsqtm8qvpkd7tcfmz2k'
});

//mysql://b71dca3b8ebba6:b512a057@us-cdbr-east-06.cleardb.net/heroku_d6d74deb2a9e65d?reconnect=true

DBConnection.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('MySql Connected...');
});

module.exports = DBConnection;