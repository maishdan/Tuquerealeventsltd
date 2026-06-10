import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const orders = [
  { id: "ORD-1042", client: "Achieng Wedding", items: "Decor + Sound", total: "KES 380,000", status: "Confirmed" },
  { id: "ORD-1041", client: "Equity Corporate Gala", items: "Full Production", total: "KES 1,250,000", status: "Processing" },
  { id: "ORD-1040", client: "Kamau Birthday", items: "Decor + DJ", total: "KES 145,000", status: "Pending" },
  { id: "ORD-1039", client: "Safaricom Launch", items: "Stage + AV", total: "KES 820,000", status: "Delivered" },
];

function AdminOrders() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
          <ShoppingCart size={20} className="text-gold" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Orders</h2>
          <p className="text-gray-400 text-sm">All active and historical client orders.</p>
        </div>
      </div>

      <div className="bg-[#0b0e14] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Order ID</th>
              <th className="text-left px-5 py-3">Client</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-mono text-xs text-gold">{o.id}</td>
                <td className="px-5 py-4 text-white">{o.client}</td>
                <td className="px-5 py-4 text-gray-300">{o.items}</td>
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
