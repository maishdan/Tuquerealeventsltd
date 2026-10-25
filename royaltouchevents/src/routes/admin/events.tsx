import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useToggleEventFeatured,
  formatKes,
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import { uploadEventPoster } from "@/lib/api/events";
import { adminNav } from "@/lib/dashboard-nav";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Sparkles,
  Star,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord } from "@/lib/database.types";

export const Route = createFileRoute("/admin/events")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action as string | undefined,
  }),
  head: () =>
    createPageSeo({
      title: "Event Registry & Production Hub | TOQUE REAL Admin",
      description: "Manage TOQUE REAL live events, pricing, and home page featured spotlight.",
      path: "/admin/events",
      noindex: true,
    }),
  component: AdminEventsPage,
});

function AdminEventsPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <AdminEventsContent />
    </DashboardGuard>
  );
}

function AdminEventsContent() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Database Hooks
  const { data: events = [], isLoading: isLoadingEvents, refetch: refetchEvents } = useAdminEvents();

  // Mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const toggleFeaturedMutation = useToggleEventFeatured();

  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Corporate Gala");
  const [formDate, setFormDate] = useState("");
  const [formVenue, setFormVenue] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPosterUrl, setFormPosterUrl] = useState("/back/e1.jfif");
  const [formFeatured, setFormFeatured] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormName("");
    setFormType("Corporate Gala");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormVenue("Villa Rosa Kempinski, Nairobi");
    setFormBudget("2500000");
    setFormDescription("Executive event production by TOQUE REAL EVENTS LIMITED.");
    setFormPosterUrl("/back/e1.jfif");
    setFormFeatured(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (event: EventRecord) => {
    setEditingEvent(event);
    setFormName(event.name);
    setFormType(event.event_type || "General");
    setFormDate(event.event_date || new Date().toISOString().slice(0, 10));
    setFormVenue(event.venue || "Nairobi Venue");
    setFormBudget(String(event.budget || 0));
    setFormDescription(event.description || "");
    setFormPosterUrl(event.poster_url || "/back/e1.jfif");
    setFormFeatured(Boolean(event.featured));
    setIsCreateModalOpen(true);
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadEventPoster(file);
      setFormPosterUrl(url);
      showToast("✓ Event poster uploaded successfully!");
    } catch {
      showToast("❌ Image upload failed. Using fallback.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("❌ Please provide an event name.");
      return;
    }

    const numericBudget = parseInt(formBudget.replace(/[^0-9]/g, "")) || 0;

    try {
      if (editingEvent) {
        await updateEventMutation.mutateAsync({
          id: editingEvent.id,
          name: formName.trim(),
          event_type: formType,
          event_date: formDate,
          venue: formVenue.trim(),
          budget: numericBudget,
          description: formDescription.trim(),
          poster_url: formPosterUrl,
          featured: formFeatured,
        });
        showToast(`✓ Event '${formName}' updated successfully!`);
      } else {
        await createEventMutation.mutateAsync({
          user_id: profile?.id || null,
          name: formName.trim(),
          event_type: formType,
          event_date: formDate,
          venue: formVenue.trim(),
          budget: numericBudget,
          status: "upcoming",
          featured: formFeatured,
          description: formDescription.trim(),
          poster_url: formPosterUrl,
          organizer_name: "TOQUE REAL EVENTS LIMITED",
          organizer_email: "realtoque0@gmail.com",
          organizer_phone: "+254795365334",
        });
        showToast(`✓ New event '${formName}' created & saved to database!`);
      }
      setIsCreateModalOpen(false);
      refetchEvents();
    } catch (err: any) {
      showToast(`❌ Error: ${err?.message || "Failed to save event"}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete event '${name}'?`)) {
      try {
        await deleteEventMutation.mutateAsync(id);
        showToast(`✓ Deleted event '${name}'`);
        refetchEvents();
      } catch {
        showToast("❌ Error deleting event.");
      }
    }
  };

  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (e.name || "").toLowerCase().includes(q) ||
      (e.event_type || "").toLowerCase().includes(q) ||
      (e.venue || "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout
      title="TOQUE REAL EVENTS LIMITED ADMINISTRATOR"
      subtitle="Event Registry & Production Hub"
      nav={adminNav}
      role="admin"
    >
      <div className="space-y-6 font-sans">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-[300] bg-[#12212d] border-2 border-[#f4cf69] text-white text-xs font-mono px-5 py-3 shadow-2xl animate-in slide-in-from-top duration-200 flex items-center gap-3">
            <Sparkles className="text-[#f4cf69] shrink-0" size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* GUIDANCE NOTE TILE BANNER */}
        <div className="p-4 bg-gradient-to-r from-[#0d1d2c] via-[#091522] to-[#0d1d2c] border border-[#f4cf69]/40 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#f4cf69]/10 border border-[#f4cf69]/30 rounded-lg text-[#f4cf69] shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-[#f4cf69] uppercase font-mono tracking-wider flex items-center gap-2">
              <span>💡 Event Management & Home Page Spotlight Guide</span>
            </div>
            <p className="text-[#9ca8b6] font-medium leading-relaxed">
              Create and manage live production events. Click the <strong className="text-amber-300">⭐ Star icon</strong> on any event card to feature or unfeature it on the public Home Page. Converted AI Leads from the CRM automatically land here.
            </p>
          </div>
        </div>

        {/* HEADER CONTROLS BAR */}
        <div className="p-4 bg-[#09131d] border border-[#1b2c3d] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899cb0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event name, type, venue..."
              className="w-full pl-9 pr-4 py-2 bg-[#0c1e30] border border-[#203548] text-xs font-mono text-white placeholder:text-[#5a6e82] focus:border-[#f4cf69] outline-none transition rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate({ to: "/admin/ai" })}
              className="px-4 py-2.5 bg-[#0c1e30] border border-[#f4cf69]/60 text-[#f4cf69] hover:bg-[#122332] font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer rounded-lg"
              title="Go to AI Studio v2 Leads Discovery"
            >
              <Sparkles size={15} />
              <span>AI Leads v2</span>
            </button>

            <button
              onClick={() => refetchEvents()}
              className="p-2 bg-[#0c1e30] border border-[#203548] text-[#899cb0] hover:text-white rounded-lg transition cursor-pointer"
              title="Sync events"
            >
              <RefreshCw size={15} className={isLoadingEvents ? "animate-spin text-[#f4cf69]" : ""} />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-[#f4cf69] hover:bg-[#d5a637] text-black font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer rounded-lg font-mono"
            >
              <Plus size={16} />
              <span>New Event</span>
            </button>
          </div>
        </div>

        {/* EVENTS LIST GRID */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 bg-[#09131d] border border-[#1b2c3d] rounded-xl text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#12212d] border border-[#f4cf69]/30 text-[#f4cf69] flex items-center justify-center mx-auto">
              <Calendar size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">No Events Found</h3>
              <p className="text-xs text-[#899cb0] max-w-md mx-auto">
                No events currently exist in the database. Click "+ New Event" or convert a lead from the AI CRM to publish an event.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-2.5 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#09131d] border border-[#1b2c3d] hover:border-[#f4cf69]/50 rounded-xl overflow-hidden shadow-xl transition-all flex flex-col group"
              >
                {/* Event Poster Image Header */}
                <div className="relative h-48 bg-[#12212d] overflow-hidden">
                  <img
                    src={evt.poster_url || "/back/e1.jfif"}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09131d] via-[#09131d]/40 to-transparent" />

                  {/* Featured Badge Star Button */}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await toggleFeaturedMutation.mutateAsync({ id: evt.id, featured: !evt.featured });
                        showToast(
                          `✓ "${evt.name}" ${!evt.featured ? "marked as FEATURED on Home Page!" : "removed from Featured events"}`
                        );
                        refetchEvents();
                      } catch {
                        showToast("❌ Failed to update featured status.");
                      }
                    }}
                    className={cn(
                      "absolute top-3 right-3 px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold shadow-lg backdrop-blur-md z-10",
                      evt.featured
                        ? "bg-amber-400 text-black border-amber-300 font-black"
                        : "bg-black/60 border-white/20 text-white hover:border-[#f4cf69] hover:text-[#f4cf69]"
                    )}
                    title={evt.featured ? "Featured on Home Page (Click to unfeature)" : "Click to Feature on Home Page"}
                  >
                    <Star size={14} className={cn(evt.featured ? "fill-black text-black" : "text-amber-400")} />
                    <span>{evt.featured ? "Featured ★" : "Feature"}</span>
                  </button>

                  <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 border border-[#f4cf69]/40 text-[#f4cf69] text-[10px] font-mono font-bold uppercase rounded">
                    {evt.event_type || "General Event"}
                  </div>
                </div>

                {/* Event Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#f4cf69] transition-colors">
                      {evt.name}
                    </h4>
                    <p className="text-xs text-[#899cb0] line-clamp-2 leading-relaxed">
                      {evt.description || "Executive event production by TOQUE REAL EVENTS LIMITED."}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-[#c7d0da] border-t border-[#182836] pt-3">
                    <div className="flex items-center gap-2 text-[#899cb0]">
                      <Calendar size={14} className="text-[#f4cf69] shrink-0" />
                      <span>{evt.event_date ? new Date(evt.event_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Upcoming"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#899cb0]">
                      <MapPin size={14} className="text-[#20e39b] shrink-0" />
                      <span className="truncate">{evt.venue || "Nairobi Venue"}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#899cb0] uppercase">Budget / Value:</span>
                      <span className="text-sm font-black text-white font-mono">{formatKes(evt.budget || 0)}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-[#182836] pt-3 gap-2">
                    <button
                      onClick={() => handleOpenEditModal(evt)}
                      className="flex-1 py-2 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer rounded-lg"
                    >
                      <Edit size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(evt.id, evt.name)}
                      className="p-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-mono transition cursor-pointer rounded-lg"
                      title="Delete Event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081522] border-2 border-[#f4cf69] p-6 sm:p-8 max-w-xl w-full space-y-5 font-sans shadow-2xl rounded-xl my-8">
            <div className="flex items-center justify-between border-b border-[#182836] pb-4">
              <h3 className="text-base font-black uppercase text-white font-mono tracking-wider flex items-center gap-2">
                <Sparkles size={18} className="text-[#f4cf69]" />
                <span>{editingEvent ? "Edit Event Production" : "Create New Event"}</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#899cb0] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#899cb0] mb-1">Event Title / Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. East Africa Tech Summit 2026"
                  className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#899cb0] mb-1">Event Category / Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  >
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Technology">Technology Summit</option>
                    <option value="Concert Production">Concert Production</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Luxury Wedding">Luxury Wedding</option>
                    <option value="AGM & Conference">AGM & Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#899cb0] mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. KICC Grand Ballroom, Nairobi"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Budget / Value (KES)</label>
                  <input
                    type="text"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    placeholder="e.g. 2500000"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#899cb0] mb-1">Event Description & Production Brief</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe event setup, sound/lighting requirements, or VIP packages..."
                  className="w-full bg-[#0c1e30] border border-[#203548] p-3 text-white outline-none focus:border-[#f4cf69] rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-[#899cb0] mb-1">Upload Event Poster Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  disabled={isUploadingImage}
                  className="w-full bg-[#0c1e30] border border-[#203548] p-2 text-white outline-none rounded-lg text-xs"
                />
                {isUploadingImage && <p className="text-[10px] text-[#f4cf69] mt-1">Uploading poster to Supabase Storage...</p>}
              </div>

              {/* Mark as Featured Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-[#203548] bg-[#0c1e30] text-[#f4cf69] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>Feature this event on public Home Page Spotlight</span>
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#182836]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 border border-[#203548] text-[#899cb0] hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#f4cf69] hover:bg-[#d5a637] text-black font-black uppercase rounded-lg shadow-lg cursor-pointer"
                >
                  {editingEvent ? "Save Changes" : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
