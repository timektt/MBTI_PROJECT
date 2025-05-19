// ✅ File: prisma/seed.ts (เวอร์ชัน CommonJS)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      username: "testuser",
    },
  });

  const card = await prisma.card.create({
    data: {
      userId: user.id,
      title: "Welcome Card",
      description: "This is a test card",
      imageUrl: "",
    },
  });

  await prisma.activity.create({
    data: {
      type: "LIKE_CARD",
      message: "Test User liked a card",
      userId: user.id,
      cardId: card.id,
    },
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
