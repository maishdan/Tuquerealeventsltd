import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerMessages } from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/dashboard/messages")({
  component: CustomerMessages,
});

function CustomerMessages() {
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useCustomerMessages(user?.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Messages</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Planner conversations</h2>
      </div>

      <GlassPanel title="Inbox" subtitle="Messages from your event team">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet. Your planner will reach out here.</p>
        )}
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`w-full text-left rounded-xl border p-4 ${msg.read ? "border-white/10" : "border-gold/30 bg-gold/5"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{msg.from_name}</p>
                  <p className="text-xs text-muted-foreground">{msg.from_role}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{msg.body}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
