import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "John Doe",
      profileImage: "https://example.com/johndoe.jpg",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      profileImage: "https://example.com/adminuser.jpg",
      role: "ADMIN",
    },
  });

  // Create Testimonies
  const testimony1 = await prisma.testimony.create({
    data: {
      title: "Healing Testimony",
      content: "I was healed from a chronic illness.",
      anonymous: false,
      approved: true,
      category: "HEALING",
      authorId: user1.id,
    },
  });

  const testimony2 = await prisma.testimony.create({
    data: {
      title: "Provision Testimony",
      content: "God provided for my financial needs.",
      anonymous: true,
      approved: false,
      category: "PROVISION",
      authorId: user2.id,
    },
  });

  // Create Likes
  await prisma.like.create({
    data: {
      testimonyId: testimony1.id,
      userId: user2.id,
    },
  });

  await prisma.like.create({
    data: {
      testimonyId: testimony2.id,
      userId: user1.id,
    },
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
