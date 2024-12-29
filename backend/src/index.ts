import express from "express"
import { authroutes } from "./routes/auth"
import { propertyRoutes } from "./routes/property"
import * as dotenv from 'dotenv';
import cors from "cors";
dotenv.config();
const corsOptions = {
    origin: ["http://localhost:5173","http://localhost:5174", "https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
  };
  

  
const app =express()
app.use(cors(corsOptions));
app.use(express.static('public'));

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