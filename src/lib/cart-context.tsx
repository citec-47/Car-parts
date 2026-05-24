"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, CartItem } from "./types";

const STORAGE_KEY = "revparts.cart.v1";

type CartContextValue = {
  cart: Cart;
  itemCount: number;
  subtotalCents: number;
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStored(): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Cart;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, isHydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
          ),
        };
      }
      return { items: [...prev.items, { ...item, quantity: qty }] };
    });
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>((productId, qty) => {
    setCart((prev) => {
      if (qty <= 0) return { items: prev.items.filter((i) => i.productId !== productId) };
      return {
        items: prev.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
      };
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId) => {
    setCart((prev) => ({ items: prev.items.filter((i) => i.productId !== productId) }));
  }, []);

  const clear = useCallback(() => setCart({ items: [] }), []);

  const itemCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.quantity, 0),
    [cart.items],
  );

  const subtotalCents = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    [cart.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      subtotalCents,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [cart, itemCount, subtotalCents, isHydrated, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
