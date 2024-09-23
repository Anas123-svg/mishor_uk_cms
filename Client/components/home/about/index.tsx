import React from "react";
import img1 from "@/assets/habout1.png";
import img2 from "@/assets/habout2.png";
import img3 from "@/assets/habout3.png";

const AboutUs = () => {
  return (
    <section className="relative bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-mons tracking-wider">
          About <span className="text-primary">Mishor</span>
        </h2>
        <p className="mt-4 font-light text-lg text-gray-600 max-w-2xl mx-auto">
          At Mishor Compliance Services, our Health and Safety Consulting
          services are crafted to guide your business through the intricacies of
          workplace safety, ensuring compliance with current legislation and
          fostering a culture of continuous improvement.
        </p>
        <p className="mt-2 font-light text-lg text-gray-600 max-w-2xl mx-auto">
          Our expert consultants act as your partners, providing bespoke advice
          and practical solutions tailored to your unique operational needs.
        </p>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6 min-h-[40vh] hover:-translate-y-5 transition duration-300">
            <div className="flex flex-col items-center">
              <img src={img1.src} className="w-20" />
              <h3 className="text-xl mt-3 font-mons text-gray-800">
                HEALTH AND SAFETY
              </h3>
            </div>
            <p className="mt-4 text-gray-600 font-light">
              Our Health and Safety services stand as a pillar of operational
              excellence, ensuring that your workplace is a paragon of safety
              and compliance.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6 min-h-[40vh] hover:-translate-y-5 transition duration-300">
            <div className="flex flex-col items-center">
              <img src={img2.src} className="w-20" />
              <h3 className="text-xl mt-3 font-mons text-gray-800">
                FIRE SAFETY
              </h3>
            </div>
            <p className="mt-4 text-gray-600 font-light">
              Mishor Compliance Services delivers an encompassing range of fire
              safety provisions designed to equip your business with the tools
              and knowledge required for impeccable fire safety standards.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6 min-h-[40vh] hover:-translate-y-5 transition duration-300">
            <div className="flex flex-col items-center">
              <img src={img3.src} className="w-20" />
              <h3 className="text-xl mt-3 font-mons text-gray-800">
                OTHER SERVICES
              </h3>
            </div>
            <p className="mt-4 text-gray-600 font-light">
              Mishor Compliance Services invites you to join a growing portfolio
              of clients who trust us to safeguard their businesses. Let’s
              embark on a journey towards a safer, more compliant future
              together.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600">
          Join us and experience the difference in quality and service.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
