import Accordion from "@/components/ui/Accordion";

const faqItems = [
  {
    question: "What file formats do you accept?",
    answer:
      "PDF resumes only. We process the full document including formatting.",
  },
  {
    question: "How accurate is the screening?",
    answer:
      "ShortlistIQ uses Claude AI to understand context, not just keywords. It reads resumes the way a senior recruiter would.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Resumes are processed and never stored permanently. We delete all uploaded files within 24 hours.",
  },
  {
    question: "Can I customize the scoring criteria?",
    answer:
      "Yes. You can add must-have requirements, nice-to-haves, and deal-breakers that adjust the scoring.",
  },
  {
    question: "What happens if I hit my screen limit?",
    answer:
      "You can upgrade anytime. Unused screens don't roll over.",
  },
  {
    question: "Do you integrate with my ATS?",
    answer:
      "Not yet. ShortlistIQ is a standalone screening tool. CSV export lets you import results anywhere.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-main max-w-[720px]">
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#0A0A0A] mb-10">
          Questions
        </h2>
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}
