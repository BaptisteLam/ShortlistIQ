import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 text-[13px] font-mono rounded-[4px]",
        variant === "default" && "bg-[#F5F5F5] text-[#0A0A0A]",
        variant === "outline" && "border border-[#0A0A0A] bg-white text-[#0A0A0A]",
        className
      )}
    >
      {children}
    </span>
  );
}
