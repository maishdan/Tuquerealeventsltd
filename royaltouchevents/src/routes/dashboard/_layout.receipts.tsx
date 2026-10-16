import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Download, ShieldCheck, Printer, CheckCircle2, Loader2, Wallet, Clock } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerFinancials } from "@/hooks/use-dashboard-data";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { formatKes } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/dashboard/_layout/receipts")({
  component: CustomerReceipts,
});

const samples = [
  { id: "RCP-1021", date: "2026-07-30", desc: "Strategy Consultation", amount: "200", status: 'paid' },
  { id: "RCP-1022", date: "2026-07-30", desc: "Production Planning", amount: "570", status: 'paid' },
  { id: "RCP-1023", date: "2026-07-30", desc: "Technical Equipment", amount: "755", status: 'unpaid' },
];

function CustomerReceipts() {
  const { user } = useAuth();
  const { data: realRecords = [], isLoading: loadingReal } = useCustomerFinancials(user?.id);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (receipt: any, mode: 'download' | 'print') => {
    setProcessingId(receipt.id + mode);

    const actionWindow = window.open('', '_blank');
    if (!actionWindow) {
      setProcessingId(null);
      return;
    }

    const logoUrl = window.location.origin + eventsLogo;
    const isPaid = receipt.status === 'paid';

    const receiptHtml = `
      <html>
        <head>
          <title>Royal Touch Events - ${receipt.id}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Work+Sans:wght@300;400;600;800&display=swap');
            body { font-family: 'Work Sans', sans-serif; color: #0b0e14; margin: 0; padding: 0; background: white; }
            .receipt-wrapper { padding: 20px; position: relative; width: 100%; box-sizing: border-box; }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              padding: 40px;
              position: relative;
              overflow: hidden;
              background: white;
              min-height: 1000px;
              display: flex;
              flex-direction: column;
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
              background-color: ${isPaid ? '#84cc16' : '#f43f5e'};
              color: #fff;
              font-weight: 800;
              font-size: 18px;
              text-transform: uppercase;
              text-align: center;
              right: -50px;
              top: 30px;
              transform: rotate(45deg);
              letter-spacing: 2px;
            }
            .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 3px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-section { display: flex; align-items: center; gap: 20px; }
            .logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid #d4af37; object-fit: cover; }
            .brand-name { font-family: 'Instrument Serif', serif; font-size: 32px; text-transform: uppercase; letter-spacing: -1px; }
            .gold { color: #d4af37; }
            .receipt-title { font-weight: 800; text-transform: uppercase; letter-spacing: 3px; font-size: 16px; color: #64748b; text-align: right; }
            .details { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .detail-group h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; margin-top: 0; }
            .detail-group p { font-size: 16px; font-weight: 600; margin: 0; line-height: 1.4; }
            .item-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .item-table th { text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 2px solid #f1f5f9; padding: 10px 0; }
            .item-table td { padding: 20px 0; font-size: 16px; font-weight: 500; border-bottom: 1px solid #f1f5f9; }
            .total-section { display: flex; justify-content: flex-end; }
            .total-box { width: 300px; border-top: 3px solid #0b0e14; padding-top: 20px; }
            .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .total-label { font-size: 14px; font-weight: 800; text-transform: uppercase; }
            .total-value { font-size: 24px; font-weight: 800; color: #d4af37; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 180px; font-weight: 900; color: rgba(0,0,0,0.03); text-transform: uppercase; pointer-events: none; z-index: 0; letter-spacing: 25px; white-space: nowrap; }
            .footer { margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

            @media print {
              .receipt-wrapper { padding: 0; }
              .receipt-container { border: none; min-height: 290mm; padding: 40px; }
              .ribbon span { background-color: ${isPaid ? '#84cc16' : '#f43f5e'} !important; -webkit-print-color-adjust: exact; }
              .gold { color: #d4af37 !important; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-wrapper" id="receipt-content">
            <div class="receipt-container">
              <div class="ribbon"><span>${isPaid ? 'PAID' : 'UNPAID'}</span></div>
              <div class="watermark">SAMPLE</div>

              <div class="header">
                <div class="logo-section">
                  <img src="${logoUrl}" class="logo" />
                  <div class="brand-name">Royal <span class="gold">Touch</span> Events</div>
                </div>
                <div class="receipt-title">Official Receipt</div>
              </div>

              <div class="details">
                <div class="detail-group">
                  <h4>Billing To</h4>
                  <p>Valued Royal Client</p>
                  <p>Authorized Profile ID: 001-RT</p>
                </div>
                <div class="detail-group" style="text-align: right;">
                  <h4>Receipt Data</h4>
                  <p>ID: ${receipt.id}</p>
                  <p>Date: ${receipt.date}</p>
                </div>
              </div>

              <table class="item-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Quantity</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${receipt.desc}</td>
                    <td style="text-align: right;">1.00</td>
                    <td style="text-align: right;">KES ${receipt.amount}.00</td>
                  </tr>
                </tbody>
              </table>

              <div class="total-section">
                <div class="total-box">
                  <div class="total-row">
                    <span class="total-label">Subtotal</span>
                    <span>KES ${receipt.amount}.00</span>
                  </div>
                  <div class="total-row">
                    <span class="total-label">V.A.T (0%)</span>
                    <span>KES 0.00</span>
                  </div>
                  <div class="total-row" style="margin-top: 15px;">
                    <span class="total-label" style="font-size: 16px;">Total</span>
                    <span class="total-value">KES ${receipt.amount}.00</span>
                  </div>
                </div>
              </div>

              <div class="footer">
                &copy; 2026 ROYAL TOUCH EVENTS. ALL RIGHTS RESERVED. <br/>
                EXECUTIVE PRODUCTION & EVENT MANAGEMENT NAIROBI
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              const element = document.getElementById('receipt-content');
              const mode = '${mode}';

              const opt = {
                margin: 0,
                filename: 'RoyalTouch-Receipt-${receipt.id}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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

    actionWindow.document.write(receiptHtml);
    actionWindow.document.close();
    setProcessingId(null);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Financial Intelligence</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Receipts & Payments</h2>
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[32px] flex items-center gap-4 mb-8 shadow-sm">
         <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <ShieldCheck size={24} />
         </div>
         <div className="min-w-0">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Secure Transaction Log</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">Verified financial documents with Royal Touch status security ribbons.</p>
         </div>
      </div>

      {/* SAMPLES SECTION */}
      <div className="space-y-6">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Sample Documents</p>
        <div className="grid md:grid-cols-3 gap-6">
          {samples.map((r, idx) => (
            <div
              key={r.id}
              className={cn(
                "group relative overflow-hidden bg-card border rounded-[40px] p-8 transition-all duration-500 hover:bg-white/5 shadow-sm",
                r.status === 'unpaid' ? "border-rose-500/20 hover:border-rose-500/40" : "border-border hover:border-gold/30"
              )}
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 <Receipt size={120} className="text-foreground" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{r.date}</p>
                     <p className="text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors truncate">{r.desc}</p>
                     <div className={cn("flex items-center gap-2", r.status === 'unpaid' ? "text-rose-500" : "text-gold")}>
                        {r.status === 'unpaid' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                        <p className="font-mono text-[10px] font-bold tracking-widest">{r.id}</p>
                     </div>
                  </div>
                  <button
                    onClick={() => handleAction(r, 'print')}
                    disabled={processingId === r.id + 'print'}
                    className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                     {processingId === r.id + 'print' ? <Loader2 size={16} className="animate-spin" /> : <Printer size={18} />}
                  </button>
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-4">
                  <div>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Financial State</p>
                    <p className={cn("text-2xl font-black tracking-tighter", r.status === 'unpaid' ? "text-rose-500" : "text-emerald-500")}>KES {r.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                       r.status === 'unpaid' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                     )}>
                       {r.status}
                     </span>
                     <button
                      onClick={() => handleAction(r, 'download')}
                      disabled={processingId === r.id + 'download'}
                      className={cn(
                        "h-10 px-5 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
                        r.status === 'unpaid' ? "bg-muted text-foreground hover:bg-white/20" : "bg-gold text-black hover:bg-white shadow-gold/10"
                      )}
                    >
                      {processingId === r.id + 'download' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
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
        <GlassPanel title="Active Financial Registry" subtitle="Real-time records from your production cycle">
          {loadingReal ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
               <Loader2 size={40} className="text-gold animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Ledger...</p>
            </div>
          ) : realRecords.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
               <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground">
                  <Wallet size={32} />
               </div>
               <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground uppercase tracking-tight">No ledger entries found.</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">Official production invoices and receipts will appear here as your project milestones are settled.</p>
               </div>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                    <th className="py-6 px-4">Transaction ID</th>
                    <th className="py-6 px-4">Description</th>
                    <th className="py-6 px-4">Date</th>
                    <th className="py-6 px-4 text-right">Settled</th>
                    <th className="py-6 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {realRecords.map((rec) => (
                    <tr key={rec.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="py-6 px-4">
                         <span className="font-mono text-[10px] font-bold text-foreground tracking-widest uppercase">FIN-{rec.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-6 px-4">
                         <p className="text-xs font-bold text-foreground opacity-80 uppercase tracking-tight">{rec.label}</p>
                      </td>
                      <td className="py-6 px-4">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(rec.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-6 px-4 text-right">
                         <span className="text-xs font-black text-emerald-500">{formatKes(rec.amount)}</span>
                      </td>
                      <td className="py-6 px-4 text-right">
                         <button
                          onClick={() => handleAction({ id: 'REC-'+rec.id.slice(0,4), date: new Date(rec.created_at).toISOString().split('T')[0], desc: rec.label, amount: rec.amount, status: 'paid' }, 'download')}
                          className="text-[9px] font-black uppercase tracking-widest text-gold hover:underline"
                         >
                            Download
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
