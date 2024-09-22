import  prisma  from '@/lib/prisma';
import { User } from 'next-auth';

export default async function fetchPlan(user: User | null | undefined) {
    if (user?.email) {
      const userData = await prisma.user.findUnique({
        where: { email: user.email },
        include: { plan: true },
      });

      return (userData?.plan);
    }
    return undefined;
  }