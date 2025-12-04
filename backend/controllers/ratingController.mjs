import { addRating, deleteRating, getRating } from "../models/reting.mjs"


export async function getRatingBook(req,res) {
    let book_id = req.query.book_id
   
    let result = await getRating(book_id)
    if(result.data)return res.status(result.code).send(result.data)
    res.status(result.code).send({message:result.message})
}

export async function addRatingBook(req,res) {
    let result = await addRating(req.body)
    res.status(result.code).send({message:result.message})
}

export async function deleteRatingBook(req,res) {
    let result = await deleteRating(req.body)
    res.status(result.code).send({message:result.message})
}