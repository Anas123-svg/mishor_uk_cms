import ProductDetails from "@/components/pages/productDetails";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | Mishor",
  description:
    "Discover premium health and safety equipment designed to protect your business. Explore our range of compliance tools, safety gear, and solutions built for reliability and effectiveness. Equip your workplace with the essentials to ensure safety and compliance!",
};

const page = () => {
  return <ProductDetails />;
};

export default page;
