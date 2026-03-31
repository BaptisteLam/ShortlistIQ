"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/app/TopBar";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import CriteriaExtractor from "@/components/app/CriteriaExtractor";
import ResumeUploader from "@/components/app/ResumeUploader";
import ProcessingView from "@/components/app/ProcessingView";
import ResultsTable from "@/components/app/ResultsTable";
import CandidateDrawer from "@/components/app/CandidateDrawer";
import { useScreening } from "@/hooks/useScreening";
import type { Candidate } from "@/types";

export default function ScreenPage() {
  const router = useRouter();
  const {
    jobDescription,
    setJobDescription,
    criteria,
    setCriteria,
    files,
    addFiles,
    removeFile,
    candidates,
    processing,
    progress,
    step,
    setStep,
    error,
    extractCriteria,
    processResumes,
  } = useScreening();

  const [extracting, setExtracting] = useState(false);
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  async function handleExtractCriteria() {
    setExtracting(true);
    await extractCriteria();
    setExtracting(false);
  }

  async function handleStartProcessing() {
    // Create screening first
    const res = await fetch("/api/screening/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle: criteria?.job_title || "Untitled",
        jobDescription,
        extractedCriteria: criteria,
        totalResumes: files.length,
      }),
    });

    if (!res.ok) return;

    const { id } = await res.json();
    setScreeningId(id);
    setStep(3);
    await processResumes(id);
  }

  const stepLabels = [
    "Job Description",
    "Upload Resumes",
    "Processing",
    "Results",
  ];

  return (
    <>
      <TopBar breadcrumb={`New screening / ${stepLabels[step - 1]}`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[720px] mx-auto">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 text-[13px] font-mono ${
                    i + 1 === step
                      ? "text-[#0A0A0A]"
                      : i + 1 < step
                      ? "text-[#1A7F37]"
                      : "text-[#9B9B9B]"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-[4px] flex items-center justify-center text-[12px] ${
                      i + 1 === step
                        ? "bg-[#0A0A0A] text-white"
                        : i + 1 < step
                        ? "bg-[#1A7F37] text-white"
                        : "bg-[#F5F5F5] text-[#9B9B9B]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && (
                  <div className="w-8 h-px bg-[#E5E5E5]" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Job Description */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.01em] mb-4">
                  Job description
                </h2>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>

              {jobDescription.length > 50 && !criteria && (
                <Button
                  onClick={handleExtractCriteria}
                  disabled={extracting}
                >
                  {extracting ? (
                    <span className="flex items-center gap-2">
                      Extracting
                      <span className="flex gap-0.5">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    </span>
                  ) : (
                    "Extract criteria"
                  )}
                </Button>
              )}

              {criteria && (
                <div className="border border-[#E5E5E5] rounded-[8px] p-4 bg-[#FAFAFA]">
                  <CriteriaExtractor
                    criteria={criteria}
                    onChange={setCriteria}
                  />
                </div>
              )}

              {criteria && (
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>
                    Continue to upload
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Upload Resumes */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
                Upload resumes
              </h2>
              <ResumeUploader
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
              />
              <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleStartProcessing}
                  disabled={files.length === 0}
                >
                  Screen {files.length} resume{files.length === 1 ? "" : "s"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
                Screening in progress
              </h2>
              <ProcessingView
                candidates={candidates}
                totalFiles={files.length}
                progress={progress}
              />
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && screeningId && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
                  Results
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/app")}
                >
                  Back to screenings
                </Button>
              </div>
              <ResultsTable
                candidates={candidates}
                screeningId={screeningId}
                onViewCandidate={setSelectedCandidate}
              />
              <CandidateDrawer
                candidate={selectedCandidate}
                open={selectedCandidate !== null}
                onClose={() => setSelectedCandidate(null)}
              />
            </div>
          )}

          {error && (
            <p className="mt-4 text-[13px] text-[#CF222E]">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
