"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-5 text-left"
          >
            <span className="text-[15px] font-medium text-[#0A0A0A]">
              {item.question}
            </span>
            <ChevronDown
              size={18}
              className={`text-[#6B6B6B] transition-transform duration-200 flex-shrink-0 ml-4 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-96 pb-5" : "max-h-0"
            }`}
          >
            <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
