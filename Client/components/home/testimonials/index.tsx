import React from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Avinash Kr",
    position: "Co-Founder at XYZ",
    image:
      "https://res.cloudinary.com/dlxtcvj93/image/upload/v1725960867/ejp9vs3y9vfnqccg5frj.png",
    quote:
      "Like this video and ask your questions in the comment section, don't forget to Subscribe Easy Tutorials YouTube channel to watch more videos of website designing, digital marketing, and photoshop.",
  },
  {
    id: 2,
    name: "Bharat Kunal",
    position: "Manager at XYZ",
    image:
      "https://res.cloudinary.com/dlxtcvj93/image/upload/v1725960867/ejp9vs3y9vfnqccg5frj.png",
    quote:
      "Like this video and ask your questions in the comment section, don't forget to Subscribe Easy Tutorials YouTube channel to watch more videos of website designing, digital marketing, and photoshop.",
  },
  {
    id: 3,
    name: "Prabhakar D",
    position: "Founder / CEO at XYZ",
    image:
      "https://res.cloudinary.com/dlxtcvj93/image/upload/v1725960867/ejp9vs3y9vfnqccg5frj.png",
    quote:
      "Like this video and ask your questions in the comment section, don't forget to Subscribe Easy Tutorials YouTube channel to watch more videos of website designing, digital marketing, and photoshop.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl tracking-wider font-mons">Testimonials</h2>
        <p className="text-gray-600 mt-2">
          Subscribe Easy Tutorials YouTube channel to watch more videos.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="object-cover rounded-full w-full h-full"
              />
            </div>
            <p className="text-gray-600 mb-4">
              <span className="text-primary text-2xl font-bold">“</span>
              {testimonial.quote}
              <span className="text-primary text-2xl font-bold">”</span>
            </p>
            <h3 className="text-xl font-semibold text-gray-800">
              {testimonial.name}
            </h3>
            <p className="text-gray-500">{testimonial.position}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
