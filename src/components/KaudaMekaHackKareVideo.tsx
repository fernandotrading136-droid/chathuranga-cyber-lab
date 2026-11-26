import { useState } from 'react';
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

interface KaudaMekaHackKareVideoProps {
  onJoinNow: () => void;
}

const PRIMARY_PHOTO_SRC =
  '/assets/aistudio/f2f81ba4-765a-4237-8216-7a9cbdc0e1c9_3de7a047.jfif';
const FALLBACK_PHOTO_SRC =
  '/assets/aistudio/WhatsApp_Image_2026-11-25_at_09.25.39_75fb2ac3.jpeg';

const SPEAKING_MESSAGE =
  'CHATHURANGA CYBER LAB EKA EKATHU WENNA! APE ARAKSHAWA WENUWEN API HACKING IGENA GAMU!';

export function KaudaMekaHackKareVideo({
  onJoinNow,
}: KaudaMekaHackKareVideoProps) {
  const [photoSrc, setPhotoSrc] = useState(PRIMARY_PHOTO_SRC);
  const [imgFailed, setImgFailed] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinClick = () => {
    setJoined(true);
    onJoinNow();
  };

  return (
    <section
      id="kauda-meka-hack-kare-video"
      aria-labelledby="kauda-video-heading"
      className="rounded-lg border border-[#00ff66]/45 bg-[#040906] p-4 sm:p-6 shadow-[0_0_32px_rgba(0,255,102,0.1)]"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#112e1d] pb-3.5">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
          <h2
            id="kauda-video-heading"
            className="font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#00ff66]"
          >
            KAUDA MEKA HACK KARE
          </h2>
        </div>
      </div>

      {/* Photo Showcase (replaces video player) */}
      <div className="mt-5 mx-auto max-w-2xl overflow-hidden rounded-xl border-2 border-[#00ff66]/60 bg-[#020403] shadow-[0_0_30px_rgba(0,255,102,0.18)]">
        {!imgFailed ? (
          <img
            src={photoSrc}
            alt="Chathuranga Cyber Lab"
            referrerPolicy="no-referrer"
            onError={() => {
              if (photoSrc !== FALLBACK_PHOTO_SRC) {
                setPhotoSrc(FALLBACK_PHOTO_SRC);
              } else {
                setImgFailed(true);
              }
            }}
            className="h-auto max-h-[460px] w-full object-cover object-[50%_22%]"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-[#040a06]">
            <ShieldCheck className="h-16 w-16 text-[#00ff66]" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Big Glowing Green Text & JOIN NOW Button */}
      <div className="mt-6 mx-auto max-w-3xl text-center space-y-5">
        <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#00ff66] leading-snug drop-shadow-[0_0_16px_rgba(0,255,102,0.75)]">
          &ldquo;{SPEAKING_MESSAGE}&rdquo;
        </p>

        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={handleJoinClick}
            className="min-h-[50px] inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#00ff66] px-8 py-3 font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#031208] shadow-[0_0_26px_rgba(0,255,102,0.65)] hover:bg-[#33ff85] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            {joined ? (
              <>
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <span>JOINED! LET&apos;S LEARN HACKING</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" aria-hidden="true" />
                <span>JOIN NOW</span>
              </>
            )}
          </button>

          {joined && (
            <p
              role="status"
              className="font-mono-tech text-xs text-[#00ff66]"
            >
              Welcome to Chathuranga Cyber Lab! Starting your interactive lesson &amp; quiz session.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
