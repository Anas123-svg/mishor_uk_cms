"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types";

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is Mishor Compliance Services?",
    answer:
      "Mishor Compliance Services provides expert fire safety and health & safety solutions. With over 25 years of experience, we specialize in offering robust compliance tools, including fire extinguishers, alarms, detectors, and other health and safety equipment. Customers can order these products directly from our website.",
  },
  {
    id: 2,
    question: "How do I place an order on the Mishor website?",
    answer:
      "To place an order, simply browse our product categories, add the desired items to your cart, and proceed to checkout. You can also create an account to track your orders and access special offers.",
  },
  {
    id: 4,
    question: "Do you offer delivery across the UK?",
    answer:
      "Yes, we provide nationwide delivery across the UK. Shipping costs and delivery timelines will be shown at checkout based on your location and order size.",
  },
  {
    id: 5,
    question: "Can I save items to purchase later?",
    answer:
      "Yes, by creating an account, you can add items to your wishlist and purchase them later. This allows you to save the items you're interested in and come back to them when you're ready to buy.",
  },
  {
    id: 6,
    question: "What types of fire extinguishers do you sell?",
    answer:
      "We offer a variety of fire extinguishers including water, foam, CO2, and powder extinguishers, each designed for specific environments and fire risks. All can be ordered directly through our online store.",
  },
  {
    id: 7,
    question: "How do I know which fire extinguisher is right for my business?",
    answer:
      "Our website provides detailed descriptions and guidelines for each type of fire extinguisher. You can also contact our customer support for expert advice on choosing the right equipment for your specific fire risks.",
  },
  {
    id: 8,
    question:
      "Do you offer installation services for fire alarms and smoke detectors?",
    answer:
      "Yes, we provide installation services for all the fire safety equipment purchased from our website, including fire alarms and smoke detectors. You can add installation as an option during checkout.",
  },
];

const Faqs = () => {
  return (
    <div className="px-6 sm:px-8 md:px-16 lg:px-24 py-20">
      <h2 className="text-2xl md:text-3xl font-mons tracking-wider">
        Frequently Asked Questions (FAQs)
      </h2>
      <div className="mt-10">
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger className="md:text-lg font-mons border-b tracking-wide">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="md:text-base py-2">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Faqs;
