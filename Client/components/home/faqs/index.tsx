"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types";
import axios from "axios";

const Faqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/faq`
      );
      setFaqs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="px-6 sm:px-8 md:px-16 lg:px-24 py-20">
      <h2 className="text-2xl md:text-3xl font-mons tracking-wider">
        Frequently Asked Questions about GYMGear
      </h2>
      <div className="mt-10">
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq._id} value={`item-${faq._id}`}>
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
