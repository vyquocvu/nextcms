import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";

export async function getAuthOptions(): Promise<NextAuthOptions> {
  const { PrismaAdapter } = await import("@next-auth/prisma-adapter");
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });
          if (user && user.password === credentials.password) {
            return { id: String(user.id), name: user.username, email: user.email };
          }
          return null;
        },
      }),
    ],
    session: {
      strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}
