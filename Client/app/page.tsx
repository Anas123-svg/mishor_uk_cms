import Discover from "@/components/home/discover";
import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Testimonials from "@/components/home/testimonials";
import React from "react";
import Faqs from "@/components/home/faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Mishor",
  description:
    "Mishor Compliance Services is a leading provider of Health and Safety Consulting services, offering bespoke solutions to businesses across the UK.",
};

const page = () => {
  return (
    <div className="min-h-[200vh]">
      <Hero />
      <About />
      <Discover />
      <Testimonials />
      <Faqs />
    </div>
  );
};

export default page;
