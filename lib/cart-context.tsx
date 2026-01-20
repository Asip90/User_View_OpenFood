'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/* ---------------- TYPES ---------------- */

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

type CartState = {
  [id: number]: CartItem;
};

type AddItemInput = {
  id: number;
  name: string;
  price: string | number;
  discount_price?: string | number | null;
};

interface CartContextType {
  cart: CartState;
  addItem: (item: AddItemInput) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

/* ---------------- CONTEXT ---------------- */

export const CartContext = createContext<CartContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});

  /* Ajouter un item */
  const addItem = (item: AddItemInput) => {
    setCart(prev => {
      const existing = prev[item.id];

      return {
        ...prev,
        [item.id]: {
          id: item.id,
          name: item.name,
          price: Number(item.discount_price ?? item.price),
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  /* Retirer un item */
  const removeItem = (itemId: number) => {
    setCart(prev => {
      const copy = { ...prev };

      if (!copy[itemId]) return prev;

      if (copy[itemId].quantity === 1) {
        delete copy[itemId];
      } else {
        copy[itemId].quantity -= 1;
      }

      return copy;
    });
  };

  /* Vider le panier */
  const clearCart = () => setCart({});

  /* Total */
  const getTotal = () =>
    Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ---------------- HOOK (IMPORTANT) ---------------- */

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
