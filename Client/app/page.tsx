"use client";
import Discover from "@/components/home/discover";
import About from "@/components/home/about";
import Hero from "@/components/home/hero";
import Testimonials from "@/components/home/testimonials";
import React from "react";
import Faqs from "@/components/home/faqs";
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
