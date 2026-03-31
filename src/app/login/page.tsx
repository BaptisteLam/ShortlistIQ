"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Try again.");
      setLoading(false);
      return;
    }

    router.push("/app");
  }

  async function handleGoogleLogin() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white border border-[#E5E5E5] rounded-[8px] p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-[18px] font-semibold text-[#0A0A0A]">
            ShortlistIQ
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-[#6B6B6B] mb-1.5">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] text-[#6B6B6B] mb-1.5">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-[#CF222E]">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>

        <div className="mt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
            type="button"
          >
            Or continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#6B6B6B]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#0A0A0A] underline underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
