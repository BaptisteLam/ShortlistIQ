"use client";

import { Upload, FileText, BarChart3 } from "lucide-react";
import Card from "@/components/ui/Card";

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
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#0A0A0A]">
          How it works
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Card
              key={s.step}
              hover
              className="fade-in-up"
              {...{ style: { animationDelay: `${i * 50}ms` } as React.CSSProperties }}
            >
              <div className="flex items-start justify-between mb-4">
                <s.icon size={20} className="text-[#6B6B6B]" />
                <span className="font-mono text-[13px] text-[#9B9B9B]">
                  {s.step}
                </span>
              </div>
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[#0A0A0A] mb-2">
                {s.title}
              </h3>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
                {s.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
