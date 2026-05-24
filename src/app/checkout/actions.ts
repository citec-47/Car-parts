"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { formatOrderNumber, calculateShipping } from "@/lib/format";
import { prisma } from "@/lib/db";
import { SHIPPING } from "@/lib/constants";
import type { CartItem } from "@/lib/types";

const AddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const CartItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  sku: z.string(),
  image: z.string().nullable(),
  unitPriceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

const InputSchema = z.object({
  address: AddressSchema,
  items: z.array(CartItemSchema).min(1, "Cart is empty"),
});

export type PlaceOrderInput = z.infer<typeof InputSchema>;

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const { address, items } = parsed.data;
  const subtotalCents = items.reduce(
    (sum, i: CartItem) => sum + i.unitPriceCents * i.quantity,
    0,
  );
  const shippingCents = calculateShipping(
    subtotalCents,
    SHIPPING.freeShippingThresholdCents,
    SHIPPING.flatRateCents,
  );
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = formatOrderNumber();
  await prisma.order.create({
    data: {
      orderNumber,
      email: address.email,
      customerName: address.fullName,
      phone: address.phone,
      shippingAddress: address,
      subtotalCents,
      shippingCents,
      totalCents,
      items: {
        create: items.map((i: CartItem) => ({
          productId: i.productId,
          productName: i.name,
          productSku: i.sku,
          productImage: i.image,
          unitPriceCents: i.unitPriceCents,
          quantity: i.quantity,
          lineTotalCents: i.unitPriceCents * i.quantity,
        })),
      },
    },
  });
  return { ok: true, orderNumber };
}

export async function placeOrderAndRedirect(input: PlaceOrderInput): Promise<never> {
  const result = await placeOrderAction(input);
  if (!result.ok) throw new Error(result.error);
  redirect(`/checkout/confirmation/${result.orderNumber}`);
}
