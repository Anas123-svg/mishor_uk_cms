"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import logo from "@/assets/logoWhite.webp";
import { motion } from "framer-motion";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { loginBack } from "@/hooks/auth";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser, setToken } = useAuthStore();
  const { initCart } = useCartStore();
  const { initWishlist } = useWishlistStore();

  useEffect(() => {
    handleLoginBack();
  }, []);

  useEffect(() => {
    if (user) {
      initCart(user.carts);
      initWishlist(user.wishlists);
    }
  }, [user]);

  const handleLoginBack = async () => {
    try {
      const res = await loginBack();
      if (!res) {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        return;
      }
      if (res?.user) setUser(res.user);
      if (res?.token) setToken(res.token);
    } catch (error: any) {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      toast.error(error.message);
    }
  };

  return (
    <html lang="en">
      <body className="tracking-wide">
        <motion.div
          className="w-screen h-screen bg-primary fixed top-0 left-0 flex justify-center items-center"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: 0,
            display: "none",
            transition: {
              duration: 1,
              delay: 1,
            },
          }}
        >
          <motion.div
            className="w-full h-full bg-secondary origin-bottom-right absolute -z-10"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              transition: {
                duration: 0.5,
                delay: 0.5,
              },
            }}
          />
          <motion.div
            initial={{ transform: "translateY(0)", opacity: 1 }}
            animate={{
              transform: "translateY(-200px)",
              opacity: 0,
              transition: { duration: 1, delay: 1 },
            }}
            className="bg-secondary p-3"
          >
            <img src={logo.src} alt="Mishor" className="w-52" />
          </motion.div>
        </motion.div>
        <motion.div>
          <Navbar />
          <div>{children}</div>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#212F38",
                color: "#FDF8EC",
              },
            }}
          />
          {/* <WhatsApp /> */}
        </motion.div>
      </body>
    </html>
  );
}
