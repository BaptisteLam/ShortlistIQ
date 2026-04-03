"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setError("Something went wrong. Try again.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSuccess();
  }

  async function handleGoogleAuth() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#E5E5E5] rounded-[12px] p-8 max-w-[420px] w-full mx-4 z-10 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B9B9B] hover:text-[#0A0A0A] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-[20px] font-semibold text-[#0A0A0A]">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </h3>
          <p className="mt-1.5 text-[14px] text-[#6B6B6B]">
            Sign in to launch your resume analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
              placeholder={
                mode === "login" ? "Enter your password" : "Create a password"
              }
              required
              minLength={mode === "register" ? 8 : undefined}
            />
          </div>

          {error && <p className="text-[13px] text-[#CF222E]">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : "Continue"}
          </Button>
        </form>

        <div className="mt-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleAuth}
            type="button"
          >
            Continue with Google
          </Button>
        </div>

        <p className="mt-5 text-center text-[13px] text-[#6B6B6B]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-[#0A0A0A] underline underline-offset-4"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-[#0A0A0A] underline underline-offset-4"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
