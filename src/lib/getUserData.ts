import { auth } from '@/auth';
import prisma from './prisma'; // Prisma client

export async function getUserData() {
  const session = await auth();

  const image = session?.user?.image

  if (!session || !session.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      weight: true,
      height: true,
      age: true,
      gender: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  return {
    ...user,
    image,
    gender: user.gender as "male" | "female" | "other" | null,
  }
}