import { addBook,getBooks, updateBook,deleteBook,getCategory } from "../models/book.mjs";

function validateBookData(data){
    if(data.pages_read>data.pages_total || data.publication_year>2025 || data.description == '' || data.name==''|| data.author==''||data.staus==''){
        return {message:"لا يمكن اضافة هذه البيانات, تأكد من كتابة جميع المعلومات المطلوبه, ان عدد صفحات الكتاب اكبر من عدد الصفحات التي تم قرأتها وان تاريخ نشر الكتاب صالح."}
    }
    return true
}

export async function addBookCon(req,res){
    let validate = validateBookData(req.body)
    console.log(validate)
    if(validate==true){
    let result = await addBook(req.body)
    res.status(result.code).send({message:result.message})
    }else{
        res.send(validate)
    }

}

export async function getUserBooks(req,res){

    let books = await getBooks(req.session.user.id)
     
    res.send(books)
}

export async function updateUserBook(req,res) {
    let validate = validateBookData(req.body)
    if(validate==true){
        let result = await updateBook(req.body)
    res.send(result)
    }
    else res.send(validate)
}

export async function deleteUserBook(req,res) {
    let result = await deleteBook(req.body)
    res.send(result)
}

export async function getAllCat(req,res) {
    let result = await getCategory()
    res.send(result)
}

