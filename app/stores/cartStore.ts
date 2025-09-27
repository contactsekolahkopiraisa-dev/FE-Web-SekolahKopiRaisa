// store/cartStore.ts
import { create } from "zustand";
import { CartItemData } from "../components/CartCard";

interface CartState {
  cartItems: CartItemData[];
  setCartItems: (items: CartItemData[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
}));
