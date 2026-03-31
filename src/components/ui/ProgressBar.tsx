"use client";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={`w-full h-1 bg-[#E5E5E5] overflow-hidden ${className || ""}`}>
      <div
        className="h-full bg-[#0A0A0A] transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
