import { getMatchColor } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  matchLevel: "strong" | "moderate" | "weak" | null;
}

export default function ScoreBadge({ score, matchLevel }: ScoreBadgeProps) {
  const color = getMatchColor(matchLevel);

  return (
    <span
      className="score-badge"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      {score}
    </span>
  );
}
