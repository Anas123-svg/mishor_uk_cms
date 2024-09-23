import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-100 pt-16 pb-10 relative">
      <div className="px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo and Brief Description */}
        <div>
          <Link href="/">
            <img src={logo.src} alt="logo" className="w-36" />
          </Link>
          <p className="mt-6 text-gray-400 leading-relaxed">
            Elevating your fitness game with high-performance gym wear designed
            for comfort, durability, and style.
          </p>
          <div className="mt-6 flex space-x-4">
            {/* Social Media Icons */}
            <a
              href="https://facebook.com"
              className="hover:text-blue-500 transition duration-300"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-blue-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-pink-500 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-blue-600 transition duration-300"
            >
              <FaLinkedinIn size={24} />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Subscribe to Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-gray-400 mb-4">
            Join our newsletter to get the latest updates and offers.
          </p>
          <form className="flex">
            <input
              type="email"
              className="bg-gray-800 text-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
              placeholder="Enter your email"
            />
            <button className="bg-primary text-white px-4 py-2 ml-2 hover:bg-primary-hover transition duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-12 lg:px-24">
          <p className="text-gray-500">© 2024 GYMGear. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
