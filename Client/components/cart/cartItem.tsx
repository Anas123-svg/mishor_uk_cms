import React from "react";
import { useCartStore } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { IoIosClose } from "react-icons/io";
import { Cart } from "@/types";
interface Props {
  item: Cart;
}

const CartItem = ({ item }: Props) => {
  const { user, token } = useAuthStore();
  const { addItem, removeItem, deleteItem, addQuantity } = useCartStore(
    (state) => state
  );
  return (
    <div className="mt-2 flex items-center border-b border-gray-300 drop-shadow-sm py-2">
      <img
        src={item.product.images[0]}
        alt={item.product.title}
        className="w-20 h-20 mr-4 object-cover"
      />
      <div className="flex-1">
        <h3 className="font-mons">{item.product.title}</h3>
        <p className="text-sm font-mons">
          £{" "}
          {(item.product.discountedPrice
            ? item.product.discountedPrice
            : item.product.price
          ).toLocaleString()}
        </p>
        <div className="flex items-center">
          <button
            onClick={() =>
              removeItem(item.product.id, user ? true : false, token)
            }
            className="transition duration-300 flex justify-center items-center bg-primary hover:bg-primary-hover text-white rounded-full mr-2 focus:outline-none text-sm w-5 h-5"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() =>
              addQuantity(item.product.id, user ? true : false, token)
            }
            className="transition duration-300 flex justify-center items-center bg-primary hover:bg-primary-hover text-white rounded-full ml-2 focus:outline-none text-sm w-5 h-5"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => deleteItem(item.product.id, user ? true : false, token)}
        className="transition duration-300 flex justify-center items-center text-white bg-primary hover:bg-primary-hover w-5 h-5 rounded-full focus:outline-none"
      >
        <IoIosClose />
      </button>
    </div>
  );
};

export default CartItem;
