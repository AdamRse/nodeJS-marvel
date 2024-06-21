// Importer le module MySQL
const mysql = require("mysql");

var connection = mysql.createConnection({
    host     : '5.39.77.77',
    user     : 'tp-marvel',
    password : '0LZ_vIA4GJUSCnu/',
    database : 'tp-marvel'
});

connection.connect();

module.exports = connection;