import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container-main max-w-[720px]">
        <h1 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A]">
          Screen 100 resumes in 60 seconds.
        </h1>
        <p className="mt-6 text-[18px] text-[#6B6B6B] leading-relaxed">
          Upload resumes. Paste a job description. Get a ranked shortlist with
          explanations. Built for recruiters who value speed over software.
        </p>
        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <Link href="/register">
            <Button>Start screening — free</Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary">See how it works</Button>
          </a>
        </div>
        <p className="mt-4 text-[13px] text-[#9B9B9B]">
          No credit card required · 20 free resume screens
        </p>
      </div>
    </section>
  );
}
