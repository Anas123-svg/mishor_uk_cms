import { create } from "zustand";
import axios from "axios";
import { Cart } from "@/types";
type CartStore = {
  items: Cart[];
  initCart: (items: Cart[]) => void;
  addItem: (item: Cart, user: boolean, token?: any) => void;
  removeItem: (id: number, user: boolean, token?: any) => void;
  deleteItem: (id: number, user: boolean, token?: any) => void;
  addQuantity: (id: number, user: boolean, token?: any) => void;
  getItemQuantity: (id: number) => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: (user: boolean, token?: any) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  initCart: (items) => {
    set({ items: items });
  },
  addItem: async (item, user, token) => {
    let new_items = get().items;
    let found = false;
    new_items.forEach((cart_item) => {
      if (cart_item.product.id === item.product.id) {
        found = true;
        cart_item.quantity++;
      }
    });

    if (!found) {
      new_items.push({ ...item, quantity: 1 });
    }
    set({ items: new_items });
    if (user) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        { cart: new_items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  },
  removeItem: async (id, user, token) => {
    let new_items = get().items;
    let found = false;
    new_items.forEach((cart_item) => {
      if (cart_item.product.id === id) {
        found = true;
        if (cart_item.quantity > 1) {
          cart_item.quantity--;
        } else {
          new_items = new_items.filter((item) => item.product.id !== id);
        }
      }
    });
    if (!found) {
      new_items = new_items.filter((item) => item.product.id !== id);
    }
    set({ items: new_items });
    if (user) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update/`,
        { cart: new_items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  },
  deleteItem: async (id, user, token) => {
    let new_items = get().items;
    new_items = new_items.filter((item) => item.product.id !== id);
    set({ items: new_items });
    if (user) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        { cart: new_items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  },
  addQuantity: async (id, user, token) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
    if (user) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        { cart: get().items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  },
  getItemQuantity: (id) => {
    let quantity = 0;
    get().items.forEach((item) => {
      if (item.product.id === id) {
        quantity = item.quantity;
      }
    });
    return quantity;
  },
  getTotalPrice: () => {
    let total_price = 0;
    get().items.forEach((item) => {
      total_price +=
        (item.product.discountedPrice
          ? item.product.discountedPrice
          : item.product.price) * item.quantity;
    });
    return total_price;
  },
  getTotalItems: () => {
    let total_items = 0;
    get().items.forEach((item) => {
      total_items += item.quantity;
    });
    return total_items;
  },
  clearCart: async (user, token) => {
    set({ items: [] });
    if (user) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        { cart: [] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  },
}));
