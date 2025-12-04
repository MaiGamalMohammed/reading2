import {getQuotes,addQuote, updateQuote, deleteQuote} from '../models/quote.mjs'

export async function getQuotesBook(req,res) {
    let book_id = req.query.book_id
   
    let result = await getQuotes(book_id)
    if(result.data)return res.status(result.code).send(result.data)
    res.status(result.code).send({message:result.message})
}

export async function addQuoteBook(req,res) {
    let result = await addQuote(req.body)
    res.status(result.code).send({message:result.message})
}

export async function updateQuoteBook(req,res) {
    let result = await updateQuote(req.body)
    res.status(result.code).send({message:result.message})
}

export async function deleteQuoteBook(req,res) {
    let result = await deleteQuote(req.body)
    res.status(result.code).send({message:result.message})
}
