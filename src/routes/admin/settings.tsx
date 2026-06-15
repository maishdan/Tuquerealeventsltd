import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Lock
} from "lucide-react";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

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
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">System Governance</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Settings</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Configure global empire parameters, communication protocols, and administrative security standards.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        {/* Company Identity */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <div className="flex items-center gap-3 text-gold">
              <Building2 size={20} />
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Company Identity</h4>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <SettingField
                label="Full Corporate Name"
                value={form.companyName}
                onChange={(v) => setForm({...form, companyName: v})}
              />
              <SettingField
                label="Official Correspondence Email"
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
                label="Primary Digital Domain"
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
        </div>

        {/* Intelligence Notifications */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <div className="flex items-center gap-3 text-gold">
              <Bell size={20} />
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Intelligence Notifications</h4>
           </div>

           <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "emailNotifications" as const, label: "Global Email Alerts", desc: "Receive high-level system summaries." },
                { key: "bookingAlerts" as const, label: "Project Intake Notifications", desc: "Real-time alerts for new client briefs." },
                { key: "contactAlerts" as const, label: "Communication Registry Alerts", desc: "Notify on inbound strategic messages." },
                { key: "paymentAlerts" as const, label: "Capital Flow Alerts", desc: "Immediate notification of verified payments." },
              ].map((item) => (
                <label key={item.key} className="group flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-gold/30 transition-all cursor-pointer">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{item.desc}</p>
                   </div>
                   <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                    className="h-5 w-5 rounded-lg border-white/10 bg-black checked:bg-gold accent-gold transition-all"
                  />
                </label>
              ))}
           </div>
        </div>

        {/* Security & Access */}
        <div className="bg-[#1a2b4b]/10 border border-blue-500/20 rounded-[40px] p-10 shadow-2xl space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                 <Lock size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Security</h4>
              </div>
              <p className="text-white font-bold leading-relaxed max-w-2xl uppercase tracking-tight text-xs">
                Authentication and session persistence are managed via end-to-end encrypted protocols. Administrative privileges are strictly governed by the master profile registry.
              </p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 pt-6">
          <button
            type="submit"
            className="h-16 px-12 rounded-full bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-gold/10"
          >
            <Save size={18} /> Commit Configuration
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-in fade-in">
               <Zap size={14} className="fill-emerald-500" /> System State Updated
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function SettingField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white font-bold focus:border-gold outline-none transition-all"
      />
    </div>
  );
}
