import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const middleware=(req:Request,res:Response,next:NextFunction)=>{
    const authorization=req.headers.authorization;
    if(!authorization){
        res.status(400).json({msg:"No auth header"})
        return
    }
    const secret=process.env.JWT_SECRET
    if (!secret) {
        return res.status(500).json({ msg: "JWT_SECRET is not defined in the environment variables" });
    }
    try{

    
        const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Token is missing or invalid format" });
    }
    
    const decoded=jwt.verify(token,secret) as {userId:string,email:string}
    req.userId=decoded.userId
    req.email=decoded.email
    console.log(decoded)
    next()

    }
    catch(error){
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ msg: "Invalid token" })
        }
        return res.status(500).json({ msg: "Internal server error" })
    }
}