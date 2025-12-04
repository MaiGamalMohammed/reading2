import * as userController from "./controllers/userController.mjs"
import * as bookController from './controllers/bookController.mjs'
import * as quoteController from './controllers/quoteController.mjs'
import * as ratingConroller from './controllers/ratingController.mjs'
import https from 'https'
import fs from 'fs'
import express from 'express'
import session from "express-session";
import cors from 'cors'

const app = express();

app.use(cors({
  origin: true,    
  credentials: true
}));
       
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret:"#@$jhMjaijdij90783#$%",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                
    secure: true,                  
    sameSite: "none",
    path: "/"             
  }
}))

app.post("/api/user", userController.create);
app.post("/api/login", userController.login)
 
app.use((req,res,next)=>{
  if(req.session.user) return next()
  return res.status(401).json({message:"your not loged in"})
})

app.get('/api/book',(req,res)=>{
  res.send("accessed")
})

app.post("/api/book",bookController.addBookCon)
app.get("/api/books",bookController.getUserBooks)
app.get("/api/category",bookController.getAllCat)
app.put("/api/book",bookController.updateUserBook)
app.delete("/api/book",bookController.deleteUserBook)

app.get("/api/quotes",quoteController.getQuotesBook)
app.post("/api/quote",quoteController.addQuoteBook)
app.put("/api/quote",quoteController.updateQuoteBook)
app.delete("/api/quote",quoteController.deleteQuoteBook)

app.get("/api/rating",ratingConroller.getRatingBook)
app.post("/api/rating",ratingConroller.addRatingBook)
 app.delete("/api/rating",ratingConroller.deleteRatingBook)

const options = {
  key: fs.readFileSync("./server.key"),   // path to your key
  cert: fs.readFileSync("./server.cert")  // path to your cert
};

https.createServer(options,app).listen(4000, () => {
  console.log("your server is running on http://localhost:4000");
});
