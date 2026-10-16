import { Link } from "@tanstack/react-router";
import { ArrowLeft, Command } from "lucide-react";

export function BackToDashboard({ role }: { role: "admin" | "customer" }) {
  const to = role === "admin" ? "/admin" : "/dashboard";
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-none text-[9px] font-black uppercase tracking-[0.2em] bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 text-foreground hover:bg-gold hover:text-black hover:border-gold transition-all shadow-md group cursor-pointer"
    >
      <ArrowLeft size={14} className="text-gold group-hover:text-black transition-transform group-hover:-translate-x-1" />
      <span>
        Back to <span className="font-bold">{role === "admin" ? "Main Admin Overview" : "Customer Overview"}</span>
      </span>
    </Link>
  );
}
