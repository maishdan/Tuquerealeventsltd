import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Wallet,
  Search,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Tag,
  Printer,
  Download,
  AlertCircle
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerOrders } from "@/hooks/use-dashboard-data";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";
import eventsLogo from "../../assets/events-logo.jpeg";

export const Route = createFileRoute("/dashboard/_layout/orders")({
  component: CustomerOrders,
});

const samples = [
  { id: "ORD-9001", item_name: "Technical AV Equipment", order_date: "2026-07-28", total_amount: 150000, status: "confirmed" },
  { id: "ORD-9002", item_name: "Event Furniture Rental", order_date: "2026-07-29", total_amount: 85000, status: "confirmed" },
  { id: "ORD-9003", item_name: "Premium Lighting Rig", order_date: "2026-07-30", total_amount: 45000, status: "pending" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
      styles[status] || styles.pending
    )}>
      {status}
    </span>
  );
}

function CustomerOrders() {
  const { user } = useAuth();
  const { data: realOrders = [], isLoading } = useCustomerOrders(user?.id);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (order: any, mode: 'download' | 'print') => {
    setProcessingId(order.id + mode);

    const actionWindow = window.open('', '_blank');
    if (!actionWindow) {
      setProcessingId(null);
      return;
    }

    const logoUrl = window.location.origin + eventsLogo;
    const isConfirmed = order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered';

    const html = `
      <html>
        <head>
          <title>Royal Touch Order - ${order.id}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Work+Sans:wght@300;400;600;800&display=swap');
            body { font-family: 'Work Sans', sans-serif; color: #0b0e14; margin: 0; padding: 0; background: white; }
            .wrapper { padding: 40px; position: relative; }
            .container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              padding: 60px;
              position: relative;
              overflow: hidden;
              background: white;
            }
            .ribbon {
              position: absolute;
              top: -10px;
              right: -10px;
              width: 150px;
              height: 150px;
              overflow: hidden;
              z-index: 10;
            }
            .ribbon span {
              position: absolute;
              display: block;
              width: 225px;
              padding: 15px 0;
              background-color: ${isConfirmed ? '#84cc16' : '#94a3b8'};
              color: #fff;
              font-weight: 800;
              font-size: 14px;
              text-transform: uppercase;
              text-align: center;
              right: -50px;
              top: 30px;
              transform: rotate(45deg);
              letter-spacing: 2px;
            }
            .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 3px solid #2b4c8c; padding-bottom: 30px; margin-bottom: 50px; }
            .logo-section { display: flex; align-items: center; gap: 20px; }
            .logo { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #2b4c8c; object-fit: cover; }
            .brand-name { font-family: 'Instrument Serif', serif; font-size: 32px; text-transform: uppercase; letter-spacing: -1px; }
            .blue { color: #2b4c8c; }
            .gold { color: #d4af37; }
            .title { font-weight: 800; text-transform: uppercase; letter-spacing: 3px; font-size: 16px; color: #64748b; text-align: right; }
            .details { display: grid; grid-template-cols: 1fr 1fr; gap: 60px; margin-bottom: 80px; }
            .detail-group h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; margin-top: 0; }
            .detail-group p { font-size: 16px; font-weight: 600; margin: 0; line-height: 1.6; }
            .item-table { width: 100%; border-collapse: collapse; margin-bottom: 80px; }
            .item-table th { text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 2px solid #f1f5f9; padding: 15px 0; }
            .item-table td { padding: 30px 0; font-size: 16px; font-weight: 500; border-bottom: 1px solid #f1f5f9; }
            .total-section { display: flex; justify-content: flex-end; }
            .total-box { width: 300px; border-top: 3px solid #0b0e14; padding-top: 30px; }
            .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .total-label { font-size: 14px; font-weight: 800; text-transform: uppercase; }
            .total-value { font-size: 24px; font-weight: 800; color: #2b4c8c; }
            .footer { margin-top: 100px; border-top: 1px solid #e2e8f0; padding-top: 30px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

            @media print {
              .container { border: none; }
              .ribbon span { background-color: ${isConfirmed ? '#84cc16' : '#94a3b8'} !important; -webkit-print-color-adjust: exact; }
              .blue { color: #2b4c8c !important; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper" id="content">
            <div class="container">
              <div class="ribbon"><span>${isConfirmed ? 'CONFIRMED' : 'PENDING'}</span></div>

              <div class="header">
                <div class="logo-section">
                  <img src="${logoUrl}" class="logo" />
                  <div class="brand-name">Royal <span class="blue">Touch</span> Events</div>
                </div>
                <div class="title">Order Confirmation</div>
              </div>

              <div class="details">
                <div class="detail-group">
                  <h4>Ordered By</h4>
                  <p>Authorized Royal Account</p>
                  <p>Order ID: ${order.id}</p>
                </div>
                <div class="detail-group" style="text-align: right;">
                  <h4>Transaction Date</h4>
                  <p>${order.order_date}</p>
                  <p>Status: ${order.status.toUpperCase()}</p>
                </div>
              </div>

              <table class="item-table">
                <thead>
                  <tr>
                    <th>Service / Item</th>
                    <th style="text-align: right;">Status</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${order.item_name}</td>
                    <td style="text-align: right;">${order.status}</td>
                    <td style="text-align: right;">KES ${order.total_amount.toLocaleString()}.00</td>
                  </tr>
                </tbody>
              </table>

              <div class="total-section">
                <div class="total-box">
                  <div class="total-row">
                    <span class="total-label">Total Amount</span>
                    <span class="total-value">KES ${order.total_amount.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              <div class="footer">
                &copy; 2026 ROYAL TOUCH EVENTS. LOGISTICS & FULFILLMENT DIV. <br/>
                PREMIER PRODUCTION SOLUTIONS NAIROBI
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              const element = document.getElementById('content');
              const mode = '${mode}';

              const opt = {
                margin: 0,
                filename: 'RoyalTouch-Order-${order.id}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
              };

              setTimeout(() => {
                if (mode === 'download') {
                  html2pdf().set(opt).from(element).save().then(() => {
                    setTimeout(() => window.close(), 1000);
                  });
                } else {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                  setTimeout(() => window.close(), 10000);
                }
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    actionWindow.document.write(html);
    actionWindow.document.close();
    setProcessingId(null);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Logistics Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Your service orders</h2>
        </div>
      </div>

      <div className="bg-[#1a2b4b] border border-blue-500/20 p-6 rounded-[32px] flex items-center gap-4 mb-8">
         <div className="h-12 w-12 rounded-full bg-blue-500/20 text-white flex items-center justify-center border border-blue-500/20 shrink-0">
            <ShieldCheck size={24} />
         </div>
         <div className="min-w-0">
            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Verified Logistics Manifest</p>
            <p className="text-sm text-blue-100 leading-relaxed font-medium">Download or print confirmed order documents with Royal Touch high-precision security ribbons.</p>
         </div>
      </div>

      {/* SAMPLES SECTION */}
      <div className="space-y-6">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Sample Documents</p>
        <div className="grid md:grid-cols-3 gap-6">
          {samples.map((o) => (
            <div key={o.id} className={cn(
              "group relative overflow-hidden bg-card border rounded-[40px] p-8 transition-all duration-500 hover:bg-white/5",
              o.status === 'pending' ? "border-amber-500/20 hover:border-amber-500/40" : "border-border hover:border-blue-500/30"
            )}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                 <Package size={120} className="text-foreground" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{o.order_date}</p>
                     <p className="text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-blue-400 transition-colors truncate">{o.item_name}</p>
                     <div className={cn("flex items-center gap-2", o.status === 'pending' ? "text-amber-500" : "text-blue-400")}>
                        {o.status === 'pending' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                        <p className="font-mono text-[10px] font-bold tracking-widest">{o.id}</p>
                     </div>
                  </div>
                  <button
                    onClick={() => handleAction(o, 'print')}
                    disabled={processingId === o.id + 'print'}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                     {processingId === o.id + 'print' ? <Loader2 size={16} className="animate-spin" /> : <Printer size={18} />}
                  </button>
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-4">
                  <div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Project Investment</p>
                    <p className={cn("text-2xl font-black tracking-tighter", o.status === 'pending' ? "text-amber-500" : "text-blue-400")}>{formatKes(o.total_amount)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <StatusBadge status={o.status} />
                     <button
                      onClick={() => handleAction(o, 'download')}
                      disabled={processingId === o.id + 'download'}
                      className={cn(
                        "h-10 px-5 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
                        o.status === 'pending' ? "bg-white/10 text-foreground hover:bg-white/20" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10"
                      )}
                    >
                      {processingId === o.id + 'download' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REAL DATA SECTION */}
      <div className="pt-10">
        <GlassPanel title="Production Manifest" subtitle="Real-time order fulfillment registry">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
               <Loader2 size={40} className="text-gold animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Manifest...</p>
            </div>
          ) : realOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
               <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground">
                  <Package size={32} />
               </div>
               <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground uppercase tracking-tight">No active orders found.</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">Service orders are generated once your project moves into the technical implementation phase.</p>
               </div>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              {realOrders.map((o) => (
                <div key={o.id} className="group relative overflow-hidden rounded-[32px] bg-card border border-border hover:border-gold/30 transition-all duration-500 p-6 md:p-8">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="space-y-5 flex-1">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                              <Tag size={20} />
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Manifest ID: ORD-{o.id.slice(0, 8).toUpperCase()}</p>
                              <h3 className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{o.item_name}</h3>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                           <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-muted-foreground opacity-50" />
                              <span>{o.order_date}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Wallet size={14} className="text-muted-foreground opacity-50" />
                              <span className="text-emerald-500/80">{formatKes(o.total_amount)}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 shrink-0">
                        <StatusBadge status={o.status} />
                        <button
                          onClick={() => handleAction(o, 'download')}
                          className="text-[9px] font-black uppercase tracking-widest text-gold hover:underline"
                        >
                          Download
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
