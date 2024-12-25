import { z }from "zod"
export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    phoneNum: z.string().optional(), 
    profession: z.string().optional(), 
});

export const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
})

export const listingSchema = z.object({

    title: z.string().min(1, { message: "Title is required" }), 
    description: z.string().min(1, { message: "Description is required" }),  // Description is a required string
    imageSrc: z.array(z.string().url()).min(1, { message: "At least one image URL is required" }),  // Array of image URLs, each should be a valid URL
    category: z.string().min(1, { message: "Category is required" }),  // Category is required string
    roomCount: z.number().int().min(1, { message: "Room count must be at least 1" }),  // Room count, must be an integer and >= 1
    bathroomCount: z.number().int().min(1, { message: "Bathroom count must be at least 1" }),  // Bathroom count, must be an integer and >= 1
    guestCount: z.number().int().min(1, { message: "Guest count must be at least 1" }),  // Guest count, must be an integer and >= 1
    price: z.number().min(0, { message: "Price must be a positive number" }),  // Price, must be a positive number  
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    userId: z.string()
  });