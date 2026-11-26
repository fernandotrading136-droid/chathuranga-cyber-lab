import { useState, type FormEvent } from 'react';
import { MotionConfig, motion } from 'motion/react';
import {
  ArrowLeft,
  AlertTriangle,
  Terminal as TerminalIcon,
  Play,
  Star,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { KaudaMekaHackKareVideo } from './KaudaMekaHackKareVideo';
import { playCorrect, playWrong } from '../utils/soundEffects';

interface HackDefenseLessonPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const TARGET_COMMAND = 'enable_firewall';

function isValidDefenseCommand(raw: string): boolean {
  const normalized = raw.trim().toLowerCase().replace(/\(\)$/, '');
  return normalized === TARGET_COMMAND || normalized === 'enable firewall';
}

export function HackDefenseLessonPage({
  onBack,
  onComplete,
}: HackDefenseLessonPageProps) {
  const [codeInput, setCodeInput] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [showHintCode, setShowHintCode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'success'>('idle');
  const [logs, setLogs] = useState<
    { id: string; text: string; tone: 'red' | 'green' | 'muted' }[]
  >([
    {
      id: 'init-1',
      text: '[SYSTEM] Website under attack! Waiting for defense command...',
      tone: 'red',
    },
  ]);

  const handleRunCommand = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (!trimmed) return;

    if (isValidDefenseCommand(trimmed)) {
      playCorrect();
      setStatus('success');
      setLogs((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `hacker@defense:~$ ${trimmed}`, tone: 'muted' },
        {
          id: `ok-${Date.now()}`,
          text: '[SUCCESS] Firewall & SQL Shield Activated! Attacker IP blocked.',
          tone: 'green',
        },
      ]);
      onComplete();
    } else {
      playWrong();
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      setStatus('wrong');
      setLogs((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `hacker@defense:~$ ${trimmed}`, tone: 'muted' },
        {
          id: `err-${Date.now()}`,
          text: '[ERROR] WRONG CODE - TRY AGAIN',
          tone: 'red',
        },
      ]);
    }
  };

  const handleResetLesson = () => {
    setCodeInput('');
    setWrongCount(0);
    setShowHintCode(false);
    setStatus('idle');
    setLogs([
      {
        id: 'init-reset',
        text: '[SYSTEM] Website under attack! Waiting for defense command...',
        tone: 'red',
      },
    ]);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-6">
        {/* Top Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] inline-flex items-center gap-2 rounded-md border border-[#00ff66]/45 bg-[#06120a] px-4 py-2 font-mono-tech text-xs sm:text-sm font-semibold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </button>

          <span className="font-mono-tech text-xs text-[#7ab592]">
            LESSON LAB · HACK EKEN BERENA VIDIYA
          </span>
        </div>

        {/* 1. TOP STORY + RED WARNING ANIMATION */}
        <section
          aria-labelledby="story-heading"
          className={`rounded-lg border p-5 sm:p-6 transition-colors duration-300 ${
            status === 'success'
              ? 'border-[#00ff66] bg-[#041209] shadow-[0_0_32px_rgba(0,255,102,0.2)]'
              : 'border-[#ff3b5c] bg-[#140408] shadow-[0_0_32px_rgba(255,59,92,0.28)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]"
                >
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [1, 0.75, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#ff3b5c] bg-[#ff3b5c]/20 text-[#ff3b5c] shadow-[0_0_20px_rgba(255,59,92,0.65)]"
                >
                  <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              )}

              <div>
                <p
                  className={`font-mono-tech text-xs font-bold tracking-wider ${
                    status === 'success' ? 'text-[#00ff66]' : 'text-[#ff4d6d]'
                  }`}
                >
                  {status === 'success'
                    ? 'WEBSITE PROTECTED · ATTACK STOPPED'
                    : 'CRITICAL SECURITY ALERT · WEBSITE HACKED!'}
                </p>
                <h2
                  id="story-heading"
                  className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#f2fbff]"
                >
                  HACK EKEN BERENA VIDIYA (හැක් එකෙන් බේරෙන විදිය)
                </h2>
              </div>
            </div>

            {status === 'success' && (
              <button
                type="button"
                onClick={handleResetLesson}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded border border-[#00ff66]/50 bg-[#071a0e] px-3 py-1.5 font-mono-tech text-xs text-[#00ff66] hover:bg-[#00ff66]/20 cursor-pointer shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Replay Lesson</span>
              </button>
            )}
          </div>

          {/* Story Description */}
          <div className="mt-4 rounded-md border border-white/10 bg-black/45 p-4 space-y-2">
            <p className="text-sm sm:text-base text-[#f1f7fa] leading-relaxed">
              <strong className="text-[#ff6b85]">Story (කතාව):</strong>{' '}
              අද රාත්‍රියේ හැකර් කෙනෙක් අපේ පාසල් වෙබ් අඩවියේ Firewall එක නොමැති දුර්වල තැනකින් ඇතුළු වී වෙබ් අඩවිය Hack කර තිබෙනවා! පරිශීලක දත්ත සොරා ගැනීමට පෙර, ඔබ පහත Terminal එකේ නිවැරදි ආරක්ෂක කේතය (Defense Code) Type කර වෙබ් අඩවිය බේරා ගත යුතුයි.
            </p>
            <p className="font-mono-tech text-xs text-[#98d4b0]">
              A hacker breached the website because the firewall shield is OFF. Type the defense command below and press ENTER or click RUN to stop the hack!
            </p>
          </div>
        </section>

        {/* KAUDA MEKA HACK KARE Lesson Video Section */}
        <KaudaMekaHackKareVideo
          onJoinNow={() => {
            const el = document.getElementById('lesson-terminal-heading');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* 2. TERMINAL BOX WHERE USER CAN TYPE CODE & PRESS ENTER / RUN */}
        <section
          aria-labelledby="lesson-terminal-heading"
          className={`rounded-lg border bg-[#030704] p-4 sm:p-6 transition-all duration-300 ${
            status === 'wrong'
              ? 'border-[#ff3b5c] shadow-[0_0_28px_rgba(255,59,92,0.45)]'
              : status === 'success'
                ? 'border-[#00ff66] shadow-[0_0_28px_rgba(0,255,102,0.3)]'
                : 'border-[#00ff66]/40 shadow-[0_0_24px_rgba(0,255,102,0.08)]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#112e1d] pb-3">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
              <h3
                id="lesson-terminal-heading"
                className="font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#00ff66]"
              >
                DEFENSE TERMINAL
              </h3>
            </div>
            <span className="font-mono-tech text-xs text-[#7ab592]">
              TASK: ACTIVATE FIREWALL COMMAND
            </span>
          </div>

          {/* Terminal Log Window */}
          <div className="mt-4 h-36 overflow-y-auto rounded-md border border-[#0f2919] bg-[#010302] p-3.5 font-mono-tech text-xs space-y-1.5">
            {logs.map((line) => (
              <div
                key={line.id}
                className={
                  line.tone === 'red'
                    ? 'text-[#ff5c77]'
                    : line.tone === 'green'
                      ? 'text-[#00ff66]'
                      : 'text-[#739682]'
                }
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Command Input Form */}
          <form onSubmit={handleRunCommand} className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="lesson-code-input" className="sr-only">
              Type defense command code
            </label>
            <div className="flex flex-1 items-center rounded-md border border-[#19472c] bg-[#020503] px-3.5 py-2.5 focus-within:border-[#00ff66]">
              <span className="font-mono-tech text-sm text-[#00ff66] mr-2 select-none">
                $
              </span>
              <input
                id="lesson-code-input"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Type defense command (e.g. enable_...)"
                autoComplete="off"
                className="w-full bg-transparent font-mono-tech text-sm text-[#e6f7ed] placeholder-[#4f7a60] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-md bg-[#00ff66] px-6 py-2.5 font-mono-tech text-sm font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer shrink-0"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>RUN</span>
            </button>
          </form>

          {/* 3. WRONG CODE FEEDBACK (RED STAR / RED GLOW) */}
          {status === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#ff3b5c] bg-[#1c050a] px-4 py-3 shadow-[0_0_24px_rgba(255,59,92,0.5)]"
            >
              <div className="flex items-center gap-2.5">
                <Star
                  className="h-5 w-5 fill-[#ff3b5c] text-[#ff3b5c] shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono-tech text-sm font-bold text-[#ff4d6d]">
                  WRONG CODE - TRY AGAIN
                </span>
              </div>
              <span className="font-mono-tech text-xs text-[#ff99aa] tabular-nums">
                Wrong attempts: {wrongCount}
              </span>
            </motion.div>
          )}

          {/* 4. HINT BUTTON AFTER 2 WRONG ATTEMPTS */}
          {wrongCount >= 2 && status !== 'success' && (
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowHintCode((prev) => !prev)}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-md border border-[#facc15]/60 bg-[#facc15]/10 px-4 py-2 font-mono-tech text-xs sm:text-sm font-bold text-[#facc15] hover:bg-[#facc15]/20 transition-colors cursor-pointer"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                <span>SHOW CORRECT CODE</span>
              </button>

              {showHintCode && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-[#00ff66]/50 bg-[#05140b] p-3.5">
                  <div>
                    <p className="font-mono-tech text-xs text-[#89c9a1]">
                      HINT — Type this exact code in the terminal:
                    </p>
                    <p className="mt-1 font-mono-tech text-base font-bold text-[#00ff66]">
                      {TARGET_COMMAND}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCodeInput(TARGET_COMMAND)}
                    className="min-h-[38px] rounded border border-[#00ff66]/60 bg-[#00ff66]/15 px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer shrink-0"
                  >
                    Fill Terminal
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. GREEN SUCCESS ANIMATION & STAY SAFE EXPLANATION */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mt-5 rounded-lg border-2 border-[#00ff66] bg-[#04140a] p-5 shadow-[0_0_36px_rgba(0,255,102,0.3)] space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -20, scale: 0.6 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-[#031208]"
                >
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </motion.div>
                <div>
                  <p className="font-mono-tech text-sm sm:text-base font-bold text-[#00ff66]">
                    SUCCESS! WEBSITE HACK EKEN BERUNA!
                  </p>
                  <p className="text-xs text-[#9edbb5]">
                    Firewall activated and malicious attacker traffic blocked.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#123d23] pt-4 space-y-2.5">
                <h4 className="font-display text-base font-bold text-[#e6f7ed]">
                  මෙවැනි Hack ප්‍රහාරයකින් ආරක්ෂා වන ආකාරය (How to Stay Safe):
                </h4>
                <ul className="space-y-2 text-sm text-[#cdeedd] leading-relaxed">
                  <li>
                    <strong className="text-[#00ff66]">1. Enable Firewall (WAF):</strong>{' '}
                    වෙබ් අඩවියට එන සැකසහිත Traffic සහ SQL Injection ප්‍රහාර Web Application Firewall එකක් මගින් ස්වයංක්‍රීයව නවත්වන්න.
                  </li>
                  <li>
                    <strong className="text-[#00ff66]">2. Strong Admin Password + 2FA:</strong>{' '}
                    Admin ගිණුම් සඳහා අකුරු, ඉලක්කම් සහ සංකේත මිශ්‍ර ශක්තිමත් මුරපදයක් සමඟ Two-Factor Authentication (2FA) අනිවාර්යයෙන් දමන්න.
                  </li>
                  <li>
                    <strong className="text-[#00ff66]">3. Always Update Software:</strong>{' '}
                    වෙබ් අඩවියේ Plugins, Themes සහ Server Updates නිතර යාවත්කාලීන කර ආරක්ෂක හිඩැස් වසා දමන්න.
                  </li>
                  <li>
                    <strong className="text-[#00ff66]">4. Keep Regular Backups:</strong>{' '}
                    හදිසියේ ප්‍රහාරයක් එල්ල වුවහොත් වෙබ් අඩවිය ඉක්මනින් නැවත පිහිටුවීමට Daily Offline Backups තබාගන්න.
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </MotionConfig>
  );
}
