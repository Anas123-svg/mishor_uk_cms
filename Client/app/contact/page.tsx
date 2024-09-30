import ContactUs from "@/components/pages/contact";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Mishor",
  description:
    "Our friendly and professional team is ready to assist you with all inquiries.",
};

const page = () => {
  return <ContactUs />;
};

export default page;
