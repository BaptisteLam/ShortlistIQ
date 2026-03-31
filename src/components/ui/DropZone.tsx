"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
}

export default function DropZone({
  onFiles,
  accept = ".pdf",
  maxSize = 5 * 1024 * 1024,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFiles(files: FileList | File[]): File[] {
    const valid: File[] = [];
    const fileArr = Array.from(files);
    for (const file of fileArr) {
      if (file.size > maxSize) {
        setError(`File too large. Maximum 5MB per resume.`);
        continue;
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setError("PDF resumes only.");
        continue;
      }
      valid.push(file);
    }
    return valid;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const valid = validateFiles(e.dataTransfer.files);
    if (valid.length) onFiles(valid);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (e.target.files) {
      const valid = validateFiles(e.target.files);
      if (valid.length) onFiles(valid);
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full h-40 flex flex-col items-center justify-center cursor-pointer rounded-[8px] transition-all duration-150 ${
          isDragging
            ? "border-2 border-solid border-[#0A0A0A] bg-[#FAFAFA] scale-[1.005]"
            : "border-2 border-dashed border-[#E5E5E5] bg-white hover:border-[#9B9B9B]"
        }`}
      >
        <Upload size={24} className="text-[#9B9B9B] mb-3" />
        <p className="text-[15px] text-[#6B6B6B]">
          Drop PDF resumes here or click to browse
        </p>
      </div>
      {error && (
        <p className="mt-2 text-[13px] text-[#CF222E]">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
