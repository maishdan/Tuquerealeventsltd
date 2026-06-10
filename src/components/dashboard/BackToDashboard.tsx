import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackToDashboard({ role }: { role: "admin" | "customer" }) {
  const to = role === "admin" ? "/admin" : "/dashboard";
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-300 hover:bg-gold hover:text-black hover:border-gold transition-all"
    >
      <ArrowLeft size={14} /> Back to Dashboard
    </Link>
  );
}
