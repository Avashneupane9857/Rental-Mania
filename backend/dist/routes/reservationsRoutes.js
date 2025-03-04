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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const prisma_1 = require("../db/prisma");
const types_1 = require("../types/types");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.reservationRoutes = (0, express_1.Router)();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const generateReceiptId = () => {
    return `bk${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4)}`;
};
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
// Create payment
exports.reservationRoutes.post("/create-payment", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const { totalPrice } = parseData.data;
        const orderOptions = {
            amount: Math.round(totalPrice * 100),
            currency: 'INR',
            receipt: generateReceiptId(),
            payment_capture: 1
        };
        const order = yield razorpay.orders.create(orderOptions);
        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
        return;
    }
    catch (error) {
        console.error("Payment initiation error:", error);
        if ((_a = error.error) === null || _a === void 0 ? void 0 : _a.description) {
            res.status(400).json({
                msg: "Payment initialization failed",
                error: error.error.description
            });
            return;
        }
        res.status(500).json({ msg: "Error creating payment" });
        return;
    }
}));
// Create reservation
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
        const { startDate, endDate, totalPrice, listingId, guestCount, razorpay_payment_id, razorpay_order_id, razorpay_signature } = parseData.data;
        const generated_signature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            res.status(400).json({ msg: "Invalid payment signature" });
            return;
        }
        const listing = yield prisma_1.prisma.listing.findUnique({
            where: { id: listingId }
        });
        if (!listing) {
            res.status(404).json({ msg: "Listing not found" });
            return;
        }
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
                listingId,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                paymentStatus: 'completed'
            }
        });
        res.status(200).json({ reservation });
        return;
    }
    catch (error) {
        console.error("Reservation creation error:", error);
        res.status(500).json({ msg: "Error creating reservation" });
        return;
    }
}));
// Get host reservations
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
// Get user reservations
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
// Get specific reservation
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
// Cancel reservation
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
        if (reservation.userId !== userId && reservation.listing.userId !== userId) {
            res.status(403).json({ msg: "Not authorized to cancel this reservation" });
            return;
        }
        yield prisma_1.prisma.reservation.delete({
            where: { id: reservationId }
        });
        res.status(200).json({ msg: "Reservation cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling reservation:", error);
        res.status(500).json({ msg: "Error cancelling reservation" });
        return;
    }
}));
exports.default = exports.reservationRoutes;
