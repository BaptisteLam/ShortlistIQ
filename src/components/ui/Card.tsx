import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#FAFAFA] border border-[#E5E5E5] rounded-[8px] p-6",
        hover && "card-hover transition-transform duration-150",
        className
      )}
    >
      {children}
    </div>
  );
}
