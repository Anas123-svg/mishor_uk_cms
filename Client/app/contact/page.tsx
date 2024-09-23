import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const ContactUs = () => {
  return (
    <div className="pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-3xl text-gray-800">Contact Us</h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Our friendly and professional team are on hand to assist with all your
          enquiries for businesses and individuals.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-12 shadow-2xl">
        <div className="mb-12">
          <h2 className="text-3xl text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Reach out to us by filling out the contact form below, sending us an
            email, or giving us a call. We strive to respond to all inquiries
            within 24 hours.
          </p>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <div className="bg-gray-100 p-8 text-center shadow-md">
                <FiMail className="text-primary text-4xl mb-4 mx-auto" />
                <h3 className="text-2xl text-gray-800 mb-2">Email Us</h3>
                <p className="text-xs sm:text-base text-gray-600">
                  office@mishor.co.uk
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div className="bg-gray-100 p-8 text-center shadow-md">
                <FiPhone className="text-primary text-4xl mb-4 mx-auto" />
                <h3 className="text-2xl text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600">01634 560996</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl text-gray-800 mb-6">Contact Form</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg">Name</label>
              <input
                type="text"
                className="w-full mt-2 p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your Email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg">Message</label>
              <textarea
                className="w-full mt-2 p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-white py-3 px-8 shadow-lg transition duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-3xl text-gray-800 mb-6">Our Location</h2>
        <p className="text-gray-600 mb-8">
          Mishor Compliance Services, 7 Bell Yard, WC2A 2JR
        </p>
        <div className="relative w-full h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9931.751879965734!2d-0.111725!3d51.514354!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876051977970d55%3A0x7aaceebd13d09d2b!2s7%20Bell%20Yard%2C%20London%20WC2A%202JR%2C%20UK!5e0!3m2!1sen!2shr!4v1726998682931!5m2!1sen!2shr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
