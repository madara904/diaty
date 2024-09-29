import { auth } from '@/auth';
import prisma from './prisma'; // Prisma client
import { revalidatePath } from 'next/cache';

export async function getUserData() {
  const session = await auth();

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
    gender: user.gender as "male" | "female" | "other" | null,
  }
}