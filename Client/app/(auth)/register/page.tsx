import Register from "@/components/pages/register";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Mishor",
  description: "Create an account to access exclusive features and benefits.",
};

const page = () => {
  return <Register />;
};

export default page;
