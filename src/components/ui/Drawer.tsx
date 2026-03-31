"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Drawer({ open, onClose, children, title }: DrawerProps) {
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

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] max-w-full bg-white border-l border-[#E5E5E5] z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
          {title && <h2 className="text-[20px] font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors ml-auto"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}
