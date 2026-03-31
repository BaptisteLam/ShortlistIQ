"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          size === "default" && "h-10 px-5 text-[15px]",
          size === "small" && "h-8 px-3 text-[13px]",
          "rounded-[6px]",
          variant === "primary" &&
            "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a]",
          variant === "secondary" &&
            "bg-white text-[#0A0A0A] border border-[#E5E5E5] hover:border-[#0A0A0A]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
