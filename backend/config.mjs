import mysql from 'mysql2'

var pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:null,
    database:'Reading_Log'

}).promise()

 
export default pool


 