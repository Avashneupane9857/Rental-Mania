import express from "express"
import { authroutes } from "./routes/auth"
import { propertyRoutes } from "./routes/property"
import * as dotenv from 'dotenv';
import cors from "cors";

const corsOptions = {
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
  };
  
  // Enable CORS
  
const app =express()
app.use(cors(corsOptions));
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