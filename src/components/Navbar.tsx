import React from 'react';
import { ShieldCheck, Info, Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  onOpenDisclaimer: () => void;
  onOpenAssistant: () => void;
  mcpConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDisclaimer,
  onOpenAssistant,
  mcpConnected
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">My Vaccine Guide SG</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                NAIS Sept 2025
              </span>
            </div>
            <p className="text-xs text-slate-700 hidden sm:block">
              Singapore Adult Immunisation & Subsidy Education
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection status indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${mcpConnected ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`} />
            <span>{mcpConnected ? 'Evidence Active' : 'Registry Standby'}</span>
          </div>

          {/* Ask Evidence Guide button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95"
            aria-label="Ask Evidence Guide"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Ask Guide</span>
          </button>

          {/* Medical disclaimer modal trigger */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
            title="Important Medical Disclaimers & Boundaries"
            aria-label="Medical Disclaimers"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
