import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Extend NextAuth types to include custom properties (role, username)
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    role?: string;
    username?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role || "USER";
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
        token.username = (user as any).username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/forum/auth/signin",
    newUser: "/forum/auth/new-user",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };