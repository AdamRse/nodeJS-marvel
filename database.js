// Importer le module MySQL
const mysql = require("mysql");
var connection = mysql.createConnection({
    host     : '5.39.77.77',
    user     : 'tp-marvel',
    password : '0LZ_vIA4GJUSCnu/',
    database : 'tp-marvel'
  });
   
  connection.connect();
   
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

module.exports = connection;