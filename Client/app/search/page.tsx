import SearchPage from "@/components/pages/search";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Mishor",
  description:
    "Easily find the right safety tools for your business. From tailored compliance services to essential health and safety equipment like fire extinguishers and alarms, discover everything you need to ensure a safer, more compliant workplace!",
};

const page = () => {
  return <SearchPage />;
};

export default page;
