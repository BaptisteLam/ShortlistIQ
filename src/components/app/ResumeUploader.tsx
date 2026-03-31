"use client";

import { X } from "lucide-react";
import DropZone from "@/components/ui/DropZone";
import { formatFileSize } from "@/lib/utils";

interface ResumeUploaderProps {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function ResumeUploader({
  files,
  onAdd,
  onRemove,
}: ResumeUploaderProps) {
  return (
    <div>
      <DropZone onFiles={onAdd} />

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-[13px] font-mono text-[#6B6B6B] mb-3">
            {files.length} resume{files.length === 1 ? "" : "s"} ready
          </p>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between py-2 px-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-[4px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[14px] text-[#0A0A0A] truncate">
                    {file.name}
                  </span>
                  <span className="text-[12px] font-mono text-[#9B9B9B] flex-shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="text-[#9B9B9B] hover:text-[#CF222E] transition-colors flex-shrink-0 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
