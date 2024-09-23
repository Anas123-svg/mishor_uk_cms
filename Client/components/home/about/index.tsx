import React from "react";

const AboutUs = () => {
  return (
    <section className="relative bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-mons tracking-wider">
          About <span className="text-primary">GYMGear</span>
        </h2>
        <p className="mt-4 font-light text-lg text-gray-600 max-w-2xl mx-auto">
          At GYMGear, we believe in more than just fitness. We create gear that
          empowers you to be the best version of yourself, blending performance
          and style seamlessly. Our mission is to deliver high-quality, durable
          gym wear that moves with you through every rep, run, and recovery.
        </p>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6">
            <h3 className="text-2xl font-mons text-gray-800">Performance</h3>
            <p className="mt-4 text-gray-600 font-light">
              We prioritize performance above all, designing each piece with
              cutting-edge fabric technology to ensure you stay comfortable and
              focused, no matter the intensity.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6">
            <h3 className="text-2xl font-mons text-gray-800">Style</h3>
            <p className="mt-4 text-gray-600 font-light">
              Our apparel isn't just built for the gym — it's designed for life.
              With sleek, modern designs, you'll feel confident wearing it from
              workout to hangout.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white shadow-lg  p-6">
            <h3 className="text-2xl font-mons text-gray-800">Community</h3>
            <p className="mt-4 text-gray-600 font-light">
              We are more than a brand — we’re a community. We’re here to
              support and motivate you through every step of your fitness
              journey.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600">
          Join us and experience gym wear that moves with you, empowers you, and
          elevates your workout game.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
