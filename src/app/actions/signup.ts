"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signup(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; 

if (role !== "BUYER" && role !== "SELLER" && role !== "ADMIN") {
  return {error: "Could not find user"}
  }
  
const hashedPassword = await bcrypt.hash(password, 10);

await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      password: hashedPassword,
      username: username,
      role: role
    },
  });

  if (role === "BUYER") {
    await tx.buyer.create({ data: {userId: user.id}})
  } else if (role === "SELLER") {
    await tx.seller.create({ data: {userId: user.id}})
  } else {
    await tx.admin.create({ data: {userId: user.id}})
  }
});

}
  