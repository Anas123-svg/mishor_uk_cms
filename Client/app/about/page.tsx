import Faqs from "@/components/home/faqs";
import React from "react";
import img1 from "@/assets/about1.webp";
import img2 from "@/assets/about2.jpg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Mishor",
  description:
    "At Mishor Compliance Services, our Health and Safety Consulting services are crafted to guide your business through the intricacies of workplace safety, ensuring compliance with current legislation and fostering a culture of continuous improvement.",
};

const AboutUs = () => {
  return (
    <>
      <div className="pt-32 px-6 md:px-12 lg:px-24">
        <section className="bg-white text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 px-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wider mb-4">
                About Us
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                At Mishor Compliance Services, our Health and Safety Consulting
                services are crafted to guide your business through the
                intricacies of workplace safety, ensuring compliance with
                current legislation and fostering a culture of continuous
                improvement.
              </p>
              <p className="text-base md:text-lg text-gray-600 mt-2">
                Our expert consultants act as your partners, providing bespoke
                advice and practical solutions tailored to your unique
                operational needs.
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <img
                src={img1.src}
                alt="About Us Image"
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 px-6">
                <img
                  src={img2.src}
                  alt="Mission Image"
                  className="w-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 mt-8 md:mt-0 px-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wider mb-4">
                  Our Mission
                </h2>
                <p className="text-md text-gray-600 leading-relaxed">
                  Our mission is to provide high-quality, affordable health and
                  safety solutions that empower your business to operate at its
                  best. Whether you're ensuring fire safety, meeting compliance
                  standards, or protecting your workforce, we are here to help
                  you maintain a safe and compliant environment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wider mb-6">
              Our Story
            </h2>
            <p className="text-md text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Founded by a team of safety professionals, Mishor was born out of
              the need for accessible, high-quality safety solutions that go
              beyond expectations. We recognized the gap in the market for
              reliable, compliance-driven safety equipment that businesses can
              trust without overspending. Our journey began with a clear
              mission: to provide top-tier health and safety tools that combine
              effectiveness, durability, and affordability for businesses of all
              sizes.
            </p>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="p-5 text-center">
            <h2 className="text-2xl md:text-3xl font-mons tracking-wider mb-6">
              Mishor by the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-100 p-6">
                <h3 className="text-2xl font-mons text-gray-800 mb-4">
                  25+ Years
                </h3>
                <p className="text-md text-gray-600">
                  Experience in Health and Safety compliance services
                </p>
              </div>
              <div className="bg-gray-100 p-6">
                <h3 className="text-2xl font-mons text-gray-800 mb-4">
                  1,000+
                </h3>
                <p className="text-md text-gray-600">
                  Satisfied clients across various industries
                </p>
              </div>
              <div className="bg-gray-100 p-6">
                <h3 className="text-2xl font-mons text-gray-800 mb-4">50+</h3>
                <p className="text-md text-gray-600">
                  Businesses we’ve helped achieve compliance across the UK
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Faqs />
    </>
  );
};

export default AboutUs;
