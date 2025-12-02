import * as userController from "./controllers/userController.mjs"
import express from 'express'
import session from "express-session";
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret:"#@$jhMjaijdij90783#$%"
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

app.listen(4000, () => {
  console.log("your server is running on http://localhost:4000");
});
