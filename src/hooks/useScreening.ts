"use client";

import { useState, useEffect } from "react";
import type { ExtractedCriteria, Candidate } from "@/types";

export function useScreening() {
  const [jobDescription, setJobDescription] = useState("");
  const [criteria, setCriteria] = useState<ExtractedCriteria | null>(null);

  // Hydrate job description from landing page sessionStorage
  useEffect(() => {
    const savedJd = sessionStorage.getItem("landing_job_description");
    if (savedJd) {
      setJobDescription(savedJd);
      sessionStorage.removeItem("landing_job_description");
      sessionStorage.removeItem("landing_files_pending");
    }
  }, []);
  const [files, setFiles] = useState<File[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState<string | null>(null);

  async function extractCriteria() {
    setError(null);
    try {
      const res = await fetch("/api/screening/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      if (!res.ok) throw new Error("Failed to extract criteria");
      const data = await res.json();
      setCriteria(data);
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  function addFiles(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 100));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function processResumes(screeningId: string) {
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("screeningId", screeningId);
      files.forEach((file) => formData.append("resumes", file));

      const res = await fetch("/api/screening/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Processing failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n").filter(Boolean);

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.type === "progress") {
                setProgress(data.progress);
              } else if (data.type === "candidate") {
                setCandidates((prev) => [...prev, data.candidate]);
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }

      setStep(4);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setProcessing(false);
    }
  }

  return {
    jobDescription,
    setJobDescription,
    criteria,
    setCriteria,
    files,
    addFiles,
    removeFile,
    candidates,
    setCandidates,
    processing,
    progress,
    step,
    setStep,
    error,
    extractCriteria,
    processResumes,
  };
}
