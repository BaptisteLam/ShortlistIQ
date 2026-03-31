"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-10 px-3 text-[15px] bg-white border border-[#E5E5E5] rounded-[4px] text-[#0A0A0A] placeholder:text-[#9B9B9B] transition-colors duration-200 focus:border-[#0A0A0A] focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
