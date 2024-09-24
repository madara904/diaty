import prisma from '@/lib/prisma';

export async function updateOrCreatePlan(userEmail: string, selectedPlanName: string) {
  const selectedPlan = await prisma.planTemplate.findUnique({
    where: { name: selectedPlanName },
  });

  if (!selectedPlan) {
    throw new Error('Plan not found');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { plan: true },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  let updatedPlan;
  if (dbUser.plan) {
    updatedPlan = await prisma.plan.update({
      where: { id: dbUser.plan.id },
      data: {
        name: selectedPlan.name,
        dailyCalories: selectedPlan.dailyCalories,
        dailyCarbs: selectedPlan.dailyCarbs,
        dailyFats: selectedPlan.dailyFats,
        dailyProteins: selectedPlan.dailyProteins,
      },
    });
  } else {
    updatedPlan = await prisma.plan.create({
      data: {
        name: selectedPlan.name,
        dailyCalories: selectedPlan.dailyCalories,
        dailyCarbs: selectedPlan.dailyCarbs,
        dailyFats: selectedPlan.dailyFats,
        dailyProteins: selectedPlan.dailyProteins,
        user: { connect: { id: dbUser.id } },
      },
    });
  }

  return updatedPlan;
}