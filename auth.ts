import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/drizzle/db"
import { users, accounts, sessions, verificationTokens, authenticators } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }) as any, // Type assertion to handle version mismatch between @auth/core packages
  
  providers: [
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          throw new Error("Phone number is required");
        }

        const phone = credentials.phone as string;

        // Verify OTP through your API (this assumes OTP was already verified)
        // In a real flow, you'd verify the OTP here or ensure it was verified before this step
        
        // Check if user exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.phone, phone))
          .limit(1);

        if (existingUser) {
          // Update phoneVerified if not already verified
          if (!existingUser.phoneVerified) {
            await db
              .update(users)
              .set({ phoneVerified: true })
              .where(eq(users.phone, phone));
          }

          return {
            id: existingUser.id,
            phone: existingUser.phone,
            role: existingUser.role,
          };
        }

        // Create new user if doesn't exist
        const [newUser] = await db
          .insert(users)
          .values({
            phone,
            phoneVerified: true,
            role: "USER",
            acceptTerms: true,
          })
          .returning();

        return {
          id: newUser.id,
          phone: newUser.phone,
          role: newUser.role,
          
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: process.env.NODE_ENV === "development",
})