"use client";
import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import img from "@/assets/contact.jpg";
import axios from "axios";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      name === "" ||
      email === "" ||
      phone === "" ||
      postcode === "" ||
      message === ""
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (message.length < 10) {
      toast.error("Message must be at least 10 characters long");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        name,
        email,
        phone,
        postal_code: postcode,
        message,
      });
      toast.success("Message sent successfully");
      setName("");
      setEmail("");
      setPhone("");
      setPostcode("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

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
              <form className="space-y-6 text-black">
                {/* Form Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Post Code"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                </div>

                {/* Second Form Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Textarea */}
                <textarea
                  className="w-full p-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any other information"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-primary-hover text-white font-mons py-3 px-8 shadow-md hover:shadow-xl transition duration-300"
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
