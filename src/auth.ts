import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./lib/prisma";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter"


const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  })
];


export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {

    return { id: (provider as any).id, name: (provider as any).name };
  }
});


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  adapter: PrismaAdapter(prisma), 
  pages: {
    signIn: "/sign-in",
  },
});