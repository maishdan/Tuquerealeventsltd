import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/dashboard/orders")({
  component: CustomerOrders,
});

const orders = [
  { id: "ORD-1042", item: "Wedding Decor Package", date: "2026-06-09", total: "KES 380,000", status: "Confirmed" },
  { id: "ORD-1038", item: "Birthday Sound Setup", date: "2026-04-22", total: "KES 65,000", status: "Delivered" },
];

function CustomerOrders() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
          <ShoppingCart size={20} className="text-gold" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Orders</h2>
          <p className="text-gray-400 text-sm">Your service orders and packages.</p>
        </div>
      </div>

      <div className="bg-[#0b0e14] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Item</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/5">
                <td className="px-5 py-4 font-mono text-xs text-gold">{o.id}</td>
                <td className="px-5 py-4 text-white">{o.item}</td>
                <td className="px-5 py-4 text-gray-300">{o.date}</td>
                <td className="px-5 py-4 text-white font-semibold">{o.total}</td>
                <td className="px-5 py-4"><span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
