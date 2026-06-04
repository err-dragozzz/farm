import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";


callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = String(user.id ?? token.sub ?? "");

      token.role =
        (
          user as {
            role?: "farmer" | "manager" | "admin";
          }
        ).role ?? "farmer";
    }

    if (!token.role && token.email) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email
        }
      });

      token.id = String(
        dbUser?.id ?? token.sub ?? ""
      );

      token.role =
        dbUser?.role ?? "farmer";
    }

    return token as typeof token & {
      id: string;
      role: string;
    };
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = String(
        (token as { id?: string }).id ?? ""
      );

      session.user.role = String(
        (token as { role?: string }).role ??
          "farmer"
      );
    }

    return session;
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login"
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
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

        const valid = await bcrypt.compare(
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
          image: user.avatar ?? user.image,
          role: user.role
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(
          user.id ?? token.sub ?? ""
        );

        token.role =
          (
            user as {
              role?: "farmer" | "manager" | "admin";
            }
          ).role ?? "farmer";
      }

      if (!token.role && token.email) {
        const dbUser =
          await prisma.user.findUnique({
            where: {
              email: token.email
            }
          });

        token.id = String(
          dbUser?.id ?? token.sub ?? ""
        );

        token.role =
          dbUser?.role ?? "farmer";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);

        session.user.role = String(
          token.role ?? "farmer"
        );
      }

      return session;
    }
  }
});