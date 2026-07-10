const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: '', 
    database: 'bicicletas',   
    waitForConnections: true,
    connectionLimit: 10,    
    queueLimit: 0
});

const promisePool = pool.promise();

console.log('Configurado');

module.exports = promisePool;