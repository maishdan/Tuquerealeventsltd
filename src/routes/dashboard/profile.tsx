import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api/profiles";

export const Route = createFileRoute("/dashboard/profile")({
  component: CustomerProfile,
});

function CustomerProfile() {
  const { profile, user, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      await updateProfile(user.id, {
        full_name: String(fd.get("full_name") || ""),
        phone: String(fd.get("phone") || ""),
        city: String(fd.get("city") || ""),
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Profile</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Account settings</h2>
      </div>

      <GlassPanel title="Personal Information" subtitle="Synced with Supabase">
        <form onSubmit={onSubmit} className="space-y-5 max-w-lg">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-emerald-400">Profile saved.</p>}
          <div>
            <label htmlFor="profile-name" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
            <input id="profile-name" name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Your name" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
          </div>
          <div>
            <label htmlFor="profile-email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input id="profile-email" value={profile?.email ?? ""} readOnly className="mt-2 w-full rounded-xl bg-background/40 border border-border px-4 py-3 text-sm text-muted-foreground" />
          </div>
          <div>
            <label htmlFor="profile-phone" className="text-xs uppercase tracking-widest text-muted-foreground">Phone</label>
            <input id="profile-phone" name="phone" defaultValue={profile?.phone ?? ""} placeholder="+254 …" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
          </div>
          <div>
            <label htmlFor="profile-city" className="text-xs uppercase tracking-widest text-muted-foreground">City</label>
            <input id="profile-city" name="city" defaultValue={profile?.city ?? ""} placeholder="Nairobi, Kenya" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
