import { Request, Response, Router } from "express";
import { middleware } from "../middleware.ts/authMiddleware";
import { prisma } from "../db/prisma";
import { reservationSchema } from "../types/types";

export const reservationRoutes=Router()



reservationRoutes.post("/create",middleware,async(req:Request,res:Response)=>{
    const userId = req.userId;
    
    if (!userId) {
       res.status(401).json({ msg: "Unauthorized" });
       return
    }

    try {
      const parseData = reservationSchema.safeParse(req.body);
      
      if (!parseData.success) {
         res.status(400).json({ msg: "Invalid reservation data" });
         return
      }

      const { startDate, endDate, totalPrice, listingId, guestCount } = parseData.data;

      // Check if the listing exists
      const listing = await prisma.listing.findUnique({
        where: { id: listingId }
      });

      if (!listing) {
         res.status(404).json({ msg: "Listing not found" });
         return
      }

      // Check if the dates are available
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          listingId,
          OR: [
            {
              AND: [
                { startDate: { lte: startDate } },
                { endDate: { gte: startDate } }
              ]
            },
            {
              AND: [
                { startDate: { lte: endDate } },
                { endDate: { gte: endDate } }
              ]
            }
          ]
        }
      });

      if (existingReservation) {
         res.status(400).json({ msg: "Property is not available for these dates" });
         return
      }

      // Check if guest count is within property limit
      if (guestCount > listing.guestCount) {
     res.status(400).json({ 
          msg: `Guest count exceeds property limit of ${listing.guestCount} guests` 
        });
        return
      }

      const reservation = await prisma.reservation.create({
        data: {
          startDate,
          endDate,
          totalPrice,
          userId,
          listingId
        }
      });

       res.status(200).json({ reservation });
       
    } catch (error) {
      console.error("Reservation creation error:", error);
       res.status(500).json({ msg: "Error creating reservation" });
       return
    }
  }
)







reservationRoutes.get(
    "/user",
    middleware,
    async (req: Request, res: Response) => {
      const userId = req.userId;
  
      if (!userId) {
         res.status(401).json({ msg: "Unauthorized" });
         return
      }
  
      try {
        const reservations = await prisma.reservation.findMany({
          where: { userId },
          include: {
            listing: true
          }
        });
  
         res.status(200).json({ reservations });
         return
      } catch (error) {
        console.error("Error fetching user reservations:", error);
         res.status(500).json({ msg: "Error fetching reservations" });
         return
      }
    }
  );






  // Get all reservations for a host's properties guest ko booking manage garna lai use garney yo route chai 


  reservationRoutes.get(
    "/host",
    middleware,
    async (req: Request, res: Response) => {
      const userId = req.userId;
  
      if (!userId) {
         res.status(401).json({ msg: "Unauthorized" });
         return
      }
  
      try {
        const reservations = await prisma.reservation.findMany({
          where: {
            listing: {
              userId: userId
            }
          },
          include: {
            listing: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true
              }
            }
          }
        });
  
         res.status(200).json({ reservations });
         return
      } catch (error) {
        console.error("Error fetching host reservations:", error);
         res.status(500).json({ msg: "Error fetching reservations" });
         return
      }
    }
  );
  







//Retrieves detailed information about a specific reservation
  reservationRoutes.get(
    "/:reservationId",
    middleware,
    async (req: Request, res: Response) => {
      const userId = req.userId;
      const { reservationId } = req.params;
  
      if (!userId) {
         res.status(401).json({ msg: "Unauthorized" });
         return
      }
  
      try {
        const reservation = await prisma.reservation.findUnique({
          where: { id: reservationId },
          include: {
            listing: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true
              }
            }
          }
        });
  
        if (!reservation) {
           res.status(404).json({ msg: "Reservation not found" });
           return
        }
  
        // Check if the user is either the guest or the host
        if (reservation.userId !== userId && reservation.listing.userId !== userId) {
           res.status(403).json({ msg: "Not authorized to view this reservation" });
           return
        }
  
         res.status(200).json({ reservation });
         return
      } catch (error) {
        console.error("Error fetching reservation:", error);
         res.status(500).json({ msg: "Error fetching reservation" });
         return
      }
    }
  );


  