"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-[#E5E5E5] transition-all duration-200 ${
        scrolled ? "backdrop-blur-[10px]" : ""
      }`}
    >
      <div className="container-main flex items-center justify-between h-14">
        <Link href="/" className="text-[18px] font-semibold text-[#0A0A0A]">
          ShortlistIQ
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-[15px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-[15px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
          >
            Login
          </Link>
          <Link href="/register">
            <Button size="small">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
