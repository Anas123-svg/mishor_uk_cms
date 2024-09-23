import React from "react";
import { CiHeart } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlistStore } from "@/store/wishlistStore";
import WishlistItem from "./wishlistItem";
import useAuthStore from "@/store/authStore";
import { Wishlist } from "@/types";

const WishlistComp = () => {
  const { wishlist, clearWishlist } = useWishlistStore();
  const { user, token } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <CiHeart className="inline-block text-3xl hover:scale-125 transition duration-20" />
        {user && (
          <span className="-top-2 -right-1 h-4 w-4 absolute bg-primary text-white rounded-full p-0.5 text-[10px] flex justify-center items-center">
            {wishlist.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none w-screen max-w-[450px] h-[70vh] p-5">
        {user ? (
          <div className="w-full h-full">
            {wishlist.length ? (
              <div className="h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-mons">Your Wishlist</h2>
                  <button
                    onClick={() => clearWishlist(token)}
                    className="py-1 px-3  bg-primary text-white hover:bg-primary-hover transition duration-200"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-col justify-between h-full pt-3 pb-10 overflow-scroll">
                  <div>
                    {wishlist.map((item: Wishlist) => (
                      <WishlistItem key={item.product._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-lg lg:text-xl font-mons tracking-wider">
                No items in wishlist
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-lg lg:text-xl font-mons tracking-wider">
            Please login to view your wishlist
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WishlistComp;
