"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Clock, Settings, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Screenings", icon: Briefcase },
  { href: "/app/history", label: "History", icon: Clock },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  email?: string;
}

export default function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-[#FAFAFA] border-r border-[#E5E5E5] flex flex-col h-full">
      <div className="p-6">
        <Link href="/app" className="text-[18px] font-semibold text-[#0A0A0A]">
          ShortlistIQ
        </Link>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[6px] text-[15px] transition-colors mb-0.5",
                isActive
                  ? "bg-[#F0F0F0] text-[#0A0A0A] border-l-2 border-[#0A0A0A]"
                  : "text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
              )}
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E5E5E5]">
        {email && (
          <p className="text-[13px] text-[#9B9B9B] truncate mb-2">{email}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Log out
        </button>
      </div>
    </aside>
  );
}
