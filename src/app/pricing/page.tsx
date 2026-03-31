import Navbar from "@/components/landing/Navbar";
import PricingCards from "@/components/landing/PricingCards";
import Footer from "@/components/landing/Footer";
import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ShortlistIQ",
  description: "Simple pricing for resume screening. Start free, upgrade when you need more.",
};

const comparisonFeatures = [
  { feature: "Resume screens / month", starter: "20", pro: "500" },
  { feature: "Active job descriptions", starter: "1", pro: "Unlimited" },
  { feature: "PDF export", starter: true, pro: true },
  { feature: "CSV export", starter: false, pro: true },
  { feature: "Priority processing", starter: false, pro: true },
  { feature: "Custom scoring criteria", starter: true, pro: true },
  { feature: "Candidate analysis reports", starter: true, pro: true },
  { feature: "Interview question generation", starter: true, pro: true },
];

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-[14px] font-mono text-[#0A0A0A]">{value}</span>;
  }
  return value ? (
    <Check size={18} className="text-[#1A7F37]" />
  ) : (
    <Minus size={18} className="text-[#E5E5E5]" />
  );
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-14">
        <PricingCards />
        <section className="pb-20 md:pb-24">
          <div className="container-main max-w-[720px]">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#0A0A0A] mb-10">
              Compare plans
            </h2>
            <div className="border border-[#E5E5E5] rounded-[8px] overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                    <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">Feature</th>
                    <th className="px-6 py-3 text-center font-medium text-[13px] text-[#9B9B9B]">Starter</th>
                    <th className="px-6 py-3 text-center font-medium text-[13px] text-[#9B9B9B]">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row) => (
                    <tr key={row.feature} className="border-b border-[#E5E5E5] last:border-b-0">
                      <td className="px-6 py-3 text-[14px] text-[#6B6B6B]">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center">
                          <FeatureCell value={row.starter} />
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center">
                          <FeatureCell value={row.pro} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
