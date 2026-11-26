import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { APP_LOGO_PATH } from '../data/toolsCatalog';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const delay = prefersReduced ? 400 : 1400;
    const timer = window.setTimeout(onFinish, delay);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      role="dialog"
      aria-label="Chathuranga Cyber Lab startup splash screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#030604] px-6 py-10 text-[#e6f7ed]"
    >
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={onFinish}
          className="min-h-[44px] px-4 py-2 font-mono-tech text-xs text-[#7fb392] hover:text-[#00ff66] transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-[26px] border border-[#00ff66]/45 bg-[#060d09] shadow-[0_0_50px_rgba(0,255,102,0.22)]">
          {!logoError ? (
            <img
              src={APP_LOGO_PATH}
              alt="Chathuranga Cyber Lab Logo"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#00ff66]">
              <Shield className="h-14 w-14" aria-hidden="true" />
            </div>
          )}
        </div>

        <h1 className="mt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e6f7ed]">
          Chathuranga Cyber Lab
        </h1>
        <p className="mt-1.5 font-mono-tech text-xs sm:text-sm text-[#00ff66]">
          ANDROID SECURITY TOOLKIT
        </p>

        <div className="mt-8 w-52 overflow-hidden rounded-full bg-[#0f2417] h-1.5">
          <div className="splash-progress h-full w-full rounded-full bg-[#00ff66]" />
        </div>
      </div>

      <p className="font-mono-tech text-[11px] text-[#5e8a6e]">
        Initializing local crypto &amp; network modules...
      </p>
    </div>
  );
}
