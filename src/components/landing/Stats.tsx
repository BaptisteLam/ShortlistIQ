"use client";

import AnimatedNumber from "@/components/ui/AnimatedNumber";

const stats = [
  { value: 60, suffix: "s", label: "Average time to screen 50 resumes" },
  { value: 85, suffix: "%", label: "Recruiter time saved on initial screening" },
  { value: 8, prefix: "$0.0", label: "Average cost per resume screened" },
];

export default function Stats() {
  return (
    <section className="py-20 md:py-24 bg-[#FAFAFA] border-y border-[#E5E5E5]">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-[48px] font-semibold text-[#0A0A0A] leading-none">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="font-mono"
                />
              </div>
              <p className="mt-3 text-[15px] text-[#6B6B6B]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
