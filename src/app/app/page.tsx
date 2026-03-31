"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Screening } from "@/types";
import { formatDate } from "@/lib/utils";
import TopBar from "@/components/app/TopBar";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScreenings() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("screenings")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setScreenings(data);
      setLoading(false);
    }

    fetchScreenings();
  }, []);

  return (
    <>
      <TopBar breadcrumb="Screenings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[28px] font-semibold tracking-[-0.02em]">
              Screenings
            </h1>
            <Link href="/app/screen">
              <Button>
                <Plus size={18} className="mr-2" />
                New screening
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : screenings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[15px] text-[#6B6B6B] mb-4">
                No screenings yet. Start your first one.
              </p>
              <Link href="/app/screen">
                <Button>Start screening</Button>
              </Link>
            </div>
          ) : (
            <div className="border border-[#E5E5E5] rounded-[8px] overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                    <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                      Job title
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                      Resumes
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-[13px] text-[#9B9B9B]">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-[13px] text-[#9B9B9B]" />
                  </tr>
                </thead>
                <tbody>
                  {screenings.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-[#E5E5E5] last:border-b-0 table-row-hover fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="px-6 py-3 font-medium text-[#0A0A0A]">
                        {s.job_title}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="text-[13px] font-mono capitalize"
                          style={{
                            color:
                              s.status === "completed"
                                ? "#1A7F37"
                                : s.status === "processing"
                                ? "#9A6700"
                                : s.status === "failed"
                                ? "#CF222E"
                                : "#6B6B6B",
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-[#6B6B6B]">
                        {s.total_resumes}
                      </td>
                      <td className="px-6 py-3 text-[#6B6B6B]">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {s.status === "completed" && (
                          <Link
                            href={`/app/screening/${s.id}`}
                            className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                          >
                            <Eye size={16} strokeWidth={1.5} />
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
