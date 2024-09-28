import { User } from "next-auth";
import prisma from "@/lib/prisma";

export default async function checkFlag(user: User | null | undefined) {
  if (user?.email) {
      const userData = await prisma.user.findUnique({
          where: { email: user.email },
          select: { completeFlag: true },
      });
      return userData?.completeFlag;
  }
  return undefined;
}