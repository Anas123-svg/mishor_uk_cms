import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./cartItem";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { Cart } from "@/types";
const CartComp = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, token } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <CiShoppingCart className="inline-block text-3xl hover:scale-125 transition duration-200" />
        <span className="text-primary-hover -top-2 -right-1 h-4 w-4 absolute bg-primary text-white rounded-full p-0.5 text-[10px] flex justify-center items-center">
          {items.length}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none w-screen max-w-[450px] h-[70vh] p-5">
        <div className="w-full h-full">
          {items.length ? (
            <div className="h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-mons">Your Cart</h2>
                <button
                  onClick={() => clearCart(user ? true : false, token)}
                  className="py-1 px-3 bg-primary hover:bg-primary-hover font-light text-white transition duration-200 font-mons"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-col justify-between h-full pt-3 pb-10">
                <div className="h-[70%] overflow-scroll scrollbar-none">
                  {items.map((item: Cart) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>

                <div className="text-sm">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>£ {getTotalPrice().toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery</p>
                    <p>
                      {getTotalPrice() > 1000 ? (
                        <span className="text-tertiary">Free</span>
                      ) : (
                        "£ 20"
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Total</p>
                    <p>
                      £{" "}
                      {(
                        getTotalPrice() + (getTotalPrice() > 1000 ? 0 : 20)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <Link href="/checkout" className="block mt-5">
                    <DropdownMenuItem className="font-mons cursor-pointer flex justify-center items-center w-full py-2 px-3 bg-primary hover:bg-primary-hover focus:bg-primary-hover focus:text-white text-white transition duration-200">
                      Checkout
                    </DropdownMenuItem>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-lg lg:text-xl font-mons tracking-wider">
              No items in cart
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartComp;
