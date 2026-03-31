"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import TopBar from "@/components/app/TopBar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import UsageMeter from "@/components/app/UsageMeter";
import Modal from "@/components/ui/Modal";

export default function SettingsPage() {
  const { user, profile } = useUser();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMsg("Something went wrong. Try again.");
    } else {
      setPasswordMsg("Password updated.");
      setNewPassword("");
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;

    const supabase = createBrowserSupabaseClient();
    // Sign out and let server-side handle deletion
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleManageBilling() {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  async function handleUpgrade() {
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  return (
    <>
      <TopBar breadcrumb="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[560px] mx-auto space-y-10">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em]">
            Settings
          </h1>

          {/* Account */}
          <section>
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#6B6B6B] mb-1.5">
                  Email
                </label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-[#FAFAFA] text-[#6B6B6B]"
                />
              </div>
              <div>
                <label className="block text-[13px] text-[#6B6B6B] mb-1.5">
                  New password
                </label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleChangePassword}
                  >
                    Update
                  </Button>
                </div>
                {passwordMsg && (
                  <p className="mt-1.5 text-[13px] text-[#6B6B6B]">
                    {passwordMsg}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Plan */}
          <section>
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] mb-4">
              Plan
            </h2>
            <div className="border border-[#E5E5E5] rounded-[8px] p-4 bg-[#FAFAFA] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-[#0A0A0A] capitalize">
                  {profile?.plan || "Starter"} plan
                </span>
                {profile?.plan === "pro" ? (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleManageBilling}
                  >
                    Manage billing
                  </Button>
                ) : (
                  <Button size="small" onClick={handleUpgrade}>
                    Upgrade to Pro
                  </Button>
                )}
              </div>
              {profile && (
                <UsageMeter
                  used={profile.screens_used}
                  limit={profile.screens_limit}
                />
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section>
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] mb-4 text-[#CF222E]">
              Danger zone
            </h2>
            <div className="border border-[#E5E5E5] rounded-[8px] p-4">
              <p className="text-[15px] text-[#6B6B6B] mb-3">
                Permanently delete your account and all data.
              </p>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(true)}
                className="border-[#CF222E] text-[#CF222E] hover:border-[#CF222E]"
              >
                Delete account
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete account"
      >
        <p className="text-[15px] text-[#6B6B6B] mb-4">
          This action cannot be undone. Type DELETE to confirm.
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="Type DELETE"
          className="mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== "DELETE"}
            className="bg-[#CF222E] hover:bg-[#b31d28]"
          >
            Delete account
          </Button>
        </div>
      </Modal>
    </>
  );
}
