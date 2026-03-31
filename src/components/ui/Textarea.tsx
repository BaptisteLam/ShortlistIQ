"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3 py-3 text-[15px] bg-white border border-[#E5E5E5] rounded-[4px] text-[#0A0A0A] placeholder:text-[#9B9B9B] transition-colors duration-200 focus:border-[#0A0A0A] focus:outline-none resize-vertical min-h-[200px]",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
