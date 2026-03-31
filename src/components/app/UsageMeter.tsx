interface UsageMeterProps {
  used: number;
  limit: number;
}

export default function UsageMeter({ used, limit }: UsageMeterProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isHigh = percentage >= 80;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] text-[#6B6B6B]">Monthly screens</span>
        <span className="text-[13px] font-mono text-[#0A0A0A]">
          {used} / {limit}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#E5E5E5] rounded-[3px] overflow-hidden">
        <div
          className="h-full rounded-[3px] transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: isHigh ? "#CF222E" : "#0A0A0A",
          }}
        />
      </div>
    </div>
  );
}
