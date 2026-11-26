import { useState } from 'react';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { APP_LOGO_PATH } from '../data/toolsCatalog';

interface TopAppBarProps {
  title: string;
  showBack: boolean;
  onBack: () => void;
  onReplaySplash: () => void;
}

export function TopAppBar({
  title,
  showBack,
  onBack,
  onReplaySplash,
}: TopAppBarProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-[56px] border-b border-[#00ff66]/15 bg-[#050a07]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
        {/* Left: Back button or App Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to home screen"
              className="min-h-[44px] min-w-[44px] -ml-1.5 flex items-center justify-center rounded-xl text-[#e6f7ed] hover:bg-[#0e2116] hover:text-[#00ff66] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-[#00ff66]/40 bg-[#08120c]">
              {!logoError ? (
                <img
                  src={APP_LOGO_PATH}
                  alt="Chathuranga Cyber Lab"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#00ff66]">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
              )}
            </div>
          )}

          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-[#e6f7ed] truncate">
            {title}
          </h1>
        </div>

        {/* Right: Single contextual action */}
        <button
          type="button"
          onClick={onReplaySplash}
          title="Replay app splash screen"
          className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-[#143622] bg-[#08120c] px-3 py-1.5 font-mono-tech text-xs text-[#00ff66] hover:border-[#00ff66]/50 hover:bg-[#0d1f14] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Splash</span>
          <span className="sm:hidden">Logo</span>
        </button>
      </div>
    </header>
  );
}
