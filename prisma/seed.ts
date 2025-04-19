import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed Plan Templates
  await prisma.planTemplate.upsert({
    where: { name: "Fitness" },
    update: {},
    create: {
      name: "Fitness",
      dailyCalories: 2500,
      dailyCarbs: 300,
      dailyProteins: 150,
      dailyFats: 70,
    },
  })
  await prisma.planTemplate.upsert({
    where: { name: "Weight Gainer" },
    update: {},
    create: {
      name: "Weight Gainer",
      dailyCalories: 3200,
      dailyCarbs: 400,
      dailyProteins: 180,
      dailyFats: 90,
    },
  })
  await prisma.planTemplate.upsert({
    where: { name: "Weight Loss" },
    update: {},
    create: {
      name: "Weight Loss",
      dailyCalories: 1800,
      dailyCarbs: 180,
      dailyProteins: 120,
      dailyFats: 50,
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
