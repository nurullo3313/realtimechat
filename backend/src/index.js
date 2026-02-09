import express from "express"

const app = express()
app.use(express.json())




app.get("/",(req, res)=>{
  return  res.send("server on")
})



app.listen(5000,()=>{
    console.log("http://localhost:5000")
})