import Link from "next/link";
import React from "react";
import img from "@/assets/hero.png";

const Hero = () => {
  return (
    <div className="h-dvh relative">
      <img src={img.src} className="object-cover w-full h-full" />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24 tracking-widest">
        <div className="w-3/5">
          <h1 className="text-4xl font-bold text-white uppercase font-mons">
            EXPERT HEALTH AND SAFETY CONSULTANTS
          </h1>
          <p className="text-xl text-white my-10 font-extralight">
            Welcome to Mishor Compliance Services – where unparalleled expertise
            meets the bespoke needs of your enterprise. For over a quarter of a
            century, we have stood at the forefront of fire safety and health &
            safety services, empowering businesses across the UK with robust
            compliance solutions.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-hover transition duration-200 text-white px-6 py-3 uppercase font-mons"
          >
            Explore Our Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
