import QueryPage from "@/components/pages/query";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query | Mishor",
  description:
    "Easily find the right safety tools for your business. From tailored compliance services to essential health and safety equipment like fire extinguishers and alarms, discover everything you need to ensure a safer, more compliant workplace!",
};

const page = () => {
  return <QueryPage />;
};

export default page;
