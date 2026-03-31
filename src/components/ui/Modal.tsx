"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white border border-[#E5E5E5] rounded-[8px] p-6 max-w-md w-full mx-4 z-10">
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-[20px] font-semibold">{title}</h3>}
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors ml-auto"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
