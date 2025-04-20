import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // Add the id field
      onboardingComplete?: boolean; // Add our custom field
      weight?: number | null;
      height?: number | null;
      age?: number | null;
      gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
      activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE' | null;
      targetCalories?: number | null; // Add targetCalories field
      goal?: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN' | null; // Add goal field
      // Include other default fields and any other custom fields you need
    } & DefaultSession["user"]; // Keep existing DefaultSession user fields
  }

  // Extend the default User type
  interface User extends DefaultUser {
    onboardingComplete?: boolean;
    weight?: number | null;
    height?: number | null;
    age?: number | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
    activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE' | null;
    targetCalories?: number | null; // Add targetCalories field
    goal?: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN' | null; // Add goal field
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    onboardingComplete?: boolean;
    weight?: number | null;
    height?: number | null;
    age?: number | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
    activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE' | null;
    targetCalories?: number | null; // Add targetCalories field
    goal?: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN' | null; // Add goal field
  }
}
