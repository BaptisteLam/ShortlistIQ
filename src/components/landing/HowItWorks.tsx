"use client";

import { Upload, FileText, BarChart3 } from "lucide-react";
import RevealSection from "@/components/landing/RevealSection";

const steps = [
  {
    icon: Upload,
    title: "Upload resumes",
    description: "Drag and drop PDF resumes. Process 1 or 100 at once.",
    step: "01",
  },
  {
    icon: FileText,
    title: "Paste the job description",
    description:
      "Paste or type the role requirements. ShortlistIQ extracts the criteria automatically.",
    step: "02",
  },
  {
    icon: BarChart3,
    title: "Get your shortlist",
    description:
      "Every resume scored 1-100, ranked, with a plain-English explanation of why.",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="container-main">
        <RevealSection>
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#0A0A0A]">
            How it works
          </h2>
        </RevealSection>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <RevealSection key={s.step} delay={i * 100}>
              <div className="bg-white border border-[#E5E5E5] rounded-[10px] p-6 relative group hover:border-[#C5C5C5] hover:-translate-y-[2px] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-[8px] bg-[#F5F5F5] flex items-center justify-center group-hover:bg-[#0A0A0A] transition-colors duration-300">
                    <s.icon
                      size={18}
                      className="text-[#6B6B6B] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <span className="font-mono text-[12px] text-[#BCBCBC] tracking-wider">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0A0A0A] mb-2">
                  {s.title}
                </h3>
                <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
                  {s.description}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
