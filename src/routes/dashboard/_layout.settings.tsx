import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Bell,
  ShieldCheck,
  User,
  Mail,
  Globe,
  Smartphone,
  Lock,
  Eye,
  Check,
  Loader2
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/settings")({
  component: DashboardSettings,
});

function DashboardSettings() {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">System Configuration</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Portal Settings</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Navigation Categories */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-card border border-border rounded-[32px] p-2 overflow-hidden">
              {[
                { id: 'general', label: 'General', icon: Settings, active: true },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'privacy', label: 'Privacy', icon: Eye },
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                    cat.active ? "bg-gold text-black shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <cat.icon size={18} />
                  {cat.label}
                </button>
              ))}
           </div>

           <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                 <ShieldCheck size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Auto-Save Enabled</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Your preferences are synchronized across all devices linked to this executive account.</p>
           </div>
        </div>

        {/* Right: Detailed Settings */}
        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
           <GlassPanel title="Notification Preferences" subtitle="Configure how the production team reaches you">
              <div className="space-y-6 py-4">
                 {[
                   { label: 'Email Notifications', desc: 'Receive project updates and invoice confirmations via email', icon: Mail, checked: true },
                   { label: 'SMS Alerts', desc: 'Critical production alerts sent directly to your mobile', icon: Smartphone, checked: false },
                   { label: 'Portal Announcements', desc: 'New feature alerts and system maintenance notes', icon: Bell, checked: true },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between gap-6 p-4 rounded-2xl hover:bg-muted transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-gold transition-colors">
                            <item.icon size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-foreground uppercase tracking-tight">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                         </div>
                      </div>
                      <div className={cn(
                        "h-6 w-11 rounded-full p-1 transition-colors cursor-pointer",
                        item.checked ? "bg-gold" : "bg-muted-foreground/20"
                      )}>
                        <div className={cn(
                          "h-4 w-4 rounded-full bg-white transition-transform",
                          item.checked ? "translate-x-5" : "translate-x-0"
                        )} />
                      </div>
                   </div>
                 ))}
              </div>
           </GlassPanel>

           <GlassPanel title="Regional & Experience" subtitle="Language and localization parameters">
              <div className="grid sm:grid-cols-2 gap-8 py-4">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Primary Language</label>
                    <div className="relative">
                       <select className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground focus:border-gold outline-none appearance-none">
                          <option>English (Executive)</option>
                          <option>Swahili</option>
                          <option>French</option>
                       </select>
                       <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={16} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Time Display</label>
                    <div className="flex gap-2">
                       <button className="flex-1 h-14 rounded-2xl bg-gold text-black font-bold text-xs uppercase tracking-widest">24-Hour</button>
                       <button className="flex-1 h-14 rounded-2xl bg-muted text-muted-foreground font-bold text-xs uppercase tracking-widest">12-Hour</button>
                    </div>
                 </div>
              </div>
           </GlassPanel>

           <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-14 px-12 rounded-full bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-gold/20 disabled:opacity-50"
              >
                 {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : null}
                 {saved ? 'Preferences Saved' : 'Save All Settings'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
