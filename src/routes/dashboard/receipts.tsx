import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/receipts")({
  component: CustomerReceipts,
});

const receipts = [
  { id: "RCP-2204", date: "2026-06-09", desc: "Wedding deposit", amount: "KES 200,000" },
  { id: "RCP-2118", date: "2026-04-22", desc: "Birthday sound setup", amount: "KES 65,000" },
];

function CustomerReceipts() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Receipt size={20} className="text-gold" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Receipts & Payments</h2>
          <p className="text-gray-400 text-sm">Download receipts for your bookings.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {receipts.map((r) => (
          <div key={r.id} className="bg-[#0f172a] border border-white/5 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{r.date}</p>
              <p className="text-white font-bold mt-1">{r.desc}</p>
              <p className="font-mono text-xs text-gold mt-1">{r.id}</p>
              <p className="text-emerald-400 font-semibold mt-2">{r.amount}</p>
            </div>
            <button className="flex items-center gap-2 bg-gold text-black px-3 py-2 rounded-md text-xs font-bold hover:bg-gold/90">
              <Download size={14} /> PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
