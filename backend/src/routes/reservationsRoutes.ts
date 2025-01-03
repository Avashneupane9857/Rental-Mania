import { Request, Response, Router } from "express";
import { middleware } from "../middleware.ts/authMiddleware";
import { prisma } from "../db/prisma";
import { reservationSchema } from "../types/types";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

export const reservationRoutes = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

interface RazorpayOptions {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture?: 0 | 1;
}

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

const generateReceiptId = () => {
  return `bk${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4)}`;
};

const getHostReservations = async (userId: string, filter?: 'current' | 'upcoming') => {
  const now = new Date();
  const whereClause = {
    listing: {
      userId: userId
    },
    ...(filter === 'current' && {
      startDate: { lte: now },
      endDate: { gte: now }
    }),
    ...(filter === 'upcoming' && {
      startDate: { gt: now }
    })
  };

  return prisma.reservation.findMany({
    where: whereClause,
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
};

// Create payment
reservationRoutes.post("/create-payment", middleware, async (req: Request, res: Response) => {
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

    const { totalPrice } = parseData.data;

    const orderOptions: RazorpayOptions = {
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: generateReceiptId(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(orderOptions) as unknown as RazorpayOrder;

     res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
    return

  } catch (error: any) {
    console.error("Payment initiation error:", error);
    
    if (error.error?.description) {
       res.status(400).json({ 
        msg: "Payment initialization failed",
        error: error.error.description 
      });
      return
    }
    
     res.status(500).json({ msg: "Error creating payment" });
     return
  }
});

// Create reservation
reservationRoutes.post("/create", middleware, async (req: Request, res: Response) => {
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

    const { 
      startDate, 
      endDate, 
      totalPrice, 
      listingId, 
      guestCount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature 
    } = parseData.data;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
       res.status(400).json({ msg: "Invalid payment signature" });
       return
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
       res.status(404).json({ msg: "Listing not found" });
       return
    }

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
        listingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentStatus: 'completed'
      }
    });

     res.status(200).json({ reservation });
     return
    
  } catch (error) {
    console.error("Reservation creation error:", error);
     res.status(500).json({ msg: "Error creating reservation" });
     return
  }
});

// Get host reservations
reservationRoutes.get("/host", middleware, async (req: Request, res: Response) => {
  const userId = req.userId;
  const filter = req.query.filter as 'current' | 'upcoming' | undefined;

  if (!userId) {
     res.status(401).json({ msg: "Unauthorized" });
     return
  }

  try {
    const reservations = await getHostReservations(userId, filter);
     res.status(200).json({ reservations });
     return
  } catch (error) {
    console.error("Error fetching host reservations:", error);
     res.status(500).json({ msg: "Error fetching reservations" });
     return
  }
});

// Get user reservations
reservationRoutes.get("/user", middleware, async (req: Request, res: Response) => {
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
});

// Get specific reservation
reservationRoutes.get("/:reservationId", middleware, async (req: Request, res: Response) => {
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
});

// Cancel reservation
reservationRoutes.delete("/:reservationId", middleware, async (req: Request, res: Response) => {
  const userId = req.userId;
  const { reservationId } = req.params;

  if (!userId) {
     res.status(401).json({ msg: "Unauthorized" });
     return
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true }
    });

    if (!reservation) {
       res.status(404).json({ msg: "Reservation not found" });
       return
    }

    if (reservation.userId !== userId && reservation.listing.userId !== userId) {
       res.status(403).json({ msg: "Not authorized to cancel this reservation" });
       return
    }

    await prisma.reservation.delete({
      where: { id: reservationId }
    });

     res.status(200).json({ msg: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
     res.status(500).json({ msg: "Error cancelling reservation" });
     return
  }
});

export default reservationRoutes;