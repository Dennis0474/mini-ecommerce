"use server";

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function checkout(productId: string, quantity: number, buyerId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return { error: "Product not found" };
  }

  const order = await prisma.order.create({
    data: {
      sellerId: product.sellerId,
      buyerId
    },
  });

  await prisma.orderItem.create({
data: {
  orderId: order.id,
  productId,
  quantity,
  purchasePrice: product.price
}
  });
    
  const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price,
      },
      quantity: quantity,
    },
  ],
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?orderId=${order.id}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`,
  metadata: {
    orderId: order.id,
  },
});

  redirect(session.url!);
}