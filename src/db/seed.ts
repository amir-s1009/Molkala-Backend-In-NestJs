import "dotenv/config";
import { prisma } from "./prisma.js";

async function seed() {
  await prisma.cart.updateMany({
    data: {
      isFreezed: false,
    },
  });
}

seed();
