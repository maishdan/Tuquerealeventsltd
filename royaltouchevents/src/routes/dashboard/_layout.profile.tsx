import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Loader2, Camera, User, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api/profiles";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/profile")({
  component: CustomerProfile,
});

function CustomerProfile() {
  const { profile, user, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onAvatarClick() {
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be under 2MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await updateProfile(user.id, { avatar_url: publicUrl });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  }

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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Executive Identity</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Account profile</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Avatar Management */}
        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Identity" subtitle="Professional portrait">
            <div className="flex flex-col items-center py-6 space-y-6">
              <div className="relative group cursor-pointer" onClick={onAvatarClick}>
                 <div className="h-40 w-40 rounded-full overflow-hidden ring-4 ring-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-muted flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User size={60} className="text-muted-foreground opacity-30" />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <Camera size={24} className="text-gold" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-white">Upload New</span>
                    </div>
                 </div>

                 {uploading && (
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Loader2 size={30} className="text-gold animate-spin" />
                   </div>
                 )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept="image/*"
              />

              <div className="text-center space-y-1">
                 <p className="text-sm font-bold text-foreground uppercase tracking-tight">{profile?.full_name || "User"}</p>
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{profile?.role === 'admin' ? 'Executive Admin' : 'Valued Client'}</p>
              </div>
            </div>
          </GlassPanel>

          <div className="bg-gold/5 border border-gold/10 p-6 rounded-[32px] space-y-4 shadow-sm">
             <div className="flex items-center gap-3 text-gold">
                <ShieldCheck size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Security Status</h4>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Your identity and operational data are secured via high-precision RSA encryption and Royal Touch protocols.</p>
          </div>
        </div>

        {/* Right: Personal Data */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          <GlassPanel title="Personal Credentials" subtitle="Synchronized with Royal Engine">
            <form onSubmit={onSubmit} className="space-y-8 py-4">
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                   <AlertCircle size={16} />
                   <span>{error}</span>
                </div>
              )}

              {saved && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                   <Check size={16} />
                   <span>Profile Credentials Updated</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="profile-name" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Legal Full Name</label>
                  <input id="profile-name" name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Enter name" className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/50" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Registered Email</label>
                  <input id="profile-email" value={profile?.email ?? ""} readOnly className="w-full h-14 bg-background border border-border rounded-2xl px-6 text-sm text-muted-foreground opacity-60 outline-none cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile-phone" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Operational Phone</label>
                  <input id="profile-phone" name="phone" defaultValue={profile?.phone ?? ""} placeholder="+254..." className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/50" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile-city" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Primary Location</label>
                  <input id="profile-city" name="city" defaultValue={profile?.city ?? ""} placeholder="Nairobi, Kenya" className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/50" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving || uploading} className="h-14 px-10 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20 disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Save Credentials
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
