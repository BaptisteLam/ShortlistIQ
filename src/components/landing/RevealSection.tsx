"use client";

import { useEffect, useRef, useState } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealSection({
  children,
  className = "",
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal-section ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
