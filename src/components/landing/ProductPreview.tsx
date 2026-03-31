import ScoreBadge from "@/components/ui/ScoreBadge";

const mockCandidates = [
  { rank: 1, name: "Sarah Chen", score: 94, level: "strong" as const, skills: ["Python", "AWS", "ML", "Docker"] },
  { rank: 2, name: "Marcus Rodriguez", score: 87, level: "strong" as const, skills: ["Python", "GCP", "Kubernetes"] },
  { rank: 3, name: "Emily Watson", score: 72, level: "moderate" as const, skills: ["Python", "SQL", "Tableau"] },
  { rank: 4, name: "James Park", score: 58, level: "weak" as const, skills: ["Java", "Spring", "SQL"] },
  { rank: 5, name: "Lisa Thompson", score: 41, level: "weak" as const, skills: ["JavaScript", "React"] },
];

export default function ProductPreview() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-main">
        <div className="border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-[#FAFAFA] border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between">
            <div>
              <span className="text-[13px] font-mono text-[#9B9B9B]">Screening results</span>
              <span className="text-[13px] text-[#6B6B6B] ml-3">Senior Data Engineer — 5 candidates</span>
            </div>
            <span className="text-[13px] font-mono text-[#1A7F37]">Completed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-left">
                  <th className="px-6 py-3 font-medium text-[13px] text-[#9B9B9B] font-mono w-12">#</th>
                  <th className="px-6 py-3 font-medium text-[13px] text-[#9B9B9B]">Candidate</th>
                  <th className="px-6 py-3 font-medium text-[13px] text-[#9B9B9B]">Score</th>
                  <th className="px-6 py-3 font-medium text-[13px] text-[#9B9B9B]">Match</th>
                  <th className="px-6 py-3 font-medium text-[13px] text-[#9B9B9B]">Top skills</th>
                </tr>
              </thead>
              <tbody>
                {mockCandidates.map((c) => (
                  <tr key={c.rank} className="border-b border-[#E5E5E5] last:border-b-0 table-row-hover">
                    <td className="px-6 py-3 font-mono text-[#9B9B9B]">{c.rank}</td>
                    <td className="px-6 py-3 text-[#0A0A0A] font-medium">{c.name}</td>
                    <td className="px-6 py-3">
                      <ScoreBadge score={c.score} matchLevel={c.level} />
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className="text-[13px] capitalize"
                        style={{
                          color:
                            c.level === "strong"
                              ? "#1A7F37"
                              : c.level === "moderate"
                              ? "#9A6700"
                              : "#CF222E",
                        }}
                      >
                        {c.level}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {c.skills.map((s) => (
                          <span key={s} className="inline-flex items-center h-5 px-1.5 text-[12px] font-mono bg-[#F5F5F5] text-[#6B6B6B] rounded-[3px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#9B9B9B]">
          ShortlistIQ dashboard — actual product interface
        </p>
      </div>
    </section>
  );
}
