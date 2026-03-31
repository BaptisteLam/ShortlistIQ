"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import ScoreBadge from "@/components/ui/ScoreBadge";
import Skeleton from "@/components/ui/Skeleton";
import type { Candidate } from "@/types";

interface ProcessingViewProps {
  candidates: Candidate[];
  totalFiles: number;
  progress: number;
}

export default function ProcessingView({
  candidates,
  totalFiles,
  progress,
}: ProcessingViewProps) {
  const remaining = totalFiles - candidates.length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-mono text-[#6B6B6B]">
            Processing resumes...
          </span>
          <span className="text-[13px] font-mono text-[#9B9B9B]">
            {candidates.length}/{totalFiles}
          </span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((c, i) => (
          <div
            key={c.id}
            className="border border-[#E5E5E5] rounded-[8px] p-4 bg-white fade-in-up"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <p className="text-[13px] text-[#9B9B9B] truncate mb-2">
              {c.file_name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-[#0A0A0A]">
                {c.candidate_name || "Unknown"}
              </span>
              {c.score !== null && c.match_level && (
                <ScoreBadge score={c.score} matchLevel={c.match_level} />
              )}
            </div>
            {c.analysis?.summary && (
              <p className="mt-2 text-[13px] text-[#6B6B6B] line-clamp-2">
                {c.analysis.summary}
              </p>
            )}
          </div>
        ))}

        {[...Array(remaining)].map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="border border-[#E5E5E5] rounded-[8px] p-4 bg-white processing-scan"
          >
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
