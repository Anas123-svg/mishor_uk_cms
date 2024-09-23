"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "@/components/ItemPage/slider";
import ReactLoading from "react-loading";
import Reviews from "@/components/ItemPage/reviews";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import useAuthStore from "@/store/authStore";
import { Product } from "@/types";
import { GoPlus } from "react-icons/go";
import { HiMinusSmall } from "react-icons/hi2";

const page = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const { inWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem, addQuantity } = useCartStore();
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <ReactLoading type="bars" color="#000000" width={100} />
    </div>
  ) : product ? (
    <div className="pt-32 px-8 md:px-16 mb-10 lg:px-24">
      <div className="flex flex-col md:flex-row">
        <Slider photos={product?.images} />
        <div className="mt-10 md:mt-0 w-full md:w-1/2 md:pl-10 bg-white">
          <h1 className="text-4xl font-mons mb-5">{product?.name}</h1>
          <p className="text-lg mb-5 font-mons">
            PKR {(product?.finalPrice).toLocaleString()}
            {product?.discount > 0 && (
              <span className="line-through text-tertiary text-sm ml-2">
                PKR {product?.price.toLocaleString()}
              </span>
            )}
          </p>
          <div className="mb-3">
            <p className="font-extralight text-sm mb-1">Size:</p>
            <div className="flex gap-2">
              {product?.sizes
                .sort((a, b) => {
                  const order = ["S", "M", "L", "XL"];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map((s: string) => (
                  <button
                    key={s}
                    className={`px-3 py-1 font-extralight hover:border-black text-sm border ${
                      s == size ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setSize(s)}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="font-extralight text-sm mb-1">Color:</p>
            <div className="flex gap-2">
              {product?.colors.map((c: string) => (
                <button
                  key={c}
                  className={`px-3 py-1 font-extralight hover:border-black text-sm border ${
                    c == color ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setColor(c)}
                >
                  {c[0].toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex gap-2 mb-10">
            {product?.inStock && (
              <div className="flex items-center text-lg text-gray-800 border border-black w-fit">
                <button
                  className="py-1 px-2 font-light"
                  disabled={count <= 1}
                  onClick={() => {
                    if (count > 1) {
                      setCount(count - 1);
                    }
                  }}
                >
                  <HiMinusSmall />
                </button>
                <span className="font-light py-1 w-10 text-center inline-block">
                  {count}
                </span>
                <button
                  className="py-1 px-2 font-light"
                  onClick={() => {
                    setCount(count + 1);
                  }}
                >
                  <GoPlus />
                </button>
              </div>
            )}
            {product?.inStock ? (
              <button
                onClick={() => {
                  if (!size && !color) {
                    toast.error("Please select size and color");
                    return;
                  }
                  if (!size) {
                    toast.error("Please select size");
                    return;
                  }
                  if (!color) {
                    toast.error("Please select color");
                    return;
                  }
                  addItem(
                    {
                      product,
                      quantity: 1,
                      size,
                      color,
                    },
                    user ? true : false,
                    token
                  );
                  for (let i = 1; i < count; i++) {
                    addQuantity(
                      product._id + size + color,
                      user ? true : false,
                      token
                    );
                  }
                  toast.success("Added to cart");
                  setSize("");
                  setColor("");
                }}
                className="border border-black hover:border-tertiary px-6 py-2 text-black hover:text-tertiary duration-200 transition"
              >
                Add to Cart
              </button>
            ) : (
              <p className="group items-center justify-center border border-black bg-neutral-300 px-6 py-2 text-black transition-colors">
                Out of Stock
              </p>
            )}
            <button
              onClick={() => {
                if (user) {
                  if (inWishlist(product._id)) {
                    removeFromWishlist(product._id, token);
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
              className="group p-3 rounded-full border"
            >
              {inWishlist(product._id) ? (
                <MdFavorite className="text-tertiary text-2xl group-hover:scale-125 transition duration-200" />
              ) : (
                <MdFavoriteBorder className="text-tertiary text-2xl group-hover:scale-125 transition duration-200" />
              )}
            </button>
          </div>
          {product?.description && (
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {product?.description}
            </p>
          )}
          <p className="mt-5 font-light leading-relaxed text-gray-700">
            Category: {product?.subCategory}, {product?.category}
          </p>
        </div>
      </div>
      <Reviews
        reviews={product.reviews}
        userEmail={user?.email || ""}
        onSubmitReview={async (review) => {
          try {
            await axios.put(`/api/product/${id}`, {
              reviews: [
                ...product.reviews,
                {
                  name: user?.name,
                  email: user?.email,
                  ...review,
                },
              ],
            });
            getProduct();
            toast.success("Review posted");
          } catch (error) {
            console.log(error);
          }
        }}
        onDeleteReview={async (index) => {
          try {
            const reviews = product.reviews;
            reviews.splice(index, 1);
            await axios.put(`/api/product/${id}`, {
              reviews,
            });
            getProduct();
            toast.success("Review deleted");
          } catch (error) {
            console.log(error);
          }
        }}
        className="mt-10"
      />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl text-gray-800">Product not found</h1>
    </div>
  );
};

export default page;
