import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ShieldCheck,
  Terminal,
  BookOpen,
  HelpCircle,
  X,
  ZoomIn,
  ZoomOut,
  Bot,
} from 'lucide-react';

interface HeaderProps {
  score: number;
  totalQuestions: number;
  activeModeLabel: string;
  onNavigate: (sectionId: string) => void;
}

const PROFILE_LOGO_SRC =
  '/assets/aistudio/WhatsApp_Image_2026-11-25_at_07.53.55_a10bd829.jpg';

export function Header({
  score,
  totalQuestions,
  activeModeLabel,
  onNavigate,
}: HeaderProps) {
  const [imgError, setImgError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (!isPopupOpen) {
      setZoomScale(1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPopupOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupOpen]);

  const toggleImageZoom = () => {
    setZoomScale((prev) => (prev === 1 ? 1.4 : prev === 1.4 ? 1.8 : 1));
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-[#00f0ff]/20 bg-[#05080a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Primary Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Brand Title */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              aria-label="Open full-screen profile photo"
              title="Click to zoom profile photo"
              className="group relative flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#00ff66] bg-[#040906] shadow-[0_0_26px_rgba(0,255,102,0.85)] transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff66]"
            >
              {!imgError ? (
                <img
                  src={PROFILE_LOGO_SRC}
                  alt="Chathuranga Cyber Lab Logo"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-[70%_25%] transition-transform duration-200 group-hover:scale-110"
                />
              ) : (
                <ShieldCheck className="h-9 w-9 text-[#00ff66]" aria-hidden="true" />
              )}
            </button>
            <div>
              <h1 className="font-display text-base sm:text-lg font-bold tracking-wide text-[#00f0ff] whitespace-nowrap">
                CHATHURANGA CYBER LAB
              </h1>
              <p className="font-mono-tech text-[11px] text-[#7fa6b8] whitespace-nowrap">
                WELCOME HACKER | SESSION 1 | {activeModeLabel}
              </p>
            </div>
          </div>

          {/* Quick Jump Nav (Desktop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-xs font-mono-tech text-[#94b8c8]"
          >
            <button
              type="button"
              onClick={() => onNavigate('lab-console')}
              className="flex items-center gap-1.5 py-2 hover:text-[#00f0ff] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00f0ff]"
            >
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quiz-section')}
              className="flex items-center gap-1.5 py-2 hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00ff66]"
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sinhala Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('cyber-guru-ai')}
              className="flex items-center gap-1.5 py-2 hover:text-[#00ff66] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00ff66]"
            >
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cyber Guru AI</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dictionary-section')}
              className="flex items-center gap-1.5 py-2 hover:text-[#00f0ff] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00f0ff]"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cyber Words</span>
            </button>
          </nav>

          {/* Status & Score Readout */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono-tech text-xs shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[#00ff66] font-semibold whitespace-nowrap">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[#00ff66]"
                aria-hidden="true"
              />
              ONLINE
            </span>
            <span className="text-[#365363]" aria-hidden="true">
              |
            </span>
            <span className="text-[#c8e4f0] whitespace-nowrap">
              USER: <strong className="text-[#00f0ff] font-semibold">HACKER</strong>
            </span>
            <span className="text-[#365363]" aria-hidden="true">
              |
            </span>
            <span className="text-[#c8e4f0] tabular-nums whitespace-nowrap">
              SCORE:{' '}
              <strong className="text-[#00ff66] font-bold">
                {score}/{totalQuestions}
              </strong>
            </span>
          </div>
        </div>

        {/* Mobile Quick Jump Bar */}
        <nav
          aria-label="Mobile section navigation"
          className="flex md:hidden items-center justify-between gap-2 border-t border-[#122631] py-1.5 text-xs font-mono-tech text-[#94b8c8]"
        >
          <button
            type="button"
            onClick={() => onNavigate('lab-console')}
            className="flex-1 py-2 text-center hover:text-[#00f0ff] transition-colors whitespace-nowrap cursor-pointer"
          >
            Terminal
          </button>
          <button
            type="button"
            onClick={() => onNavigate('quiz-section')}
            className="flex-1 py-2 text-center hover:text-[#00ff66] transition-colors whitespace-nowrap cursor-pointer"
          >
            Quiz ({score}/{totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => onNavigate('cyber-guru-ai')}
            className="flex-1 py-2 text-center hover:text-[#00ff66] transition-colors whitespace-nowrap cursor-pointer"
          >
            Guru AI
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dictionary-section')}
            className="flex-1 py-2 text-center hover:text-[#00f0ff] transition-colors whitespace-nowrap cursor-pointer"
          >
            Cyber Words
          </button>
        </nav>
      </div>
    </header>
    {typeof document !== 'undefined' &&
      createPortal(
        <MotionConfig reducedMotion="user">
          <AnimatePresence>
            {isPopupOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-modal-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsPopupOpen(false)}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020503]/95 p-4 sm:p-8 backdrop-blur-md"
              >
                {/* Top-right Controls: Zoom & Close */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="fixed top-4 right-4 z-10 flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setZoomScale((z) => (z < 1.8 ? Number((z + 0.4).toFixed(1)) : 1))
                    }
                    aria-label="Zoom in photo"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#00ff66]/45 bg-[#060f09] text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
                  >
                    {zoomScale >= 1.8 ? (
                      <ZoomOut className="h-5 w-5" />
                    ) : (
                      <ZoomIn className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    aria-label="Close full-screen photo"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-[#00ff66]/60 bg-[#060f09] text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Zoomable Photo Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.72 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-w-3xl flex-col items-center text-center"
                >
                  <div
                    onClick={toggleImageZoom}
                    title="Click photo to toggle zoom"
                    className="relative max-h-[70vh] w-full max-w-[340px] sm:max-w-[540px] md:max-w-[680px] overflow-hidden rounded-2xl border-2 border-[#00ff66] bg-[#040906] shadow-[0_0_45px_rgba(0,255,102,0.45)] cursor-zoom-in"
                  >
                    {!imgError ? (
                      <img
                        src={PROFILE_LOGO_SRC}
                        alt="CHATHURANGA CYBER LAB Full View"
                        referrerPolicy="no-referrer"
                        style={{ transform: `scale(${zoomScale})` }}
                        className="h-full w-full max-h-[68vh] object-contain transition-transform duration-300 ease-out"
                      />
                    ) : (
                      <div className="flex h-64 w-64 items-center justify-center">
                        <ShieldCheck className="h-20 w-20 text-[#00ff66]" />
                      </div>
                    )}
                  </div>

                  <h2
                    id="profile-modal-title"
                    className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-wider text-[#00ff66]"
                  >
                    CHATHURANGA CYBER LAB
                  </h2>
                  <p className="mt-1 font-mono-tech text-xs text-[#7fa6b8]">
                    Click photo to zoom ({zoomScale.toFixed(1)}x) · Press ESC or Close to exit
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>,
        document.body
      )}
    </>
  );
}
