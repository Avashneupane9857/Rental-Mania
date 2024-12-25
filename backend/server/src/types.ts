import { z }from "zod"
export const SignupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    firstName:z.string(),
    lastName:z.string(),
    phoneNum:z.string(),
    profession:z.string()
})
export const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
})
