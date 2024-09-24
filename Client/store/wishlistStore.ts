import { create } from "zustand";
import axios from "axios";
import { Wishlist } from "@/types";
type WishlistStore = {
  wishlist: Wishlist[];
  initWishlist: (items: Wishlist[]) => void;
  addToWishlist: (item: Wishlist, token?: any) => void;
  removeFromWishlist: (id: number, token?: any) => void;
  inWishlist: (id: number) => boolean;
  clearWishlist: (token?: any) => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],
  initWishlist: (items) => {
    set({ wishlist: items });
  },
  addToWishlist: async (item, token) => {
    let new_wishlist = get().wishlist;
    let found = false;
    new_wishlist.forEach((wishlist_item) => {
      if (wishlist_item.product.id === item.product.id) {
        found = true;
      }
    });
    if (!found) {
      new_wishlist.push(item);
    }
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
      { wishlist: new_wishlist },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    set({ wishlist: new_wishlist });
  },
  removeFromWishlist: async (id, token) => {
    let new_wishlist = get().wishlist;
    new_wishlist = new_wishlist.filter((item) => item.product.id !== id);
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
      { wishlist: new_wishlist },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    set({ wishlist: new_wishlist });
  },
  inWishlist: (id) => {
    let found = false;
    get().wishlist.forEach((wishlist_item) => {
      if (wishlist_item.product.id === id) {
        found = true;
      }
    });
    return found;
  },
  clearWishlist: async (token) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
      { wishlist: [] },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    set({ wishlist: [] });
  },
}));
