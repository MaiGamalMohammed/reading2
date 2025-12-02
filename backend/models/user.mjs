import mysql from 'mysql2'
import pool from '../config.mjs'
 


export async function addUser(data) {
  let userExist = await getUser(data.email)
  if(userExist) return {error:"عذرًا، لا يمكننا إنشاء هذا الحساب"}

  else{
  let query = "insert into user(email,name,password) values(?,?,?)";
  let resullt = await pool.execute(query,[data.email,data.name,data.password])
  if(resullt[0].affectedRows==1) return {message:"تم إنشاء الحساب بنجاح"}
   
  }
  return {error:"حدث خطأ ما، حاول مرة أخرى لاحقًا"}
}

export async function getUser(email) {
  let query = "select * from user where email = ?"
  let [rows] = await pool.execute(query,[email])
  if(rows.length==0) return 0
  return rows 
}
