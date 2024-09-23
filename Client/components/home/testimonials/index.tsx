import React from "react";
import img1 from "@/assets/p1.jpg";
import img2 from "@/assets/p2.jpg";
import img3 from "@/assets/p3.jpg";

const testimonials = [
  {
    id: 1,
    name: "Harry Williams",
    image: img1.src,
    quote:
      "Mishor Compliance Services has been an invaluable partner in enhancing our workplace safety. Their expertise in health and safety compliance, combined with their range of safety gadgets like alarms and fire extinguishers, has truly made a difference in our daily operations.",
  },
  {
    id: 2,
    name: "Noah Benjamin",
    image: img2.src,
    quote:
      "The team at Mishor Compliance Services provided us with personalized health and safety solutions. Their consulting services and high-quality safety gadgets have helped us maintain a safer workplace environment while staying compliant with all regulations.",
  },
  {
    id: 3,
    name: "Mia Sophia",
    image: img3.src,
    quote:
      "With Mishor Compliance Services, we have been able to navigate the complex world of workplace safety effortlessly. Their bespoke advice, combined with top-notch safety gadgets, ensures we are always a step ahead in protecting our staff and assets.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl tracking-wider font-mons">Testimonials</h2>
        <p className="text-gray-600 mt-2">
          See what our clients have to say about our services.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-8 rounded-lg shadow-lg text-center hover:-translate-y-5 transition duration-300"
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
