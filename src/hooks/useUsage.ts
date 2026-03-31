"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface Usage {
  screens_used: number;
  screens_limit: number;
}

export function useUsage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("screens_used, screens_limit")
          .eq("id", user.id)
          .single();

        if (data) setUsage(data);
      }
      setLoading(false);
    }

    fetchUsage();
  }, []);

  return { usage, loading };
}
