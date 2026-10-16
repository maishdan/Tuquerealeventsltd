import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined/managed cookies on this device
    const consent = localStorage.getItem("toque_real_cookie_consent");
    if (!consent) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("toque_real_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("toque_real_cookie_consent", "declined");
    setIsVisible(false);
  };

  const handleSaveManaged = () => {
    localStorage.setItem("toque_real_cookie_consent", "managed");
    setShowManageModal(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* MANAGE COOKIES MODAL */}
      {showManageModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
          <div className="bg-[#09141f] border-2 border-[#f4cf69]/60 p-6 rounded-xl max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#172533] pb-3">
              <div className="flex items-center gap-2">
                <Cookie size={18} className="text-[#f4cf69]" />
                <h3 className="text-sm font-black uppercase text-white font-serif">Manage Cookie Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="h-7 w-7 rounded bg-[#121d29] text-[#8d9bad] hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[#c7d0da] font-medium leading-relaxed">
              <div className="flex justify-between items-center p-2.5 bg-[#121d29] border border-[#243343] rounded">
                <div>
                  <strong className="block text-white font-bold">Strictly Necessary Cookies</strong>
                  <small className="text-[10px] text-[#8d9bad]">Required for secure logins & M-Pesa passes.</small>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">Always Active</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-[#121d29] border border-[#243343] rounded">
                <div>
                  <strong className="block text-white font-bold">Analytics & Performance</strong>
                  <small className="text-[10px] text-[#8d9bad]">Helps improve site speed & AI scanner match.</small>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#f4cf69] h-4 w-4 cursor-pointer" />
              </div>

              <div className="flex justify-between items-center p-2.5 bg-[#121d29] border border-[#243343] rounded">
                <div>
                  <strong className="block text-white font-bold">Marketing & Concierge Preferences</strong>
                  <small className="text-[10px] text-[#8d9bad]">Remembers preferred currency & location.</small>
                </div>
                <input type="checkbox" defaultChecked className="accent-[#f4cf69] h-4 w-4 cursor-pointer" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveManaged}
                className="w-full h-11 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded transition-all hover:bg-white shadow-xl cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT SMALL COOKIE CONSENT TILE */}
      <div className="fixed bottom-6 left-6 z-[99998] max-w-sm w-[calc(100%-3rem)] bg-[#09141f] border border-[#f4cf69]/50 p-4 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] text-white font-sans text-xs space-y-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-[#f4cf69]">
            <Cookie size={16} />
            <h4 className="font-bold text-xs uppercase tracking-wider font-serif">TOQUE REAL Cookie Consent</h4>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            className="text-[#8d9bad] hover:text-white cursor-pointer"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-[11px] text-[#c7d0da] leading-relaxed font-medium">
          We use cookies to enhance navigation, analyze site performance, and deliver personalized event concierge services.
        </p>

        {/* 3 Interactive Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
          <button
            type="button"
            onClick={handleAccept}
            className="py-2 px-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer text-center shadow"
          >
            Accept
          </button>

          <button
            type="button"
            onClick={handleDecline}
            className="py-2 px-2 bg-[#121d29] border border-[#314354] hover:border-rose-400 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer text-center"
          >
            Decline
          </button>

          <button
            type="button"
            onClick={() => setShowManageModal(true)}
            className="py-2 px-2 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-[#f4cf69] text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer text-center"
          >
            Manage
          </button>
        </div>
      </div>
    </>
  );
}
