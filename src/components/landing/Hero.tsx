"use client";

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  X,
  CheckCircle2,
} from "lucide-react";
import AuthModal from "@/components/landing/AuthModal";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function Hero() {
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function validateAndAddFiles(newFiles: FileList | File[]) {
    setFileError(null);
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Max 5MB per file.");
        continue;
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setFileError("PDF files only.");
        continue;
      }
      valid.push(file);
    }
    if (valid.length) {
      setFiles((prev) => [...prev, ...valid]);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    validateAndAddFiles(e.dataTransfer.files);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
      e.target.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleLaunchAnalysis() {
    if (!jobDescription.trim() || files.length === 0) return;

    // Lazy auth check - only when user clicks analyze
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        sessionStorage.setItem("landing_job_description", jobDescription);
        sessionStorage.setItem("landing_files_pending", "true");
        window.location.href = "/app/screen";
        return;
      }
    } catch {
      // Supabase not configured or network error - show auth modal
    }

    setShowAuth(true);
  }

  function handleAuthSuccess() {
    setShowAuth(false);
    sessionStorage.setItem("landing_job_description", jobDescription);
    sessionStorage.setItem("landing_files_pending", "true");
    window.location.href = "/app/screen";
  }

  const canLaunch = jobDescription.trim().length > 0 && files.length > 0;

  return (
    <>
      <section className="pt-20 pb-6 md:pt-24 md:pb-10 relative overflow-hidden">
        {/* Floating resume shapes in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="floating-doc floating-doc-1" />
          <div className="floating-doc floating-doc-2" />
          <div className="floating-doc floating-doc-3" />
          <div className="floating-doc floating-doc-4" />
          <div className="floating-doc floating-doc-5" />
        </div>

        <div className="container-main relative z-10">
          {/* Compact header with text reveal */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E5E5E5] bg-white/80 backdrop-blur-sm mb-5 hero-tag">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A7F37] animate-pulse" />
              <span className="text-[12px] font-mono text-[#6B6B6B] tracking-wide uppercase">
                AI-Powered Screening
              </span>
            </div>
            <h1 className="text-[26px] md:text-[36px] font-semibold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A] hero-title">
              Screen 100 resumes in 60 seconds.
            </h1>
            <p className="mt-3 text-[15px] md:text-[16px] text-[#6B6B6B] leading-relaxed max-w-[540px] mx-auto hero-subtitle">
              Upload resumes. Paste a job description. Get a ranked shortlist
              with explanations. Built for recruiters who value speed over
              software.
            </p>
          </div>

          {/* Two-column upload area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[960px] mx-auto hero-panels">
            {/* Left: Job Description */}
            <div className="bg-white border border-[#E5E5E5] rounded-[10px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group hover:border-[#C5C5C5] transition-all duration-300">
              {/* Paper stack effect */}
              <div className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-[10px] -z-10 translate-y-[3px] translate-x-[2px] rotate-[0.5deg] opacity-60" />
              <div className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-[10px] -z-20 translate-y-[6px] translate-x-[4px] rotate-[1deg] opacity-30" />

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-[6px] bg-[#F5F5F5] flex items-center justify-center">
                  <Briefcase size={15} className="text-[#6B6B6B]" />
                </div>
                <h3 className="text-[14px] font-semibold text-[#0A0A0A] tracking-[-0.01em]">
                  Job Description
                </h3>
              </div>
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste your job description here..."
                  className="w-full h-[200px] px-3 py-3 text-[13px] leading-relaxed bg-[#FAFAFA] border border-[#E5E5E5] rounded-[6px] text-[#0A0A0A] placeholder:text-[#BCBCBC] transition-colors duration-200 focus:border-[#0A0A0A] focus:outline-none resize-none font-[inherit]"
                />
                {/* Scanning line animation when text is being typed */}
                {jobDescription.length > 0 && (
                  <div className="absolute top-0 left-0 right-0 h-full pointer-events-none rounded-[6px] overflow-hidden">
                    <div className="scan-line" />
                  </div>
                )}
              </div>
              {jobDescription.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 criteria-check">
                  <CheckCircle2 size={13} className="text-[#1A7F37]" />
                  <span className="text-[12px] text-[#1A7F37] font-medium">
                    Job description ready
                  </span>
                </div>
              )}
            </div>

            {/* Right: Resume Upload */}
            <div className="bg-white border border-[#E5E5E5] rounded-[10px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group hover:border-[#C5C5C5] transition-all duration-300">
              {/* Paper stack effect */}
              <div className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-[10px] -z-10 translate-y-[3px] -translate-x-[2px] -rotate-[0.5deg] opacity-60" />
              <div className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-[10px] -z-20 translate-y-[6px] -translate-x-[4px] -rotate-[1deg] opacity-30" />

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-[6px] bg-[#F5F5F5] flex items-center justify-center">
                  <FileText size={15} className="text-[#6B6B6B]" />
                </div>
                <h3 className="text-[14px] font-semibold text-[#0A0A0A] tracking-[-0.01em]">
                  Resumes
                </h3>
              </div>

              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full flex flex-col items-center justify-center cursor-pointer rounded-[6px] transition-all duration-200 ${
                  files.length > 0 ? "h-[100px]" : "h-[200px]"
                } ${
                  isDragging
                    ? "border-2 border-solid border-[#0A0A0A] bg-[#FAFAFA] scale-[1.01]"
                    : "border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA] hover:border-[#9B9B9B] hover:bg-[#F5F5F5]"
                }`}
              >
                <div
                  className={`flex flex-col items-center transition-transform duration-300 ${
                    isDragging ? "scale-110" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center mb-2">
                    <Upload size={18} className="text-[#9B9B9B]" />
                  </div>
                  <p className="text-[13px] text-[#6B6B6B] text-center">
                    Drag & drop PDF resumes
                  </p>
                  <p className="text-[11px] text-[#BCBCBC] mt-0.5">
                    or click to browse
                  </p>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {fileError && (
                <p className="mt-2 text-[12px] text-[#CF222E]">{fileError}</p>
              )}

              {/* File list with staggered animation */}
              {files.length > 0 && (
                <div className="mt-3 space-y-1 max-h-[88px] overflow-y-auto">
                  {files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between text-[12px] text-[#6B6B6B] bg-[#FAFAFA] border border-[#F0F0F0] rounded-[4px] px-2.5 py-1.5 file-row"
                      style={
                        {
                          "--delay": `${i * 60}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={12} className="text-[#9B9B9B] flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="text-[#BCBCBC] hover:text-[#CF222E] transition-colors flex-shrink-0 ml-2"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 mt-1 criteria-check">
                    <CheckCircle2 size={13} className="text-[#1A7F37]" />
                    <span className="text-[12px] text-[#1A7F37] font-medium">
                      {files.length} resume{files.length !== 1 ? "s" : ""} ready
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Launch button */}
          <div className="flex flex-col items-center mt-8">
            <button
              onClick={handleLaunchAnalysis}
              disabled={!canLaunch}
              className={`launch-btn inline-flex items-center gap-2.5 h-[52px] px-10 text-[15px] font-semibold rounded-[10px] transition-all duration-300 ${
                canLaunch
                  ? "bg-[#0A0A0A] text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] active:scale-[0.98] cursor-pointer"
                  : "bg-[#F0F0F0] text-[#BCBCBC] cursor-not-allowed"
              }`}
            >
              <Sparkles
                size={17}
                className={canLaunch ? "animate-subtle-sparkle" : ""}
              />
              Launch Analysis
            </button>
            <p className="mt-3 text-[12px] text-[#BCBCBC] tracking-wide">
              Start screening — free
            </p>
          </div>
        </div>
      </section>

      {mounted && (
        <AuthModal
          open={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
