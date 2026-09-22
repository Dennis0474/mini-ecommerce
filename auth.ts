import NextAuth, { type Session } from "next-auth";
import { type JWT } from "@auth/core/jwt";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, 
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {username: credentials.username as string},
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password)

        if (!passwordsMatch) {
          return null;
        }

        return {id: user.id, role: user.role}
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role;
      token.id = user.id;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (dbUser?.suspendedAt) {
      return null as unknown as JWT;
    }

    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
      session.user.id = token.id;
    }
    return session;
  },
},
});