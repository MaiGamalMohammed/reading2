import mysql from 'mysql2'
import pool from '../config.mjs'

export async function getQuotes(book_id) {
    let query = "select * from quote where book_id=?"
    try {
        let result = await pool.execute(query,[book_id])
        return {data:result[0],code:200}
    } catch (error) {
        return {message:"something went wrong",code:500}
    }
}

export async function addQuote(data) {
    let query = "insert into quote(text,comment,page_number,book_id) values(?,?,?,?)"

    try {
      let result = await pool.execute(query,[data.text,data.comment,data.page_number,data.book_id])
      if(result[0].affectedRows==1) return {message:"created",code:201}
    } catch (error) {
        return {message:"something went wrong",code:500}
    }
}


export async function updateQuote(data) {
    let query = `update quote set page_number=?,text=?,comment=? where id=?`
    
    let result = await pool.execute(query,[data.page_number,data.text,data.comment,data.id])
    if(result[0].affectedRows == 1) return {message:"updated",code:200}
    else return {message:"something went wrong",code:500}
}

export async function deleteQuote(data) {
    let query = "delete from quote where id= ?"
    let result = await pool.execute(query,[data.id])
    if(result[0].affectedRows == 1) return {message:"deleted",code:200}
    else return {message:"something went wrong",code:500}
}