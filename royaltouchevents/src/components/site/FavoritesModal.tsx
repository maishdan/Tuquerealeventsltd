import React, { useRef, useEffect } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link } from "@tanstack/react-router";
import { X, Star, Trash2, ArrowRight, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const modalBoxRef = useRef<HTMLDivElement>(null);

  // Close modal on click outside or Escape key press
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalBoxRef.current && !modalBoxRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        ref={modalBoxRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.2)] p-8 space-y-6 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-none bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              <Star size={20} className="fill-gold" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Saved Bookmarks</p>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                My Favorites ({favorites.length})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {favorites.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-none bg-slate-100 dark:bg-muted flex items-center justify-center border border-slate-200 dark:border-border text-muted-foreground">
              <Bookmark size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-foreground uppercase tracking-tight">No Saved Favorites</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed font-medium">
                Bookmark events, portfolio projects, or services by clicking the star icon across the site.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-none p-4 sm:p-5 hover:border-gold transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-none border border-gold/30">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-tight truncate group-hover:text-gold transition-colors">
                    {item.title}
                  </h4>
                  {item.date && <p className="text-[10px] text-muted-foreground font-mono">{item.date}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={item.link as any}
                    onClick={onClose}
                    className="h-9 px-4 rounded-none bg-gold text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-black hover:text-gold transition-all shadow-sm"
                  >
                    View <ArrowRight size={12} />
                  </Link>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="h-9 w-9 rounded-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-all cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {favorites.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4">
            <button
              onClick={clearFavorites}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
            >
              Clear All Bookmarks
            </button>
            <button
              onClick={onClose}
              className="h-10 px-6 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
