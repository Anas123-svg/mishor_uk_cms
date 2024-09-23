import { useState } from "react";
import { motion } from "framer-motion";
import { navLinks } from "@/constants";
import Link from "next/link";
import Profile from "../profile";
import Wishlist from "../wishlist";
import Cart from "../cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAuthStore from "@/store/authStore";
import { logout } from "@/hooks/auth";

const variants = {
  initial: {
    scaleX: 0,
  },
  open: {
    scaleX: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  closed: {
    scaleX: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};
const Sidebar = ({ color }: { color: string }) => {
  const { user, setUser, setToken } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <motion.div className="md:hidden" animate={open ? "open" : "closed"}>
      <motion.div
        className="text-3xl font-bold z-50 fixed top-0 flex items-center px-5 py-10 right-0 bottom-0 bg-primary w-full text-black origin-right h-screen"
        variants={variants}
      >
        <ul className="space-y-4 w-full max-h-[75vh] overflow-scroll px-5">
          {navLinks.map((link, index) => (
            <li key={index}>
              {link.children ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-lg font-semibold text-gray-900 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition duration-300">
                      {link.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="pl-4 pt-2 mt-2 space-y-1 text-lg text-gray-800 bg-white rounded-md shadow-inner">
                        {link.children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <Link
                              onClick={() => setOpen(false)}
                              href={child.href}
                              className="test-base font-light block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  onClick={() => setOpen(false)}
                  href={link.href}
                  className="block px-4 py-3 text-lg font-semibold text-gray-900 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition duration-300"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link
              onClick={() => setOpen(false)}
              href="/shipping-policy"
              className="block px-4 py-3 text-lg font-semibold text-gray-900 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition duration-300"
            >
              Shipping Policy
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setOpen(false)}
              href="/return-policy"
              className="block px-4 py-3 text-lg font-semibold text-gray-900 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition duration-300"
            >
              Return Policy
            </Link>
          </li>
        </ul>

        {user?.name ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none ring-0 fixed bottom-5 right-5 pb-2 px-5">
              <div className="pb-2 px-5 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
                <div className="absolute bottom-0 right-0 bg-primary h-full w-full -z-10 group-hover:scale-x-90 group-hover:scale-y-75 transition-all duration-200" />
                <span className="relative text-sm">Hi, {user?.name}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div onClick={() => setOpen(false)}>
                <Profile />
              </div>
              <DropdownMenuItem
                className="cursor-pointer text-center block"
                onClick={() => {
                  logout();
                  setUser(null);
                  setToken(null);
                  toast.success("Logged out successfully");
                  setOpen(false);
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div
            className="fixed bottom-5 right-5"
            onClick={() => setOpen(false)}
          >
            <Link
              href="/login"
              className="pb-2 px-5 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200"
            >
              <div className="absolute bottom-0 right-0 bg-primary h-full w-full -z-10 group-hover:scale-x-90 group-hover:scale-y-75 transition-all duration-200" />
              <span className="relative text-sm">Login/Signup</span>
            </Link>
          </div>
        )}
        <div className="fixed top-[18px] right-20 space-x-3">
          <Wishlist />
          <Cart />
        </div>
      </motion.div>
      <button
        className={
          color == "#fff"
            ? "fixed z-50 top-[30px] right-8"
            : "fixed z-50 top-10 right-8"
        }
        onClick={() => setOpen((prev: any) => !prev)}
      >
        <svg width="25" height="25" viewBox="0 0 23 23">
          <motion.path
            strokeWidth="1.5"
            stroke={color}
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
          />
          <motion.path
            strokeWidth="1.5"
            stroke={color}
            strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
          />
          <motion.path
            strokeWidth="1.5"
            stroke={color}
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
            }}
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default Sidebar;
