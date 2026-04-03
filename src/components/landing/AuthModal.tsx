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
  const [mode, setMode] = useState<"login" | "register">("register");
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

    try {
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
    } catch {
      setError("Service temporarily unavailable. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch {
      setError("Service temporarily unavailable.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center auth-modal-enter">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-white/70 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#E5E5E5] rounded-[14px] p-8 max-w-[400px] w-full mx-4 z-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] auth-modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#BCBCBC] hover:text-[#0A0A0A] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-[14px] font-bold">S</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#0A0A0A]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h3>
          <p className="mt-1.5 text-[13px] text-[#9B9B9B]">
            Sign in to launch your resume analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] text-[#9B9B9B] mb-1.5 font-medium uppercase tracking-wider">
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
            <label className="block text-[12px] text-[#9B9B9B] mb-1.5 font-medium uppercase tracking-wider">
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

          {error && <p className="text-[12px] text-[#CF222E]">{error}</p>}

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

        <p className="mt-5 text-center text-[12px] text-[#9B9B9B]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-[#0A0A0A] font-medium underline underline-offset-4"
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
                className="text-[#0A0A0A] font-medium underline underline-offset-4"
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
