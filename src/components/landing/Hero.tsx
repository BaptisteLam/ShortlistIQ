"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Briefcase, Sparkles, X } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/landing/AuthModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useUser();
  const router = useRouter();

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

  function handleLaunchAnalysis() {
    if (!jobDescription.trim() || files.length === 0) return;

    if (!user && !loading) {
      setShowAuth(true);
      return;
    }

    // Store data in sessionStorage and redirect to screening page
    const jobData = { jobDescription, fileNames: files.map((f) => f.name) };
    sessionStorage.setItem("landing_job_description", jobDescription);
    sessionStorage.setItem("landing_files_pending", "true");
    // We can't store File objects in sessionStorage, so redirect to the app flow
    router.push("/app/screen");
  }

  function handleAuthSuccess() {
    setShowAuth(false);
    sessionStorage.setItem("landing_job_description", jobDescription);
    sessionStorage.setItem("landing_files_pending", "true");
    router.push("/app/screen");
  }

  const canLaunch = jobDescription.trim().length > 0 && files.length > 0;

  return (
    <>
      <section className="pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="container-main">
          {/* Compact header */}
          <div className="text-center mb-8">
            <h1 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A]">
              Screen 100 resumes in 60 seconds.
            </h1>
            <p className="mt-3 text-[15px] md:text-[16px] text-[#6B6B6B] leading-relaxed max-w-[600px] mx-auto">
              Upload resumes. Paste a job description. Get a ranked shortlist
              with explanations. Built for recruiters who value speed over
              software.
            </p>
          </div>

          {/* Two-column upload area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[960px] mx-auto">
            {/* Left: Job Description */}
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase size={18} className="text-[#6B6B6B]" />
                <h3 className="text-[15px] font-semibold text-[#0A0A0A]">
                  Job Description
                </h3>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste your job description here..."
                className="w-full h-[220px] px-3 py-3 text-[14px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[6px] text-[#0A0A0A] placeholder:text-[#9B9B9B] transition-colors duration-200 focus:border-[#0A0A0A] focus:outline-none resize-none"
              />
            </div>

            {/* Right: Resume Upload */}
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-[#6B6B6B]" />
                <h3 className="text-[15px] font-semibold text-[#0A0A0A]">
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
                className={`w-full flex flex-col items-center justify-center cursor-pointer rounded-[6px] transition-all duration-150 ${
                  files.length > 0 ? "h-[120px]" : "h-[220px]"
                } ${
                  isDragging
                    ? "border-2 border-solid border-[#0A0A0A] bg-[#FAFAFA] scale-[1.005]"
                    : "border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA] hover:border-[#9B9B9B]"
                }`}
              >
                <Upload size={22} className="text-[#9B9B9B] mb-2" />
                <p className="text-[14px] text-[#6B6B6B] text-center px-4">
                  Drag & drop PDF resumes here
                </p>
                <p className="text-[12px] text-[#9B9B9B] mt-1">
                  or click to browse
                </p>
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

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-3 space-y-1.5 max-h-[90px] overflow-y-auto">
                  {files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between text-[13px] text-[#6B6B6B] bg-[#FAFAFA] rounded px-2.5 py-1.5"
                    >
                      <span className="truncate mr-2">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="text-[#9B9B9B] hover:text-[#CF222E] transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <p className="text-[12px] text-[#9B9B9B]">
                    {files.length} resume{files.length !== 1 ? "s" : ""} ready
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Launch button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLaunchAnalysis}
              disabled={!canLaunch}
              className={`inline-flex items-center gap-2 h-12 px-8 text-[16px] font-semibold rounded-[8px] transition-all duration-200 ${
                canLaunch
                  ? "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a] active:scale-[0.98] cursor-pointer"
                  : "bg-[#E5E5E5] text-[#9B9B9B] cursor-not-allowed"
              }`}
            >
              <Sparkles size={18} />
              Launch Analysis
            </button>
          </div>

          <p className="text-center mt-3 text-[13px] text-[#9B9B9B]">
            Start screening — free
          </p>
        </div>
      </section>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
