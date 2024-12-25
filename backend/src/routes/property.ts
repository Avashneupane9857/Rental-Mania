import { Request, Response, Router } from 'express';
import { middleware } from '../middleware.ts/authMiddleware';
import { listingSchema } from '../types/types';
import { prisma } from '../db/prisma';

export const propertyRoutes = Router();
 
propertyRoutes.post("/list",middleware,async(req:Request,res:Response)=>{
      const parseData=listingSchema.safeParse(req.body)
      const userId=req.userId
      if(!userId){
        res.json({msg:"No userId passed from middleware"})
      }
      try{

      
      if(!parseData.success){
        res.status(400).json({msg:"Validation error"})
        return
      }
    
      const property=await prisma.listing.create({
        data:{
           title:parseData.data.title,
           description:parseData.data.description,
           imageSrc:parseData.data.imageSrc,
           category:parseData.data.category,
           roomCount:parseData.data.roomCount,
           bathroomCount:parseData.data.bathroomCount,
           guestCount:parseData.data.guestCount,
           latitude:parseData.data.latitude,
           longitude:parseData.data.longitude,
           price:parseData.data.price,
           userId:userId

        }
      })
      res.status(200).json({property})
    }
      catch(e){
        console.log(e)
        res.status(400).json({msg:"Error in property listing"})
      }
})