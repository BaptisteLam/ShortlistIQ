"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Eye, Download, Search, Filter } from "lucide-react";
import ScoreBadge from "@/components/ui/ScoreBadge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Candidate } from "@/types";
import { truncate } from "@/lib/utils";

interface ResultsTableProps {
  candidates: Candidate[];
  screeningId: string;
  onViewCandidate: (candidate: Candidate) => void;
}

type SortKey = "score" | "candidate_name";
type SortDir = "asc" | "desc";

export default function ResultsTable({
  candidates,
  screeningId,
  onViewCandidate,
}: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [matchFilter, setMatchFilter] = useState<string>("all");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    let result = [...candidates];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.candidate_name?.toLowerCase().includes(q)
      );
    }

    if (matchFilter !== "all") {
      result = result.filter((c) => c.match_level === matchFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "score") {
        cmp = (a.score ?? 0) - (b.score ?? 0);
      } else {
        cmp = (a.candidate_name ?? "").localeCompare(b.candidate_name ?? "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [candidates, search, matchFilter, sortKey, sortDir]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates"
              className="pl-9 w-[240px] h-8 text-[13px]"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="h-8 pl-8 pr-3 text-[13px] border border-[#E5E5E5] rounded-[4px] bg-white text-[#0A0A0A] focus:border-[#0A0A0A] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All matches</option>
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="weak">Weak</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/export/csv/${screeningId}`} download>
            <Button variant="secondary" size="small">
              <Download size={14} className="mr-1.5" />
              Export CSV
            </Button>
          </a>
          <a href={`/api/export/pdf/${screeningId}`} download>
            <Button variant="secondary" size="small">
              <Download size={14} className="mr-1.5" />
              Export PDF
            </Button>
          </a>
        </div>
      </div>

      <div className="border border-[#E5E5E5] rounded-[8px] overflow-hidden">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
              <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B] font-mono w-12">
                #
              </th>
              <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                <button
                  onClick={() => toggleSort("candidate_name")}
                  className="inline-flex items-center gap-1 hover:text-[#0A0A0A] transition-colors"
                >
                  Candidate
                  <ArrowUpDown size={14} className={`transition-transform duration-200 ${sortKey === "candidate_name" ? "text-[#0A0A0A]" : ""}`} />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                <button
                  onClick={() => toggleSort("score")}
                  className="inline-flex items-center gap-1 hover:text-[#0A0A0A] transition-colors"
                >
                  Score
                  <ArrowUpDown size={14} className={`transition-transform duration-200 ${sortKey === "score" ? "text-[#0A0A0A]" : ""}`} />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                Match
              </th>
              <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                Top skills
              </th>
              <th className="px-6 py-3 text-right font-medium text-[13px] text-[#9B9B9B]" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                className="border-b border-[#E5E5E5] last:border-b-0 table-row-hover"
              >
                <td className="px-6 py-3 font-mono text-[#9B9B9B]">
                  {i + 1}
                </td>
                <td className="px-6 py-3 font-medium text-[#0A0A0A]">
                  {c.candidate_name || "Unknown"}
                </td>
                <td className="px-6 py-3">
                  {c.score !== null && c.match_level && (
                    <ScoreBadge score={c.score} matchLevel={c.match_level} />
                  )}
                </td>
                <td className="px-6 py-3">
                  <span
                    className="text-[13px] capitalize"
                    style={{
                      color:
                        c.match_level === "strong"
                          ? "#1A7F37"
                          : c.match_level === "moderate"
                          ? "#9A6700"
                          : "#CF222E",
                    }}
                  >
                    {c.match_level || "—"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {c.analysis?.skills_matched?.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center h-5 px-1.5 text-[12px] font-mono bg-[#F5F5F5] text-[#6B6B6B] rounded-[3px]"
                      >
                        {truncate(s, 15)}
                      </span>
                    ))}
                    {(c.analysis?.skills_matched?.length ?? 0) > 3 && (
                      <span className="text-[12px] font-mono text-[#9B9B9B]">
                        +{c.analysis.skills_matched.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => onViewCandidate(c)}
                    className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                  >
                    <Eye size={16} strokeWidth={1.5} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
