import { Request, Response, Router } from "express";
import { LoginSchema, SignupSchema } from "../types/types";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
export const authroutes = Router();
dotenv.config();
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

authroutes.post("/signup", async (req: Request, res: Response) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      msg: "Validation Error",
      erorrs: parsedData.error.errors,
    });
    return;
  }
  const checkUser = await prisma.user.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });
  if (checkUser) {
    res.status(400).json({
      msg: "User already exits",
    });
  }
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: parsedData.data.email,
      firstName: parsedData.data.firstName,
      lastName: parsedData.data.lastName,
      hashedPassword: hashedPassword,
      phoneNum: parsedData.data.phoneNum,
      profession: parsedData.data.profession,
    },
  });

  res.status(200).json({ user });
});

authroutes.post("/login", async (req: Request, res: Response) => {
  const parsedData = LoginSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ msg: "Validation error" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.data?.email,
    },
  });
  if (!user) {
    res.status(400).json({ msg: "User doesnot exist" });
    return;
  }

  const check = await bcrypt.compare(
    parsedData.data?.password,
    user?.hashedPassword
  );
  if (!check) {
    res.status(400).json({
      msg: "Password wrong'",
    });
    return;
  }
  const username = user.firstName + " " + user.lastName;
  const token = jwt.sign(
    { userId: user.id, email: user.email, username: username },
    secret
  );

  res.status(200).json({ token });
});
