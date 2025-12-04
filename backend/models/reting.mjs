import mysql from 'mysql2'
import pool from '../config.mjs'

export async function getRating(book_id) {
    let query = "select * from rating where book_id=?"
    try {
        let result = await pool.execute(query,[book_id])
        return {data:result[0],code:200}
    } catch (error) {
        return {message:"something went wrong",code:500}
    }
}

export async function addRating(data) {
    let query = "insert into rating(score,review,book_id) values(?,?,?)"

    try {
      let result = await pool.execute(query,[data.score,data.review,data.book_id])
      if(result[0].affectedRows==1) return {message:"created",code:201}
    } catch (error) {
        return {message:"something went wrong",code:500}
    }
}

export async function deleteRating(data) {
    let query = "delete from rating where id= ?"
    let result = await pool.execute(query,[data.id])
    if(result[0].affectedRows == 1) return {message:"deleted",code:200}
    else return {message:"something went wrong",code:500}
}