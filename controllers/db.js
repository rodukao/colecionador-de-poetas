var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 10,
    host    : process.env.hostColecionador,
    user    : process.env.userColecionador,
    password: process.env.passwordColecionador,
    database: process.env.databaseColecionador
});

module.exports = connection;