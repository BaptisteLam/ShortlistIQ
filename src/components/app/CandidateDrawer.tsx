"use client";

import { useState } from "react";
import { Check, X, ChevronDown, ChevronRight, Download } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import type { Candidate } from "@/types";
import { getMatchColor } from "@/lib/utils";

interface CandidateDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

export default function CandidateDrawer({
  candidate,
  open,
  onClose,
}: CandidateDrawerProps) {
  const [showResumeText, setShowResumeText] = useState(false);

  if (!candidate) return null;

  const color = getMatchColor(candidate.match_level);
  const analysis = candidate.analysis;

  return (
    <Drawer open={open} onClose={onClose} title={candidate.candidate_name || "Candidate"}>
      <div className="space-y-8">
        {/* Score */}
        <div>
          <span
            className="font-mono text-[48px] font-semibold leading-none"
            style={{ color }}
          >
            {candidate.score}
          </span>
          <span
            className="ml-2 text-[15px] capitalize"
            style={{ color }}
          >
            {candidate.match_level} match
          </span>
        </div>

        {/* Match analysis */}
        {analysis?.summary && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Match analysis
            </h3>
            <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        )}

        {/* Experience match */}
        {analysis?.experience_match && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Experience
            </h3>
            <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
              {analysis.experience_match}
            </p>
          </div>
        )}

        {/* Skills matched */}
        {analysis?.skills_matched?.length > 0 && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Skills matched
            </h3>
            <div className="space-y-1.5">
              {analysis.skills_matched.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Check size={16} className="text-[#1A7F37] flex-shrink-0" />
                  <span className="text-[14px] text-[#6B6B6B]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing requirements */}
        {analysis?.skills_missing?.length > 0 && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Missing requirements
            </h3>
            <div className="space-y-1.5">
              {analysis.skills_missing.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <X size={16} className="text-[#CF222E] flex-shrink-0" />
                  <span className="text-[14px] text-[#6B6B6B]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {analysis?.strengths?.length > 0 && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Strengths
            </h3>
            <ul className="space-y-1.5">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="text-[14px] text-[#6B6B6B] flex items-start gap-2">
                  <span className="text-[#1A7F37] mt-0.5 flex-shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {analysis?.concerns?.length > 0 && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Concerns
            </h3>
            <ul className="space-y-1.5">
              {analysis.concerns.map((c, i) => (
                <li key={i} className="text-[14px] text-[#6B6B6B] flex items-start gap-2">
                  <span className="text-[#CF222E] mt-0.5 flex-shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested interview questions */}
        {analysis?.interview_questions?.length > 0 && (
          <div>
            <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-2">
              Suggested interview questions
            </h3>
            <ol className="space-y-2">
              {analysis.interview_questions.map((q, i) => (
                <li key={i} className="text-[14px] text-[#6B6B6B] flex gap-2">
                  <span className="font-mono text-[#9B9B9B] flex-shrink-0">
                    {i + 1}.
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Resume text */}
        {candidate.resume_text && (
          <div>
            <button
              onClick={() => setShowResumeText(!showResumeText)}
              className="flex items-center gap-2 text-[15px] font-medium text-[#0A0A0A]"
            >
              {showResumeText ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              Resume text
            </button>
            {showResumeText && (
              <pre className="mt-3 p-4 bg-[#F5F5F5] rounded-[4px] text-[13px] font-mono text-[#6B6B6B] whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto">
                {candidate.resume_text}
              </pre>
            )}
          </div>
        )}

        {/* Download */}
        <div className="pt-4 border-t border-[#E5E5E5]">
          <a href={`/api/export/pdf/${candidate.id}`} download>
            <Button variant="secondary" className="w-full">
              <Download size={16} className="mr-2" />
              Download analysis
            </Button>
          </a>
        </div>
      </div>
    </Drawer>
  );
}
