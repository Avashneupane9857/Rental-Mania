import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  console.log("Db is running");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
