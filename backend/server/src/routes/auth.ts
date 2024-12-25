import { Request, Response, Router } from 'express';
import { SignupSchema } from '../types';
import { prisma } from '../db/prisma';
import bcrypt from "bcrypt"

export const authroutes = Router();

authroutes.post("/signup",async(req:Request,res:Response)=>{
   const parsedData=SignupSchema.safeParse(req.body)
   if(!parsedData.success){
    res.status(400).json({
        msg:"Validation Error"
    })
    return
   }
  const checkUser= await prisma.user.findUnique({
     where:{
        email:parsedData.data.email
     }
   })
   if(checkUser){
    res.status(400).json({
        msg:"User already exits"
    })

   }
    const hashedPassword= await bcrypt.hash(parsedData.data.password,10)
    const user=await prisma.user.create({
        data:{
            email:parsedData.data.email,
            firstName:parsedData.data.firstName,
            lastName:parsedData.data.lastName,
            hashedPassword:hashedPassword
        }
    })

 
   res.status(200).json({user})

})