import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import img from "@/assets/contact.jpg";

const ContactUs = () => {
  return (
    <div className="pb-20 bg-gray-50">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-[50vh] mb-12">
        <img
          src={img.src}
          alt="contact"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="mt-10 relative z-10 flex flex-col items-center text-white text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mons tracking-wide">
            Contact Us
          </h1>
          <p className="mt-4 max-w-lg text-base sm:text-lg md:text-xl">
            Our friendly and professional team is ready to assist you with all
            inquiries.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="bg-white p-4 sm:p-8 lg:p-12 shadow-lg ">
          {/* Grid layout for form and contact info */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form Section */}
            <div className="bg-primary text-white p-8 sm:p-10 lg:p-12 shadow-lg flex-grow ">
              <h2 className="text-2xl sm:text-3xl font-mons mb-6 text-center">
                Get In Touch
              </h2>
              <p className="text-center text-sm sm:text-base mb-8">
                Simply fill in the form below and one of our experienced
                consultants will contact you.
              </p>
              <form className="space-y-6">
                {/* Form Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Name"
                    required
                  />
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Post Code"
                    required
                  />
                </div>

                {/* Second Form Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Email Address"
                    required
                  />
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                {/* Textarea */}
                <textarea
                  className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any other information"
                  required
                ></textarea>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-white text-red-600 font-mons py-3 px-8 shadow-md hover:bg-gray-100 transition "
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info & Map Section */}
            <div className="flex-grow space-y-8">
              {/* Contact Info */}
              <div className="text-gray-700">
                <h2 className="text-2xl sm:text-3xl font-mons mb-4">
                  Contact Information
                </h2>
                <p className="mb-6">
                  Our friendly and professional team are on hand to assist with
                  all your inquiries for businesses and individuals.
                </p>
                <div className="flex items-center mb-4">
                  <FiPhone className="text-red-600 text-2xl sm:text-3xl mr-4" />
                  <p className="text-lg">01634 560996</p>
                </div>
                <div className="flex items-center mb-4">
                  <FiMail className="text-red-600 text-2xl sm:text-3xl mr-4" />
                  <p className="text-lg">office@mishor.co.uk</p>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-red-600 text-2xl sm:text-3xl mr-4 shrink-0" />
                  <p className="text-lg">
                    Mishor Compliance Services, 7 Bell Yard, WC2A 2JR
                  </p>
                </div>
              </div>

              {/* Map Section */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden shadow-lg ">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9931.751879965734!2d-0.111725!3d51.514354!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876051977970d55%3A0x7aaceebd13d09d2b!2s7%20Bell%20Yard%2C%20London%20WC2A%202JR%2C%20UK!5e0!3m2!1sen!2shr!4v1726998682931!5m2!1sen!2shr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
