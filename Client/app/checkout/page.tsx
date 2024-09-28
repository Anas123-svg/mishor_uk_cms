import Checkout from "@/components/pages/checkout";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Mishor",
  description:
    "Complete your order by providing your shipping and payment details.",
};

const page = () => {
  return <Checkout />;
};

export default page;
