import ForgotPassword from "@/components/pages/forgotPassword";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Mishor",
  description: "Forgot your password? No worries, we'll help you reset it.",
};

const page = () => {
  return <ForgotPassword />;
};

export default page;
