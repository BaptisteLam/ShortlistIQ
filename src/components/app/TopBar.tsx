"use client";

import { useUsage } from "@/hooks/useUsage";

interface TopBarProps {
  breadcrumb?: string;
}

export default function TopBar({ breadcrumb }: TopBarProps) {
  const { usage } = useUsage();

  return (
    <div className="h-12 border-b border-[#E5E5E5] px-6 flex items-center justify-between bg-white">
      <span className="text-[13px] text-[#9B9B9B]">
        {breadcrumb || "Screenings"}
      </span>
      {usage && (
        <span className="text-[13px] font-mono text-[#6B6B6B]">
          {usage.screens_used}/{usage.screens_limit} screens used
        </span>
      )}
    </div>
  );
}
