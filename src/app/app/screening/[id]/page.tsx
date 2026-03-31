"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import TopBar from "@/components/app/TopBar";
import ResultsTable from "@/components/app/ResultsTable";
import CandidateDrawer from "@/components/app/CandidateDrawer";
import Skeleton from "@/components/ui/Skeleton";
import type { Screening, Candidate } from "@/types";

export default function ScreeningResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [screening, setScreening] = useState<Screening | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserSupabaseClient();

      const [screeningRes, candidatesRes] = await Promise.all([
        supabase.from("screenings").select("*").eq("id", id).single(),
        supabase
          .from("candidates")
          .select("*")
          .eq("screening_id", id)
          .order("score", { ascending: false }),
      ]);

      if (screeningRes.data) setScreening(screeningRes.data);
      if (candidatesRes.data) setCandidates(candidatesRes.data);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <TopBar breadcrumb="Loading..." />
        <div className="flex-1 p-6">
          <div className="max-w-[960px] mx-auto space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        breadcrumb={`Screenings / ${screening?.job_title || "Results"}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[960px] mx-auto">
          <div className="mb-6">
            <h1 className="text-[28px] font-semibold tracking-[-0.02em]">
              {screening?.job_title}
            </h1>
            <p className="text-[13px] text-[#9B9B9B] font-mono mt-1">
              {candidates.length} candidates screened
            </p>
          </div>

          <ResultsTable
            candidates={candidates}
            screeningId={id}
            onViewCandidate={setSelectedCandidate}
          />

          <CandidateDrawer
            candidate={selectedCandidate}
            open={selectedCandidate !== null}
            onClose={() => setSelectedCandidate(null)}
          />
        </div>
      </div>
    </>
  );
}
