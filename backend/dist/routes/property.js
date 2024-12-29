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
exports.propertyRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware.ts/authMiddleware");
const types_1 = require("../types/types");
const prisma_1 = require("../db/prisma");
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const awsConfig_1 = __importDefault(require("../awsConfig"));
// upload images that will be saved to S3 bucket and in frontend fetch from there
exports.propertyRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.propertyRoutes.post("/list", upload.array("images"), authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parseData = types_1.listingSchema.safeParse({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        roomCount: +req.body.roomCount,
        bathroomCount: +req.body.bathroomCount,
        guestCount: +req.body.guestCount,
        latitude: +req.body.latitude,
        longitude: +req.body.longitude,
        price: +req.body.price,
        propertyName: req.body.propertyName,
        locationName: req.body.locationName
    });
    const files = req.files;
    const userId = req.userId;
    const username = req.username;
    if (!userId) {
        res.json({ msg: "No userId passed from middleware" });
        return;
    }
    try {
        if ((_a = parseData.error) === null || _a === void 0 ? void 0 : _a.errors) {
            console.log(parseData.error);
        }
        if (!parseData.success) {
            res.status(400).json({ msg: "Validation error" });
            return;
        }
        if (!files) {
            res.status(400).json({ msg: "No image file" });
            return;
        }
        const uploadedImageUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `listings/${(0, uuid_1.v4)()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            };
            const uploadResult = yield awsConfig_1.default.upload(params).promise();
            return uploadResult.Location;
        })));
        const property = yield prisma_1.prisma.listing.create({
            data: {
                title: parseData.data.title,
                description: parseData.data.description,
                imageSrc: uploadedImageUrls,
                category: parseData.data.category,
                roomCount: parseData.data.roomCount,
                bathroomCount: parseData.data.bathroomCount,
                guestCount: parseData.data.guestCount,
                latitude: parseData.data.latitude,
                longitude: parseData.data.longitude,
                price: parseData.data.price,
                userId: userId,
                username: username,
                locationName: parseData.data.locationName,
                propertyName: parseData.data.propertyName
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
        if (title && typeof title === "string" && title.trim() !== "") {
            query.title = title.trim();
        }
        if (location && typeof location === "string" && location.trim() !== "") {
            query.location = location.trim();
        }
        if (category && typeof category === "string" && category.trim() !== "") {
            query.category = category.trim();
        }
        if (price && typeof price === "string" && price.trim() !== "") {
            query.price = parseInt(price.trim()); // Convert to number since price in your schema appears to be numeric
        }
        const property = yield prisma_1.prisma.listing.findMany({
            where: query,
        });
        if (property.length === 0) {
            res
                .status(200)
                .json({ msg: `No properties found matching the criteria` });
            return;
        }
        res.status(200).json({ property });
    }
    catch (e) {
        console.error("Error in filter route:", e);
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
        property,
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
exports.propertyRoutes.get("/host/properties", authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized: No user ID provided" });
        return;
    }
    try {
        const hostProperties = yield prisma_1.prisma.listing.findMany({
            where: {
                userId: userId
            },
        });
        if (hostProperties.length === 0) {
            res.status(200).json({
                msg: "No properties found for this host",
                properties: []
            });
            return;
        }
        res.status(200).json({
            hostProperties,
        });
    }
    catch (error) {
        console.error("Error fetching host properties:", error);
        res.status(500).json({ msg: "Error fetching host properties" });
    }
}));
// edit route yo chai for host ko specific property
exports.propertyRoutes.put("/:propertyId", upload.array("images"), authMiddleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { propertyId } = req.params;
    const userId = req.userId;
    const files = req.files;
    const { imagesToKeep } = req.body; // Array of existing image URLs to keep
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }
    try {
        // First check if the property exists and belongs to the user
        const existingProperty = yield prisma_1.prisma.listing.findFirst({
            where: {
                id: propertyId,
                userId: userId
            }
        });
        if (!existingProperty) {
            res.status(404).json({ msg: "Property not found or unauthorized" });
            return;
        }
        const parseData = types_1.listingSchema.safeParse({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            roomCount: +req.body.roomCount,
            bathroomCount: +req.body.bathroomCount,
            guestCount: +req.body.guestCount,
            latitude: +req.body.latitude,
            longitude: +req.body.longitude,
            price: +req.body.price,
            propertyName: req.body.propertyName,
            locationName: req.body.locationName
        });
        if (!parseData.success) {
            res.status(400).json({ msg: "Validation error" });
            return;
        }
        // Handle images to keep
        let finalImageUrls = imagesToKeep ? JSON.parse(imagesToKeep) : [];
        // Delete removed images from S3
        const imagesToDelete = existingProperty.imageSrc.filter(url => !finalImageUrls.includes(url));
        for (const imageUrl of imagesToDelete) {
            const key = imageUrl.split('/').pop(); // Get the filename from URL
            try {
                yield awsConfig_1.default.deleteObject({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `listings/${key}`
                }).promise();
            }
            catch (error) {
                console.error(`Failed to delete image ${key} from S3:`, error);
            }
        }
        // Upload new images if any
        if (files && files.length > 0) {
            const uploadedImageUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `listings/${(0, uuid_1.v4)()}_${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                };
                const uploadResult = yield awsConfig_1.default.upload(params).promise();
                return uploadResult.Location;
            })));
            finalImageUrls = [...finalImageUrls, ...uploadedImageUrls];
        }
        const updatedProperty = yield prisma_1.prisma.listing.update({
            where: {
                id: propertyId
            },
            data: {
                title: parseData.data.title,
                description: parseData.data.description,
                imageSrc: finalImageUrls,
                category: parseData.data.category,
                roomCount: parseData.data.roomCount,
                bathroomCount: parseData.data.bathroomCount,
                guestCount: parseData.data.guestCount,
                latitude: parseData.data.latitude,
                longitude: parseData.data.longitude,
                price: parseData.data.price,
                locationName: parseData.data.locationName,
                propertyName: parseData.data.propertyName
            }
        });
        res.status(200).json({ property: updatedProperty });
    }
    catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ msg: "Error updating property" });
    }
}));
