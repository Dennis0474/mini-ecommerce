import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "BUYER" | "SELLER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "BUYER" | "SELLER" | "ADMIN";
  }
}

declare module "@auth/core/jwt"  {
  interface JWT {
    role: "BUYER" | "SELLER" | "ADMIN";
  }
}