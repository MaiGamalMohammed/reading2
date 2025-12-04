import mysql from 'mysql2'
import pool from '../config.mjs'

export async function getCategory() {
    let query = "select * from category"
    let resullt = await pool.execute(query)
    return resullt[0]
}

export async function addBook(data){
     
    let query = `insert into book(name,description,author,notes,publication_year,
     user_id, category_id,status,pages_total,pages_read,img
    ) values(?,?,?,?,?,?,?,?,?,?,?)`
    try {
        let result = await pool.execute(query,[data.name,data.description,data.author,data.notes,data.publication_year,data.user_id,data.category_id,data.status,data.pages_total,data.pages_read,data.img])
        if(result[0].affectedRows == 1) return {message:"added",code:201}
        else return {message:"لا نستطيع اضافة هذا الكتاب حاول مرة اخرى لاحقا",code:400}
    } catch (error) {
        console.log(error)
        return {message:"لا نستطيع اضافة هذا الكتاب حاول مرة اخرى لاحقا",code:500}
    }

}


export async function getBooks(userId){
    let query = "select * from book where user_id = ?"
    let res = await pool.execute(query,[userId])
    return res[0];
}

export async function updateBook(data) {
    let query = `update book set name=?,description=?,author=?,notes=?,publication_year=?,
      category_id=?,status=?,pages_total=?,pages_read=?,img=?
     where id=?`
    
    let result = await pool.execute(query,[data.name,data.description,data.author,data.notes,data.publication_year,data.category_id,data.status,data.pages_total,data.pages_read,data.img,data.id])
    if(result[0].affectedRows == 1) return {message:"updated"}
    else return {message:"لا يمكننا تعديل هذا الكتاب"}
}

export async function deleteBook(data) {
    let query = "delete from book where id= ?"
    let result = await pool.execute(query,[data.id])
    if(result[0].affectedRows == 1) return {message:"deleted"}
    else return {message:"لا يمكننا حذف هذا الكتاب"}
}