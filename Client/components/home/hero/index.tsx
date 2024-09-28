"use client";
import Link from "next/link";
import React, { useRef, useEffect } from "react";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className="h-dvh relative">
      <video
        ref={videoRef}
        src="/video.mp4"
        muted
        autoPlay
        loop
        className="w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-12 lg:px-24 tracking-widest">
        <div className="w-full md:w-4/5 lg:w-3/5 mt-10 sm:mt-20">
          {/* Responsive heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase font-mons">
            EXPERT HEALTH AND SAFETY CONSULTANTS
          </h1>
          {/* Responsive paragraph */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white my-6 sm:my-8 md:my-10 font-extralight">
            Welcome to Mishor Compliance Services – where unparalleled expertise
            meets the bespoke needs of your enterprise. For over a quarter of a
            century, we have stood at the forefront of fire safety and health &
            safety services, empowering businesses across the UK with robust
            compliance solutions.
          </p>
          {/* Responsive button */}
          <Link
            href="/products"
            className="inline-block bg-primary hover:bg-primary-hover transition duration-200 text-white px-4 py-2 sm:px-6 sm:py-3 uppercase font-mons text-sm md:text-base"
          >
            TO THE CATALOGUE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
