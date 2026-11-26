import { useState, useMemo } from 'react';
import {
  KeyRound,
  QrCode,
  Wifi,
  Lock,
  ArrowLeftRight,
  Search,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { TOOLS_CATALOG, type ToolId, type ToolMeta } from '../data/toolsCatalog';

interface HomeScreenProps {
  onOpenTool: (toolId: ToolId) => void;
}

const TOOL_ICONS: Record<ToolId, typeof KeyRound> = {
  'password-generator': KeyRound,
  'qr-maker': QrCode,
  'ip-device-info': Wifi,
  'text-encryptor': Lock,
  'unit-converter': ArrowLeftRight,
};

export function HomeScreen({ onOpenTool }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOLS_CATALOG.filter((tool) => {
      const catOk =
        selectedCategory === 'All' || tool.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const renderAppIconCard = (tool: ToolMeta) => {
    const Icon = TOOL_ICONS[tool.id];
    return (
      <button
        key={tool.id}
        type="button"
        onClick={() => onOpenTool(tool.id)}
        className="group flex flex-col items-center rounded-2xl border border-[#122b1c] bg-[#07100b] p-4 text-center transition-all duration-150 hover:border-[#00ff66]/55 hover:bg-[#0b1811] active:scale-[0.97] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00ff66]"
      >
        {/* Big Play Store / Android Squircle Icon */}
        <div className="flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-[22px] border border-[#00ff66]/35 bg-gradient-to-br from-[#0e2618] to-[#040a06] text-[#00ff66] shadow-[0_8px_24px_rgba(0,255,102,0.12)] transition-transform duration-150 group-hover:scale-105">
          <Icon className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={2} aria-hidden="true" />
        </div>

        <h3 className="mt-3.5 font-display text-sm sm:text-base font-semibold text-[#e6f7ed] leading-snug">
          {tool.name}
        </h3>
        <p className="mt-0.5 text-xs text-[#78a88a] line-clamp-1">
          {tool.subtitle}
        </p>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Play Store Style Search Bar & Category Chips */}
      <section aria-label="Search cyber tools" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#649678]"
              aria-hidden="true"
            />
            <label htmlFor="home-tool-search" className="sr-only">
              Search Cyber Lab apps and tools
            </label>
            <input
              id="home-tool-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Chathuranga Cyber Lab tools..."
              className="min-h-[46px] w-full rounded-2xl border border-[#143321] bg-[#07100b] pl-10 pr-4 py-2.5 text-sm text-[#e6f7ed] placeholder-[#5a856b] focus:border-[#00ff66] focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="Filter tools by category"
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
          >
            {['All', 'Security', 'Utility', 'Network'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                      : 'border-[#122b1c] bg-[#07100b] text-[#84b396] hover:border-[#224f34] hover:text-[#e6f7ed]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Big App Icons Grid (Play Store Launcher Style) */}
      <section aria-labelledby="apps-grid-heading">
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div>
            <h2
              id="apps-grid-heading"
              className="font-display text-lg sm:text-xl font-bold text-[#e6f7ed]"
            >
              Cyber Apps &amp; Tools
            </h2>
            <p className="text-xs text-[#78a88a]">
              Tap any app icon to launch immediately
            </p>
          </div>
          <span className="font-mono-tech text-xs text-[#00ff66] tabular-nums">
            {filteredTools.length} APPS
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-2xl border border-[#122b1c] bg-[#07100b] p-8 text-center text-sm text-[#78a88a]">
            No apps matched &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredTools.map(renderAppIconCard)}
          </div>
        )}
      </section>

      {/* Featured Android Toolkit Cards (Tap List / Quick Overview for 1440px Desktop & Mobile) */}
      <section aria-labelledby="quick-access-heading">
        <h2
          id="quick-access-heading"
          className="font-display text-base sm:text-lg font-bold text-[#e6f7ed] mb-3"
        >
          Recommended For You
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {TOOLS_CATALOG.slice(0, 4).map((tool) => {
            const Icon = TOOL_ICONS[tool.id];
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onOpenTool(tool.id)}
                className="flex items-center justify-between gap-3.5 rounded-2xl border border-[#122b1c] bg-[#07100b] p-3.5 text-left transition-colors hover:border-[#00ff66]/45 hover:bg-[#0a1710] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00ff66]/30 bg-[#0b1d12] text-[#00ff66]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#78a88a]">
                      <span>{tool.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Local &amp; Private</span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-[#e6f7ed] truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#89b89b] line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-[#5b8a6d]"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Privacy & Local Execution Assurance Strip */}
      <section className="rounded-2xl border border-[#122b1c] bg-[#060e09] p-4 flex items-start sm:items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00ff66]/10 text-[#00ff66]">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#e6f7ed]">
            Zero-Cloud Security Processing
          </h3>
          <p className="text-xs text-[#7da88d] leading-relaxed">
            Passwords, QR codes, AES-256 encryption, and unit conversions run directly inside your browser. Your keys and text never leave your device.
          </p>
        </div>
      </section>
    </div>
  );
}
