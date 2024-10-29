import { prisma } from "../../db/index.js";

export const Login = async (email, password) => {
  if (email && password) {
    const databaseAdded = await prisma.user.create({
      data: {
        email,
        hashedPassword: password,
      },
    });
    return databaseAdded;
  }

  console.log(email, password);
};
