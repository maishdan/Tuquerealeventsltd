import { createFileRoute } from "@tanstack/react-router";
import { Boxes, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin/inventory-analytics")({
  component: InventoryAnalytics,
});

const inventory = [
  { name: "PA Speakers (Premium)", stock: 18, status: "Healthy" },
  { name: "Wireless Mics", stock: 6, status: "Low" },
  { name: "Round Tables", stock: 120, status: "Healthy" },
  { name: "Chiavari Chairs (Gold)", stock: 32, status: "Critical" },
  { name: "LED Uplights", stock: 84, status: "Healthy" },
];

const marketing = [
  { channel: "Instagram", reach: "42.1K", conversions: "184" },
  { channel: "Google Search", reach: "28.4K", conversions: "212" },
  { channel: "Referrals", reach: "—", conversions: "96" },
  { channel: "WhatsApp Campaigns", reach: "6.8K", conversions: "58" },
];

function InventoryAnalytics() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Inventory & Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">Equipment levels and marketing channel performance.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Boxes size={20} className="text-gold" />
            <h3 className="font-bold text-white">Equipment Inventory</h3>
          </div>
          <ul className="space-y-3">
            {inventory.map((i) => (
              <li key={i.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-sm text-white">{i.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{i.stock} units</span>
                  <span className={
                    "text-[10px] font-bold uppercase px-2 py-1 rounded " +
                    (i.status === "Healthy" ? "bg-emerald-500/10 text-emerald-400" :
                     i.status === "Low" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400")
                  }>{i.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 size={20} className="text-blue-400" />
            <h3 className="font-bold text-white">Marketing Analytics</h3>
          </div>
          <ul className="space-y-3">
            {marketing.map((m) => (
              <li key={m.channel} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-sm text-white">{m.channel}</span>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Reach</p>
                    <p className="text-xs text-white">{m.reach}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Conv.</p>
                    <p className="text-xs text-emerald-400 font-semibold">{m.conversions}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
