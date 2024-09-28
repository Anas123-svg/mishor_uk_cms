import Products from "@/components/pages/products";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Mishor",
  description:
    "Discover premium health and safety equipment designed to protect your business. Explore our range of compliance tools, safety gear, and solutions built for reliability and effectiveness. Equip your workplace with the essentials to ensure safety and compliance!",
};

const page = () => {
  return <Products />;
};

export default page;
