import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Building2, Globe, Mail, Phone, Save, Shield } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
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
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">System</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Dashboard <span className="text-gradient-gold">settings</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Configure company details, notifications and admin preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <GlassPanel title="Company Information" subtitle="Displayed across the website and receipts">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Building2 size={12} /> Company Name
              </span>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Mail size={12} /> Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Phone size={12} /> Phone
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Globe size={12} /> Website URL
              </span>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Office Address</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm"
              />
            </label>
          </div>
        </GlassPanel>

        <GlassPanel title="Notifications" subtitle="Admin alert preferences">
          <div className="space-y-4">
            {[
              { key: "emailNotifications" as const, label: "Email notifications", desc: "Receive general admin email alerts" },
              { key: "bookingAlerts" as const, label: "New booking alerts", desc: "Notify when a booking form is submitted" },
              { key: "contactAlerts" as const, label: "Contact form alerts", desc: "Notify when someone sends a contact message" },
              { key: "paymentAlerts" as const, label: "Payment alerts", desc: "Notify on incoming payments and receipts" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between gap-4 rounded-xl glass border border-white/10 p-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-gold shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form[item.key]}
                  onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                  className="h-4 w-4 rounded accent-gold"
                />
              </label>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Security" subtitle="Access and session preferences">
          <div className="flex items-start gap-3 rounded-xl glass border border-white/10 p-4">
            <Shield size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Admin session protection</p>
              <p className="text-xs text-muted-foreground mt-1">
                Authentication is managed via Supabase. Only users with the admin role can access this dashboard.
                To change admin access, update the role field in the Supabase profiles table.
              </p>
            </div>
          </div>
        </GlassPanel>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gold text-black px-6 py-2.5 text-sm font-bold hover:opacity-90 transition"
          >
            <Save size={16} /> Save Settings
          </button>
          {saved && (
            <span className={cn("text-sm text-emerald-400 animate-in fade-in")}>Settings saved successfully.</span>
          )}
        </div>
      </form>
    </div>
  );
}
