import express from "express"
import { authroutes } from "./routes/auth"
import { propertyRoutes } from "./routes/property"

const app =express()

app.get("/",(req,res)=>{
    res.send("server is running")
})

app.use("/auth",authroutes)
app.use("/property",propertyRoutes)