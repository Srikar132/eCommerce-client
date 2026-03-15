import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/drizzle/db"
import { users, accounts, sessions, verificationTokens, authenticators } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { sendEmail, welcomeEmail } from "@/lib/emails"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any,

  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists by email
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (existingUser) {
            // Update name/image from Google if changed
            if (user.name !== existingUser.name || user.image !== existingUser.image) {
              await db
                .update(users)
                .set({
                  name: user.name,
                  image: user.image,
                  emailVerified: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(users.id, existingUser.id));
            }
          }
        } catch (error) {
          console.error("Sign-in callback error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;

          // Fetch role from database
          const [dbUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, user.id!))
            .limit(1);

          token.role = dbUser?.role ?? "USER";
        }

        // Handle session updates (e.g., after profile edit)
        if (trigger === "update" && session) {
          token.name = session.user?.name ?? token.name;
          token.email = session.user?.email ?? token.email;
          token.image = session.user?.image ?? token.image;
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.image = token.image as string;
          session.user.role = token.role as string;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  events: {
    async createUser({ user }) {
      // Set default role for new users created via OAuth
      if (user.id) {
        await db
          .update(users)
          .set({ role: "USER", acceptTerms: true, emailVerified: new Date() })
          .where(eq(users.id, user.id));
      }

      // Send welcome email to new user
      if (user.email) {
        try {
          const { subject, html } = welcomeEmail({ name: user.name || "there" });
          await sendEmail({ to: user.email, subject, html });
        } catch (error) {
          console.error("Failed to send welcome email:", error);
          // Don't block sign-up if email fails
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
})