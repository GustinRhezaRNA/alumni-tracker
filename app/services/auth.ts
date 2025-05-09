import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, profile.email))
          .limit(1);

        if (existingUser.length > 0) {
          return true;
        } else {
          const userSession = {
            email: profile.email,
            fullName: profile.name,
            pictureUrl: profile.picture,
          };
          return `/onboarding?data=${encodeURIComponent(JSON.stringify(userSession))}`;
        }
      }
      return false;
    },

    //Tambahan: Inject role ke token
    async jwt({ token, user }) {
      if (user?.email) {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existingUser.length > 0) {
          token.role = existingUser[0].role;
          console.log("Role added to token: ", token.role);  
        }
      }
      return token;
    },

    //Inject token.role ke session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ baseUrl, url }) {
      if (url.includes("/onboarding")) {
        return `${baseUrl}/onboarding${url.split("/onboarding")[1]}`;
      }


      return `${baseUrl}/alumni`;
    }
  },

  pages: {
    signIn: "/sign-in",
  },


});
