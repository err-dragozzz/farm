import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login"
  },

  providers: [
    Google({
      clientId:
        process.env.GOOGLE_CLIENT_ID ?? "",

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        ""
    }),

    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email"
        },

        password: {
          label: "Password",
          type: "password"
        }
      },

      async authorize(credentials) {
        const email = String(
          credentials?.email ?? ""
        ).toLowerCase();

        const password = String(
          credentials?.password ?? ""
        );

        const user =
          await prisma.user.findUnique({
            where: { email }
          });

        if (!user?.password) {
          return null;
        }

        const valid =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image:
            user.avatar ?? user.image,
          role: user.role
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(
          token.id ?? ""
        );

        session.user.role = String(
          token.role ?? "farmer"
        );
      }

      return session;
    }
  }
});