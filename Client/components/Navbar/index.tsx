import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CiUser } from "react-icons/ci";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Profile from "../profile";
import toast from "react-hot-toast";
import Cart from "../cart";
import Wishlist from "../wishlist";
import { VscChevronDown } from "react-icons/vsc";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { logout } from "@/hooks/auth";
import { Category } from "@/types";
import axios from "axios";

const Navbar = () => {
  const { initCart } = useCartStore();
  const [activeDropdown, setActiveDropdown] = useState(false);
  const { initWishlist } = useWishlistStore();
  const { user, setToken, setUser } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/category`
      );
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      initCart(user.cart);
      initWishlist(user.wishlist);
    }
  }, [user]);

  return (
    <div className="top-0 z-50 fixed bg-white shadow-lg text-black border-b border-gray-200 px-6 md:px-16 lg:px-24 py-5 w-full flex items-center justify-between">
      <Link href="/">
        <img
          src={logo.src}
          alt="logo"
          className="w-12 hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="hidden md:flex space-x-6 lg:space-x-12 items-center justify-center text-sm">
        <Link
          href="/"
          className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
        >
          HOME
        </Link>
        <div
          onMouseEnter={() => setActiveDropdown(true)}
          onMouseLeave={() => setActiveDropdown(false)}
          className="relative"
        >
          <Link
            href="/products"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            SHOP
            <VscChevronDown className="ml-1" />
          </Link>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 w-[550px]"
            >
              <div className="mt-2 shadow-xl bg-white border border-gray-200 p-5 whitespace-nowrap w-full">
                <div className="w-full flex flex-wrap gap-10">
                  {categories.map((category, index) => (
                    <div key={index} className="flex flex-col">
                      <Link
                        href={`/products/${category.name}`}
                        className="border-b border-transparent hover:border-black transition duration-300 uppercase"
                      >
                        {category.name}
                      </Link>
                      <div className="mt-3 flex flex-col space-y-2">
                        {category.subCategories.length > 0 &&
                          category.subCategories.map(
                            (subCategory, subIndex) => (
                              <Link
                                key={subIndex}
                                href={`/products/${category.name}/${subCategory}`}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {subCategory}
                              </Link>
                            )
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <Link
          href="/search"
          className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
        >
          SEARCH
        </Link>
        <Link
          href="/about"
          className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
        >
          ABOUT US
        </Link>
        <Link
          href="/contact"
          className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
        >
          CONTACT
        </Link>
      </div>

      <div className="flex items-center space-x-3 md:space-x-5 font-medium">
        <Wishlist />
        <Cart />

        {user?.name ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none ring-0">
              <CiUser className="text-3xl text-gray-800 hover:text-gray-900 hover:scale-110 transition-transform duration-300 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg shadow-lg py-2 bg-white border border-gray-200">
              <Profile />
              <DropdownMenuItem
                className="text-center text-gray-700 hover:bg-gray-100 py-2 rounded-md transition-colors"
                onClick={() => {
                  logout();
                  setUser(null);
                  setToken(null);
                  toast.success("Logged out successfully");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <CiUser className="text-3xl text-gray-800 hover:text-gray-900 hover:scale-110 transition-transform duration-300 cursor-pointer" />
          </Link>
        )}

        <Sidebar color="#fff" />
      </div>
    </div>
  );
};

export default Navbar;
