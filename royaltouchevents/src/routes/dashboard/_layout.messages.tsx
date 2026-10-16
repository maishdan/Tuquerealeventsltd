import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Send,
  User,
  ShieldCheck,
  Search,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Clock,
  Loader2,
  Image as ImageIcon,
  Paperclip,
  Smile
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserMessages, sendMessage, markAsRead } from "@/lib/api/messages";
import type { Message } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import eventsLogo from "../../assets/events-logo.jpeg";

export const Route = createFileRoute("/dashboard/_layout/messages")({
  component: CustomerMessages,
});

function CustomerMessages() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!user) return;
    try {
      const data = await fetchUserMessages(user.id);
      setMessages(data);

      const unread = data.filter(m => !m.read && m.from_role === 'admin');
      for (const m of unread) {
        await markAsRead(m.id);
      }
    } catch (err) {
      console.error("Failed to load secure comms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 10000);
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      const sent = await sendMessage(
        user.id,
        profile?.full_name || "Client",
        "customer",
        newMessage.trim()
      );
      setMessages([...messages, sent]);
      setNewMessage("");
    } catch (err) {
      console.error("Transmission failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Chat Header */}
      <header className="shrink-0 h-20 bg-muted/30 border-b border-border flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="relative">
              <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-gold/20 shadow-lg">
                 <img src={eventsLogo} alt="Royal Touch Team" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-foreground text-sm uppercase tracking-tight">Royal Touch Operations</h3>
                 <ShieldCheck size={14} className="text-gold" />
              </div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                 <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
                 Senior Producer Online
              </p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
              <Phone size={18} />
           </button>
           <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
              <Video size={18} />
           </button>
           <div className="w-px h-6 bg-border mx-2" />
           <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
              <MoreVertical size={18} />
           </button>
        </div>
      </header>

      {/* 2. Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.02) 0%, transparent 100%)' }}
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
             <Loader2 size={32} className="text-gold animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Establishing Secure Link...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xs mx-auto">
             <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                <Send size={32} className="text-muted-foreground" />
             </div>
             <div className="space-y-2">
                <p className="text-sm font-bold text-foreground uppercase tracking-tight">Direct Comms Channel</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Initiate a conversation with your production team. All transmissions are encrypted.</p>
             </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.from_role === 'customer';

            return (
              <div key={msg.id} className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500",
                isMe ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "max-w-[85%] md:max-w-[70%] group relative",
                  isMe ? "items-end" : "items-start"
                )}>
                  {!isMe && (
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-4 mb-1.5">
                       {msg.from_name} <span className="text-gold opacity-50 ml-1">· Team</span>
                    </p>
                  )}

                  <div className={cn(
                    "px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-lg",
                    isMe
                      ? "bg-[#6a301a] text-white rounded-tr-none border border-white/10"
                      : "bg-muted text-foreground rounded-tl-none border border-border"
                  )}>
                    {msg.body}

                    <div className={cn(
                      "flex items-center gap-1.5 mt-2 justify-end",
                      isMe ? "text-white/40" : "text-muted-foreground"
                    )}>
                      <span className="text-[9px] font-bold uppercase tracking-tighter">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                         <CheckCheck size={12} className={msg.read ? "text-emerald-500" : ""} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Input Footer */}
      <footer className="shrink-0 p-6 bg-muted/10 border-t border-border">
        <form onSubmit={handleSend} className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <button type="button" className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                 <Smile size={20} />
              </button>
              <button type="button" className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                 <Paperclip size={20} />
              </button>
           </div>

           <div className="flex-1 relative group">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Secure transmission..."
                className="w-full h-14 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/50"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors">
                 <ImageIcon size={18} />
              </button>
           </div>

           <button
             type="submit"
             disabled={!newMessage.trim() || sending}
             className={cn(
               "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl disabled:opacity-50",
               newMessage.trim() ? "bg-gold text-black shadow-gold/20" : "bg-muted text-muted-foreground"
             )}
           >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
           </button>
        </form>

        <div className="flex justify-center mt-4">
           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-2">
              <ShieldCheck size={10} />
              End-to-End Encryption Active
           </p>
        </div>
      </footer>
    </div>
  );
}
