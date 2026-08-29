import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" }, 
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {username: credentials.username},
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordsMatch) {
          return null;
        }

        return {id: user.id, role: user.role}
      },
    }),
  ],
});