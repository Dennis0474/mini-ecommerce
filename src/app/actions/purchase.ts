"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function purchaseProduct(productId: string, quantity: number, buyerId: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: {
          id: productId,
          stock: {gte: quantity},
        },
        data: {
          stock: {decrement: quantity}
        },
      });

      const order = await tx.order.create({
  data: {
    sellerId: product.sellerId,
    buyerId
  },
});

const orderItem = await tx.orderItem.create({
  data: {
    orderId: order.id,
    productId,
    quantity,
    purchasePrice: product.price
  },
});

      return { product, order };
    });

    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "Sold out" };
    }
    throw error;
  }
}