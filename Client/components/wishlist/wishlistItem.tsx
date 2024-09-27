import React from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import { Wishlist } from "@/types";
import useAuthStore from "@/store/authStore";
interface Props {
  item: Wishlist;
}

const WishlistItem = ({ item }: Props) => {
  const { user, token } = useAuthStore();
  const { removeFromWishlist } = useWishlistStore();
  return (
    <Link
      href={`/products/${item.product.id}`}
      className="mt-2 flex items-center border-b border-gray-300 drop-shadow-sm py-2"
    >
      <img
        src={item.product.images[0]}
        alt={item.product.title}
        className="w-20 h-20 mr-4 object-cover"
      />
      <div className="flex-1">
        <h3 className="mb-1 text-sm md:text-base font-mons">
          {item.product.title}
        </h3>
        <p className="font-mons text-sm">
          £{" "}
          {(item.product.discountedPrice
            ? item.product.discountedPrice
            : item.product.price
          ).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => removeFromWishlist(item.product.id, token)}
        className="transition duration-300 flex justify-center items-center text-white bg-primary hover:bg-primary-hover w-5 h-5 rounded-full focus:outline-none"
      >
        <IoIosClose />
      </button>
    </Link>
  );
};

export default WishlistItem;
