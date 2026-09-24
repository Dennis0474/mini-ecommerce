import { prisma } from "@/lib/prisma";

export async function searchProducts(query?: string, minPrice?: number, maxPrice?: number) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
  { name: { contains: query, mode: "insensitive" } },
  { description: { contains: query, mode: "insensitive" } },
],
price: (minPrice !== undefined || maxPrice !== undefined)
  ? { gte: minPrice, lte: maxPrice }
  : undefined
    },
    orderBy: {
  createdAt: "desc"
    },
  });

  return products;
}