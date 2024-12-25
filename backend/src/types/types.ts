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
