import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"


export default {
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        authorization: {
          params: {
            scope: "openid email profile",
          },
        },
      })],
  } satisfies NextAuthConfig