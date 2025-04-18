
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
    description: z.string().min(1, { message: "Description is required" }), 
    category: z.enum([
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
    roomCount: z.number().int().min(1, { message: "Room count must be at least 1" }),
    bathroomCount: z.number().int().min(1, { message: "Bathroom count must be at least 1" }),  
    guestCount: z.number().int().min(1, { message: "Guest count must be at least 1" }),  
    price: z.number().min(0, { message: "Price must be a positive number" }),  
    latitude: z.number(),
    longitude: z.number(),
    locationName:z.string(),
    propertyName:z.string()
 
    
  });


  export const reservationSchema = z.object({
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    totalPrice: z.number(),
    listingId: z.string(),
    guestCount: z.number(),
    razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
  });
