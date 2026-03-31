"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";
import { useUser } from "@/hooks/useUser";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1 font-mono text-[13px] text-[#9B9B9B]">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen">
      <Sidebar email={profile?.email || user.email} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
