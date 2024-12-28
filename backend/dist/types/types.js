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
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    category: zod_1.z.enum([
        'Villa',
        'Home',
        'Cabin',
        'Farms',
        'Camp',
        'Beach',
        'Bungalow',
        'Treehouse',
        'Penthouse',
        'Castle',
        'Mansion'
    ], {
        required_error: "Category is required",
        invalid_type_error: "Category must be one of: Villa, Home, Cabin, Farms, Camp, Beach, Bungalow, Treehouse, Penthouse, Castle, Mansion"
    }),
    roomCount: zod_1.z.number().int().min(1, { message: "Room count must be at least 1" }),
    bathroomCount: zod_1.z.number().int().min(1, { message: "Bathroom count must be at least 1" }),
    guestCount: zod_1.z.number().int().min(1, { message: "Guest count must be at least 1" }),
    price: zod_1.z.number().min(0, { message: "Price must be a positive number" }),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    locationName: zod_1.z.string(),
    propertyName: zod_1.z.string()
});
