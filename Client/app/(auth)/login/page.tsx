import Login from "@/components/pages/login";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Mishor",
  description: "Login to your account.",
};

const page = () => {
  return <Login />;
};

export default page;
