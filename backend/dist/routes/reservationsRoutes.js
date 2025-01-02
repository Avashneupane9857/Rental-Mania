"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const prisma_1 = require("../db/prisma");
const types_1 = require("../types/types");
exports.reservationRoutes = (0, express_1.Router)();
// Helper function to get filtered reservations
const getHostReservations = (userId, filter) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const whereClause = Object.assign(Object.assign({ listing: {
            userId: userId
        } }, (filter === 'current' && {
        startDate: { lte: now },
        endDate: { gte: now }
    })), (filter === 'upcoming' && {
        startDate: { gt: now }
    }));
    return prisma_1.prisma.reservation.findMany({
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
});
exports.reservationRoutes.get("/host", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const filter = req.query.filter;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        const reservations = yield getHostReservations(userId, filter);
        res.status(200).json({ reservations });
        return;
    }
    catch (error) {
        console.error("Error fetching host reservations:", error);
        res.status(500).json({ msg: "Error fetching reservations" });
        return;
    }
}));
exports.reservationRoutes.post("/create", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        const parseData = types_1.reservationSchema.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({ msg: "Invalid reservation data" });
            return;
        }
        const { startDate, endDate, totalPrice, listingId, guestCount } = parseData.data;
        // Check if the listing exists
        const listing = yield prisma_1.prisma.listing.findUnique({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ msg: "Listing not found" });
            return;
        }
        // Check if the dates are available
        const existingReservation = yield prisma_1.prisma.reservation.findFirst({
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
            return;
        }
        // Check if guest count is within property limit
        if (guestCount > listing.guestCount) {
            res.status(400).json({
                msg: `Guest count exceeds property limit of ${listing.guestCount} guests`
            });
            return;
        }
        const reservation = yield prisma_1.prisma.reservation.create({
            data: {
                startDate,
                endDate,
                totalPrice,
                userId,
                listingId
            }
        });
        res.status(200).json({ reservation });
    }
    catch (error) {
        console.error("Reservation creation error:", error);
        res.status(500).json({ msg: "Error creating reservation" });
        return;
    }
}));
// yo ta user side ko mah tesko specifi reservation dekauna lai ho 
//yeti ho ki mailey yesma filter i mean query hanu parcha if all ho vaney no need to send any params or else send current and upcoming and filter from background and give response 
exports.reservationRoutes.get("/user", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        const reservations = yield prisma_1.prisma.reservation.findMany({
            where: { userId },
            include: {
                listing: true
            }
        });
        res.status(200).json({ reservations });
        return;
    }
    catch (error) {
        console.error("Error fetching user reservations:", error);
        res.status(500).json({ msg: "Error fetching reservations" });
        return;
    }
}));
// Get all reservations for a host's properties guest ko booking manage garna lai use garney yo route chai 
// reservationRoutes.get(
//   "/host",
//   middleware,
//   async (req: Request, res: Response) => {
//     const userId = req.userId;
//     if (!userId) {
//        res.status(401).json({ msg: "Unauthorized" });
//        return
//     }
//     try {
//       const reservations = await prisma.reservation.findMany({
//         where: {
//           listing: {
//             userId: userId
//           }
//         },
//         include: {
//           listing: true,
//           user: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               email: true,
//               image: true
//             }
//           }
//         }
//       });
//        res.status(200).json({ reservations });
//        return
//     } catch (error) {
//       console.error("Error fetching host reservations:", error);
//        res.status(500).json({ msg: "Error fetching reservations" });
//        return
//     }
//   }
// );
//Retrieves detailed information about a specific reservation
exports.reservationRoutes.get("/:reservationId", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { reservationId } = req.params;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        const reservation = yield prisma_1.prisma.reservation.findUnique({
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
            return;
        }
        // Check if the user is either the guest or the host
        if (reservation.userId !== userId && reservation.listing.userId !== userId) {
            res.status(403).json({ msg: "Not authorized to view this reservation" });
            return;
        }
        res.status(200).json({ reservation });
        return;
    }
    catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ msg: "Error fetching reservation" });
        return;
    }
}));
// aaila ko lai both host and user can cancel reservation ani btw i think thats the best apporach cause same route can be used to do cancellation tas
// from any type of user cause in frontend declining the reservation by host is same thing like cancellation okay i think thats the best apporach 
exports.reservationRoutes.delete("/:reservationId", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { reservationId } = req.params;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        const reservation = yield prisma_1.prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { listing: true }
        });
        if (!reservation) {
            res.status(404).json({ msg: "Reservation not found" });
            return;
        }
        // Check if the user is either the guest or the host
        if (reservation.userId !== userId && reservation.listing.userId !== userId) {
            res.status(403).json({ msg: "Not authorized to cancel this reservation" });
            return;
        }
        yield prisma_1.prisma.reservation.delete({
            where: { id: reservationId }
        });
        res.status(200).json({ msg: "Reservation cancelled successfully" });
        return;
    }
    catch (error) {
        console.error("Error cancelling reservation:", error);
        res.status(500).json({ msg: "Error cancelling reservation" });
        return;
    }
}));
///////////////////////////**************** */
