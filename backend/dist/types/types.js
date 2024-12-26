"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingSchema = exports.LoginSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    phoneNum: zod_1.z.string().optional(),
    profession: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.listingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }), // Description is a required string
    imageSrc: zod_1.z.array(zod_1.z.string().url()).min(1, { message: "At least one image URL is required" }), // Array of image URLs, each should be a valid URL
    category: zod_1.z.string().min(1, { message: "Category is required" }), // Category is required string
    roomCount: zod_1.z.number().int().min(1, { message: "Room count must be at least 1" }), // Room count, must be an integer and >= 1
    bathroomCount: zod_1.z.number().int().min(1, { message: "Bathroom count must be at least 1" }), // Bathroom count, must be an integer and >= 1
    guestCount: zod_1.z.number().int().min(1, { message: "Guest count must be at least 1" }), // Guest count, must be an integer and >= 1
    price: zod_1.z.number().min(0, { message: "Price must be a positive number" }), // Price, must be a positive number  
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
});
