import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

export const Route = createFileRoute("/admin/payment-history")({
  component: PaymentHistory,
});

const payments = [
  { date: "2026-06-09", ref: "MPESA-QXR2901", client: "Achieng Wedding", method: "M-Pesa", amount: "KES 200,000" },
  { date: "2026-06-08", ref: "BNK-44210", client: "Equity Corporate Gala", method: "Bank Transfer", amount: "KES 750,000" },
  { date: "2026-06-07", ref: "MPESA-QXR2870", client: "Kamau Birthday", method: "M-Pesa", amount: "KES 45,000" },
  { date: "2026-06-05", ref: "CARD-99021", client: "Safaricom Launch", method: "Card", amount: "KES 820,000" },
];

function PaymentHistory() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <History size={20} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Payment History</h2>
          <p className="text-gray-400 text-sm">Audit trail of every transaction processed.</p>
        </div>
      </div>

      <div className="bg-[#0b0e14] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Reference</th>
              <th className="text-left px-5 py-3">Client</th>
              <th className="text-left px-5 py-3">Method</th>
              <th className="text-left px-5 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.ref} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-gray-300">{p.date}</td>
                <td className="px-5 py-4 font-mono text-xs text-gold">{p.ref}</td>
                <td className="px-5 py-4 text-white">{p.client}</td>
                <td className="px-5 py-4 text-gray-300">{p.method}</td>
                <td className="px-5 py-4 text-emerald-400 font-semibold">{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
