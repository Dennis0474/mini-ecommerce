"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth"; // adjust path to wherever auth.ts actually lives

export async function createListing(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Not logged in" };
  }

  if (session.user.role !== "SELLER") {
    return {error: "Invalid role selected"};
  }
}