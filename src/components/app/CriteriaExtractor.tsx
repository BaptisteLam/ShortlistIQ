"use client";

import { X, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { ExtractedCriteria } from "@/types";
import { useState } from "react";

interface CriteriaExtractorProps {
  criteria: ExtractedCriteria;
  onChange: (criteria: ExtractedCriteria) => void;
}

export default function CriteriaExtractor({
  criteria,
  onChange,
}: CriteriaExtractorProps) {
  const [newTag, setNewTag] = useState("");
  const [addingTo, setAddingTo] = useState<"must_have" | "nice_to_have" | "deal_breakers" | null>(null);

  function removeItem(key: "must_have" | "nice_to_have" | "deal_breakers", index: number) {
    const updated = { ...criteria };
    updated[key] = updated[key].filter((_, i) => i !== index);
    onChange(updated);
  }

  function addItem() {
    if (!newTag.trim() || !addingTo) return;
    const updated = { ...criteria };
    updated[addingTo] = [...updated[addingTo], newTag.trim()];
    onChange(updated);
    setNewTag("");
    setAddingTo(null);
  }

  const sections: {
    key: "must_have" | "nice_to_have" | "deal_breakers";
    label: string;
  }[] = [
    { key: "must_have", label: "Must have" },
    { key: "nice_to_have", label: "Nice to have" },
    { key: "deal_breakers", label: "Deal breakers" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-[15px] font-medium text-[#0A0A0A]">
        Extracted criteria
      </h3>

      {criteria.experience_years && (
        <p className="text-[13px] text-[#6B6B6B]">
          Experience: {criteria.experience_years}+ years
        </p>
      )}
      {criteria.education && (
        <p className="text-[13px] text-[#6B6B6B]">
          Education: {criteria.education}
        </p>
      )}

      {sections.map(({ key, label }) => (
        <div key={key}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] text-[#9B9B9B]">{label}</span>
            <button
              onClick={() => setAddingTo(addingTo === key ? null : key)}
              className="text-[#9B9B9B] hover:text-[#0A0A0A] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {criteria[key].map((item, index) => (
              <Badge key={index} variant="outline">
                {label}: {item}
                <button
                  onClick={() => removeItem(key, index)}
                  className="ml-1.5 text-[#9B9B9B] hover:text-[#0A0A0A]"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          {addingTo === key && (
            <div className="flex gap-2 mt-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Type and press Enter"
                className="h-7 px-2 text-[13px] font-mono border border-[#E5E5E5] rounded-[4px] focus:border-[#0A0A0A] focus:outline-none"
                autoFocus
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
