import express from "express"
import { authroutes } from "./routes/auth"
import { propertyRoutes } from "./routes/property"
import * as dotenv from 'dotenv';
const app =express()
dotenv.config();
const port=process.env.PORT

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("server is running")
})

app.use("/auth",authroutes)
app.use("/property",propertyRoutes)
app.listen(port,()=>{
    console.log(`server running in ${port}`)
})