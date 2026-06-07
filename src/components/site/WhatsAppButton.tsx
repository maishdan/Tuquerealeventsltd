import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = "254701460110";
  const msg = encodeURIComponent("Hi Lumiere Events, I'd like to inquire about booking.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg shadow-black/40 hover:scale-105 transition animate-float-slow"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
