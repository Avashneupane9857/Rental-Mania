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
exports.propertyRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const types_1 = require("../types/types");
const prisma_1 = require("../db/prisma");
// upload images that will be saved to S3 bucket and in frontend fetch from there directly
exports.propertyRoutes = (0, express_1.Router)();
exports.propertyRoutes.post("/list", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseData = types_1.listingSchema.safeParse(req.body);
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
        res.json({ msg: "No userId passed from middleware" });
    }
    try {
        if (!parseData.success) {
            res.status(400).json({ msg: "Validation error" });
            return;
        }
        const property = yield prisma_1.prisma.listing.create({
            data: {
                title: parseData.data.title,
                description: parseData.data.description,
                imageSrc: parseData.data.imageSrc,
                category: parseData.data.category,
                roomCount: parseData.data.roomCount,
                bathroomCount: parseData.data.bathroomCount,
                guestCount: parseData.data.guestCount,
                latitude: parseData.data.latitude,
                longitude: parseData.data.longitude,
                price: parseData.data.price,
                userId: userId,
            },
        });
        res.status(200).json({ property });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: "Error in property listing" });
    }
}));
exports.propertyRoutes.get("/filter", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category, price, location } = req.query;
        const query = {};
        // Add conditions only if the parameters exist and are non-empty
        if (title && typeof title === 'string' && title.trim() !== '') {
            query.title = title.trim();
        }
        if (location && typeof location === 'string' && location.trim() !== '') {
            query.location = location.trim();
        }
        if (category && typeof category === 'string' && category.trim() !== '') {
            query.category = category.trim();
        }
        if (price && typeof price === 'string' && price.trim() !== '') {
            query.price = parseInt(price.trim()); // Convert to number since price in your schema appears to be numeric
        }
        console.log('Filter query:', query);
        const property = yield prisma_1.prisma.listing.findMany({
            where: query,
        });
        if (property.length === 0) {
            res.status(200).json({ msg: `No properties found matching the criteria` });
            return;
        }
        res.status(200).json({ property });
    }
    catch (e) {
        console.error('Error in filter route:', e);
        res.status(403).json({ msg: "Error in filter route of property" });
        return;
    }
}));
exports.propertyRoutes.get("/:propertyId", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propertyId } = req.params;
    if (!propertyId) {
        res.status(400).json({
            msg: "Please provide Id",
        });
        return;
    }
    const property = yield prisma_1.prisma.listing.findUnique({
        where: {
            id: propertyId,
        },
    });
    if (!property) {
        res.status(400).json({ msg: "No property for this ID" });
        return;
    }
    res.status(200).json({
        property,
    });
}));
exports.propertyRoutes.get("/", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const property = yield prisma_1.prisma.listing.findMany();
    if (!property) {
        res.status(400).json({ msg: "something worng" });
        return;
    }
    res.status(200).json({
        property
    });
}));
exports.propertyRoutes.delete("/:propertyId", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propertyId } = req.params;
    if (!propertyId) {
        res.status(400).json({
            msg: "Please provide Id",
        });
        return;
    }
    const property = yield prisma_1.prisma.listing.findUnique({
        where: {
            id: propertyId,
        },
    });
    if (!property) {
        res.status(400).json({ msg: "No property for this ID" });
        return;
    }
    yield prisma_1.prisma.listing.delete({
        where: {
            id: propertyId,
        },
    });
    res.status(200).json({
        msg: `Property with ID ${propertyId} deleted successfully. ${property}`,
    });
}));
