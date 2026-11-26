import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { BookOpen, Search, Check, ShieldCheck, X } from 'lucide-react';
import {
  CYBER_WORDS,
  type CyberWord,
  type WordCategory,
} from '../data/cyberData';

const CATEGORIES: { id: WordCategory; label: string }[] = [
  { id: 'All', label: 'All (සියල්ල)' },
  { id: 'Attacks', label: 'Attacks (ප්‍රහාර)' },
  { id: 'Defense', label: 'Defense (ආරක්ෂාව)' },
  { id: 'Network', label: 'Network (ජාල)' },
];

export function DictionarySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WordCategory>('All');
  const [learnedIds, setLearnedIds] = useState<Record<string, boolean>>({});
  const [activeGuideWord, setActiveGuideWord] = useState<CyberWord | null>(null);

  useEffect(() => {
    if (!activeGuideWord) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveGuideWord(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeGuideWord]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CYBER_WORDS.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.pronunciationSi.toLowerCase().includes(q) ||
        item.shortMeaningSi.toLowerCase().includes(q) ||
        item.explanationSi.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleLearned = (id: string) => {
    setLearnedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const learnedCount = Object.values(learnedIds).filter(Boolean).length;

  return (
    <>
      <section
        id="dictionary-section"
        aria-labelledby="dictionary-heading"
        className="rounded-lg border border-[#00f0ff]/25 bg-[#070c10] p-4 sm:p-6"
      >
        {/* Header & Progress */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142630] pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-[#00f0ff]" aria-hidden="true" />
            <div>
              <h2
                id="dictionary-heading"
                className="font-display text-lg sm:text-xl font-bold text-[#e8f6fc]"
              >
                Cyber Words Dictionary (ආධුනිකයන් සඳහා වචන මාලාව)
              </h2>
              <p className="text-xs sm:text-sm text-[#8bb1c2]">
                මුල සිට ඉගෙන ගන්නා ඕනෑම අයෙකුට සරලව තේරුම් ගත හැකි Cyber Security වචන {CYBER_WORDS.length}ක්.
              </p>
            </div>
          </div>

          <div className="font-mono-tech text-xs text-[#00ff66] tabular-nums">
            LEARNED: {learnedCount} / {CYBER_WORDS.length}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b8e9e]"
              aria-hidden="true"
            />
            <label htmlFor="cyber-word-search" className="sr-only">
              Search cyber words
            </label>
            <input
              id="cyber-word-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search word (e.g. Phishing, VPN, 2FA)..."
              className="min-h-[42px] w-full rounded-md border border-[#183240] bg-[#040709] pl-9 pr-3 py-2 text-sm text-[#e8f6fc] placeholder-[#5d7e8f] focus:border-[#00f0ff] focus:outline-none"
            />
          </div>

          <div
            role="group"
            aria-label="Filter cyber words by category"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[40px] rounded-md border px-3 py-1.5 font-mono-tech text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#00f0ff] bg-[#00f0ff]/15 text-[#00f0ff]'
                      : 'border-[#162d38] bg-[#040709] text-[#8eb0c0] hover:border-[#2a5266] hover:text-[#e8f6fc]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <div className="mt-6 rounded-md border border-[#142630] bg-[#040709] p-6 text-center text-sm text-[#8bb1c2]">
            No matching Cyber Words found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => {
              const isLearned = Boolean(learnedIds[word.id]);
              return (
                <article
                  key={word.id}
                  className={`flex flex-col justify-between rounded-md border p-4 transition-colors ${
                    isLearned
                      ? 'border-[#00ff66]/45 bg-[#05100b]'
                      : 'border-[#152a36] bg-[#040709] hover:border-[#00f0ff]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono-tech text-[11px] text-[#00f0ff]">
                          {word.category.toUpperCase()} · {word.categorySi}
                        </p>
                        <h3 className="mt-1 font-display text-base font-bold text-[#eef8fc]">
                          {word.term}
                        </h3>
                        <p className="text-xs text-[#7fa6b8]">
                          ({word.pronunciationSi})
                        </p>
                      </div>
                    </div>

                    <p className="mt-2.5 text-sm font-semibold text-[#00ff66]">
                      {word.shortMeaningSi}
                    </p>
                    <p className="mt-2 text-sm text-[#c2dce8] leading-relaxed">
                      {word.explanationSi}
                    </p>
                    <p className="mt-2.5 border-t border-[#12242e] pt-2.5 text-xs text-[#8eb0c0] leading-relaxed">
                      {word.exampleSi}
                    </p>
                  </div>

                  {/* Card Footer Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleLearned(word.id)}
                      className={`min-h-[40px] w-full inline-flex items-center justify-center gap-1.5 rounded border px-3 py-1.5 font-mono-tech text-xs font-medium transition-colors cursor-pointer ${
                        isLearned
                          ? 'border-[#00ff66]/50 bg-[#00ff66]/15 text-[#00ff66]'
                          : 'border-[#183240] bg-[#070c10] text-[#9cc0d0] hover:border-[#00f0ff]/50 hover:text-[#00f0ff]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {isLearned ? 'Learned (ඉගෙන ගත්තා)' : 'Mark as Learned'}
                      </span>
                    </button>

                    {/* Book Icon Button: ARAKSHAKA PIYAWARA */}
                    <button
                      type="button"
                      onClick={() => setActiveGuideWord(word)}
                      className="min-h-[40px] w-full inline-flex items-center justify-center gap-2 rounded border border-[#00ff66]/45 bg-[#06180d] px-3 py-1.5 font-mono-tech text-xs font-bold text-[#00ff66] hover:border-[#00ff66] hover:bg-[#00ff66]/15 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>ARAKSHAKA PIYAWARA</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Green-Themed Tooltip/Guide Popup Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <MotionConfig reducedMotion="user">
            <AnimatePresence>
              {activeGuideWord && (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="safety-guide-modal-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  onClick={() => setActiveGuideWord(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg rounded-xl border-2 border-[#00ff66] bg-[#040e07] p-5 sm:p-6 shadow-[0_0_38px_rgba(0,255,102,0.35)]"
                  >
                    {/* Popup Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-[#143d23] pb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#00ff66]/60 bg-[#00ff66]/15 text-[#00ff66]">
                          <BookOpen className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <h3
                            id="safety-guide-modal-title"
                            className="font-display text-base sm:text-lg font-bold text-[#e6f7ed]"
                          >
                            {activeGuideWord.term} ({activeGuideWord.pronunciationSi})
                          </h3>
                          <p className="font-mono-tech text-[11px] font-bold text-[#00ff66]">
                            ME PRASHNAYATA GATHA UTHU PIYAWARA:
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveGuideWord(null)}
                        aria-label="Close safety steps popup"
                        className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-md border border-[#194a2b] bg-[#06180d] text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Sinhala Safety Steps List */}
                    <ul className="mt-4 space-y-2.5">
                      {activeGuideWord.safetyStepsSi.map((step, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 rounded-md border border-[#123620] bg-[#06130b] p-3 text-sm text-[#ddf5e6] leading-relaxed"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00ff66] font-mono-tech text-[11px] font-bold text-[#031208] tabular-nums">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Popup Footer Close Button */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#143d23] pt-3.5">
                      <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-[#7ab892]">
                        <ShieldCheck className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                        <span>Stay Safe Online</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveGuideWord(null)}
                        className="min-h-[40px] rounded-md bg-[#00ff66] px-5 py-2 font-mono-tech text-xs font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
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
