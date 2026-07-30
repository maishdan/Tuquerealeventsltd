import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  Bell,
  Building2,
  Globe,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Settings2,
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: SITE_NAME,
    email: SITE_EMAIL,
    phone: SITE_PHONE,
    website: SITE_URL,
    address: "Nairobi, Kenya",
    emailNotifications: true,
    bookingAlerts: true,
    contactAlerts: true,
    paymentAlerts: false,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">System Governance</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Global Config</h2>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        <div className="grid lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <GlassPanel title="Corporate Identity" subtitle="Primary organizational parameters for the empire">
                 <div className="grid md:grid-cols-2 gap-6 py-4">
                    <SettingField
                      label="Full Corporate Name"
                      value={form.companyName}
                      onChange={(v) => setForm({...form, companyName: v})}
                    />
                    <SettingField
                      label="Correspondence Email"
                      value={form.email}
                      onChange={(v) => setForm({...form, email: v})}
                      type="email"
                    />
                    <SettingField
                      label="Executive Phone Line"
                      value={form.phone}
                      onChange={(v) => setForm({...form, phone: v})}
                    />
                    <SettingField
                      label="Primary Domain"
                      value={form.website}
                      onChange={(v) => setForm({...form, website: v})}
                    />
                    <div className="md:col-span-2">
                      <SettingField
                        label="Headquarters Address"
                        value={form.address}
                        onChange={(v) => setForm({...form, address: v})}
                      />
                    </div>
                 </div>
              </GlassPanel>

              <GlassPanel title="Intelligence Alerts" subtitle="Configure system notification protocols">
                 <div className="grid md:grid-cols-2 gap-4 py-4">
                    {[
                      { key: "emailNotifications" as const, label: "Global Email Summaries", desc: "Periodic system snapshots." },
                      { key: "bookingAlerts" as const, label: "Project Intake Alerts", desc: "Notify on new strategic briefs." },
                      { key: "contactAlerts" as const, label: "Comms Intercepts", desc: "Alert on inbound inquiries." },
                      { key: "paymentAlerts" as const, label: "Capital Flow Notifications", desc: "Notify on verified settlements." },
                    ].map((item) => (
                      <label key={item.key} className="group flex items-center justify-between p-6 rounded-[24px] border border-border bg-muted/30 hover:border-gold/30 transition-all cursor-pointer shadow-sm">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{item.label}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{item.desc}</p>
                         </div>
                         <div className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form[item.key]}
                              onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted border border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                         </div>
                      </label>
                    ))}
                 </div>
              </GlassPanel>
           </div>

           <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="bg-[#121212] border border-white/10 p-8 rounded-[40px] space-y-8 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck size={100} />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 text-gold">
                       <Lock size={20} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Administrative Guard</h4>
                    </div>
                    <p className="text-gray-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest leading-loose">
                       Governance settings are locked to the master executive account. All modifications are logged in the global audit registry.
                    </p>
                    <div className="pt-4">
                       <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <Zap size={16} className="text-gold" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">High-Security Active</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-card border border-border p-8 rounded-[40px] shadow-sm">
                 <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-6">Commit Changes</h4>
                 <button
                   type="submit"
                   className="w-full h-16 rounded-full bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-gold/20"
                 >
                   <Save size={18} /> Apply Changes
                 </button>
                 {saved && (
                   <div className="mt-6 flex items-center justify-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest animate-in fade-in">
                      <ShieldCheck size={14} /> Registry Updated
                   </div>
                 )}
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}

function SettingField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-4">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground font-bold focus:border-gold outline-none transition-all placeholder:text-muted-foreground/30 shadow-inner"
      />
    </div>
  );
}
