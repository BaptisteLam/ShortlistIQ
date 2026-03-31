import Link from "next/link";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/ month",
    features: [
      "20 resume screens / month",
      "1 active job description",
      "PDF export",
    ],
    cta: "Get started",
    ctaVariant: "secondary" as const,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    label: "Most popular",
    features: [
      "500 resume screens / month",
      "Unlimited job descriptions",
      "CSV + PDF export",
      "Priority processing",
    ],
    cta: "Start free trial",
    ctaVariant: "primary" as const,
    highlight: true,
  },
];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20 md:py-24">
      <div className="container-main">
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#0A0A0A]">
          Pricing
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[720px]">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#FAFAFA] rounded-[8px] p-6 flex flex-col ${
                plan.highlight
                  ? "border-2 border-[#0A0A0A]"
                  : "border border-[#E5E5E5]"
              }`}
            >
              {plan.label && (
                <span className="font-mono text-[13px] text-[#1A7F37] mb-2">
                  {plan.label}
                </span>
              )}
              <h3 className="text-[20px] font-semibold text-[#0A0A0A]">
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[36px] font-semibold tracking-[-0.03em] text-[#0A0A0A]">
                  {plan.price}
                </span>
                <span className="text-[15px] text-[#6B6B6B]">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={18} className="text-[#1A7F37] mt-0.5 flex-shrink-0" />
                    <span className="text-[15px] text-[#6B6B6B]">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/register" className="block">
                  <Button variant={plan.ctaVariant} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-[#6B6B6B]">
          Need more volume?{" "}
          <a href="mailto:contact@shortlistiq.com" className="text-[#0A0A0A] underline underline-offset-4">
            Contact us
          </a>
          .
        </p>
      </div>
    </section>
  );
}
