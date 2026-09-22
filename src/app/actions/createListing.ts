"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth"; 

export async function createListing(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Not logged in" };
  }

  if (session.user.role !== "SELLER") {
    return {error: "You do not have permission to proceed because you are not a Seller"};
  }

  const seller = await prisma.seller.findUnique({
  where: {userId: session.user.id},
});

if (!seller) {
  return { error: "Seller data not found"};
}

const name = formData.get("name") as string;
const description = formData.get("description") as string;
const price = Number(formData.get("price"));
const stock = Number(formData.get("stock"));

const product = await prisma.product.create({
  data: {
    name,
    description, 
    price,
    stock,
    sellerId: seller.id
  },
});
}