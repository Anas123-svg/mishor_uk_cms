import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useWishlistStore } from "@/store/wishlistStore";
import useAuthStore from "@/store/authStore";
import { Product } from "@/types";

interface Props {
  product: Product;
}

function Card({ product }: Props) {
  const { inWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const router = useRouter();
  const { user, token } = useAuthStore();

  return (
    <div
      className="relative group w-full hover:shadow-2xl
     transition duration-200"
    >
      <Link
        href={`/products/${product.category}/${product.id}`}
        className="block text-black"
      >
        <div className="relative">
          <div
            id="imgs"
            className="w-full h-[60vh]
              transition duration-200
              bg-center bg-cover bg-no-repeat
          "
            style={{
              backgroundImage: `url(${product.images[0]})`,
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLElement
              ).style.backgroundImage = `url(${product.images[1]})`;
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLElement
              ).style.backgroundImage = `url(${product.images[0]})`;
            }}
          ></div>
          {!product.inStock && (
            <div className="absolute bg-black/40 w-full h-full top-0 left-0 flex items-center justify-center">
              <div className="bg-white/90 p-3 shadow-xl">
                <p className="text-2xl font-bold text-center text-gray-800">
                  Out of Stock
                </p>
              </div>
            </div>
          )}
          {product.discountedPrice > 0 && (
            <div className="absolute top-5 left-5 bg-primary text-white text-xs font-extralight rounded-full w-12 h-12 flex justify-center items-center">
              -
              {Math.floor(
                ((product.price - product.discountedPrice) / product.price) *
                  100
              )}
              %
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="my-2 text-xl font-light font-mons truncate">
            {product.title}
          </p>
          <p className="my-2 text-sm font-extralight line-clamp-4">
            {product.description}
          </p>
          <p className="my-2 font-mons">
            £{" "}
            {product.discountedPrice > 0
              ? product.discountedPrice.toLocaleString()
              : product.price.toLocaleString()}
            {product.discountedPrice > 0 && (
              <span className="ml-2 line-through text-gray-500 font-light">
                £ {product.price.toLocaleString()}
              </span>
            )}
          </p>
          <button className="font-mons font-light border border-black py-2 px-4 mt-10 hover:border-primary hover:text-primary transition- duration-200">
            More About Product
          </button>
        </div>
      </Link>
      <button
        onClick={() => {
          if (user) {
            if (inWishlist(product.id)) {
              removeFromWishlist(product.id, token);
              toast.success("Removed from wishlist");
            } else {
              addToWishlist(
                {
                  product,
                },
                token
              );
              toast.success("Added to wishlist");
            }
          } else {
            toast.error("Please login to add to wishlist");
            router.push("/login");
          }
        }}
        className="z-10 absolute bg-white w-12 h-12 rounded-full top-5 right-5 flex justify-center items-center"
      >
        {inWishlist(product.id) ? (
          <MdFavorite className="text-primary text-2xl hover:scale-125 transition duration-200" />
        ) : (
          <MdFavoriteBorder className="text-primary text-2xl hover:scale-125 transition duration-200" />
        )}
      </button>
    </div>
  );
}

export default Card;
