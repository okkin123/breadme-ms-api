const mysql = require("mysql")
const DBConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'breadme'
});

DBConnection.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('MySql Connected...');
});

module.exports = DBConnection;