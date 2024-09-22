import prisma from "./prisma";

async function fetchAvailablePlans() {
    const plan = await prisma.planTemplate.findMany();
    return plan

}

export default fetchAvailablePlans 