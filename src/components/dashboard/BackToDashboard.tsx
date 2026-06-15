import { Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export function BackToDashboard({ role }: { role: "admin" | "customer" }) {
  const to = role === "admin" ? "/admin" : "/dashboard";
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-gray-400 hover:bg-gold hover:text-[#0b0e14] hover:border-gold transition-all shadow-xl group"
    >
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/5 group-hover:bg-black/10 transition-colors">
        <ArrowLeft size={12} />
      </div>
      <span className="flex items-center gap-2">
        Return to <span className="text-white group-hover:text-[#0b0e14]">Overview Hub</span>
      </span>
    </Link>
  );
}
