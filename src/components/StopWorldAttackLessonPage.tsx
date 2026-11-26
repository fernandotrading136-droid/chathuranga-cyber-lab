import { useState, useEffect, useRef, type FormEvent } from 'react';
import { MotionConfig, motion } from 'motion/react';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { playCorrect, playWrong } from '../utils/soundEffects';

interface StopWorldAttackLessonPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const CORRECT_CODE = 'firewall block --all-attacks';

interface AttackHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
}

const ATTACK_HOTSPOTS: AttackHotspot[] = [
  { id: 'na', label: 'US-EAST', x: 148, y: 98 },
  { id: 'sa', label: 'BR-SAO', x: 186, y: 188 },
  { id: 'eu', label: 'UK-LON', x: 288, y: 74 },
  { id: 'af', label: 'AF-LAG', x: 304, y: 144 },
  { id: 'in', label: 'LK-CMB', x: 422, y: 146 },
  { id: 'cn', label: 'AS-BEJ', x: 468, y: 102 },
  { id: 'au', label: 'AU-SYD', x: 526, y: 204 },
];

const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  leftPct: (i * 37) % 100,
  delay: (i % 7) * 0.08,
  duration: 1.8 + (i % 5) * 0.35,
  color:
    i % 3 === 0 ? '#00ff66' : i % 3 === 1 ? '#00f0ff' : '#facc15',
  rotate: (i * 45) % 360,
}));

export function StopWorldAttackLessonPage({
  onBack,
  onComplete,
}: StopWorldAttackLessonPageProps) {
  const [status, setStatus] = useState<'attack' | 'wrong' | 'success'>('attack');
  const [attackCount, setAttackCount] = useState(600534);
  const [codeInput, setCodeInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<
    { id: string; text: string; tone: 'red' | 'green' | 'muted' }[]
  >([
    {
      id: 'init-1',
      text: '[ALERT] EPIDEMIC-2050 WORLD CYBER ATTACK DETECTED!',
      tone: 'red',
    },
    {
      id: 'init-2',
      text: '[INFO] Type the defense command below and press ENTER.',
      tone: 'muted',
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Live incrementing attack counter while attack is active
  useEffect(() => {
    if (status === 'success') return;
    const interval = window.setInterval(() => {
      setAttackCount((prev) => prev + Math.floor(Math.random() * 47 + 19));
    }, 180);
    return () => window.clearInterval(interval);
  }, [status]);

  const handleSubmitCode = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = codeInput.trim();
    if (!cleaned) return;

    if (cleaned.toLowerCase() === CORRECT_CODE) {
      playCorrect();
      setStatus('success');
      setTerminalLogs((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `root@cyber-lab:~# ${cleaned}`, tone: 'muted' },
        {
          id: `ok-${Date.now()}`,
          text: '[SUCCESS] SAARTHAKAI! OBA ATTACK EKA NAWATHUWA!',
          tone: 'green',
        },
      ]);
      onComplete();
    } else {
      playWrong();
      setStatus('wrong');
      setTerminalLogs((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `root@cyber-lab:~# ${cleaned}`, tone: 'muted' },
        {
          id: `err-${Date.now()}`,
          text: '[ERROR] WARADIYI! Niwaradi code eka mekai: firewall block --all-attacks',
          tone: 'red',
        },
      ]);
      inputRef.current?.focus();
    }
  };

  const handleReplay = () => {
    setStatus('attack');
    setAttackCount(600534);
    setCodeInput('');
    setTerminalLogs([
      {
        id: `reset-${Date.now()}`,
        text: '[ALERT] EPIDEMIC-2050 WORLD CYBER ATTACK DETECTED!',
        tone: 'red',
      },
    ]);
  };

  const isSuccess = status === 'success';

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] inline-flex items-center gap-2 rounded-md border border-[#00ff66]/45 bg-[#06120a] px-4 py-2 font-mono-tech text-xs sm:text-sm font-semibold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            {isSuccess && (
              <button
                type="button"
                onClick={handleReplay}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded border border-[#00ff66]/50 bg-[#071a0e] px-3 py-1.5 font-mono-tech text-xs text-[#00ff66] hover:bg-[#00ff66]/20 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Replay Simulation</span>
              </button>
            )}
            <span className="font-mono-tech text-xs font-bold text-[#00ff66]">
              STOP THE HACK - LIVE WORLD ATTACK!
            </span>
          </div>
        </div>

        {/* 1. TOP — ANIMATED WORLD ATTACK MAP LIKE EPIDEMIC 2050 */}
        <section
          aria-labelledby="world-attack-heading"
          className={`relative overflow-hidden rounded-lg border-2 p-4 sm:p-5 transition-colors duration-500 ${
            isSuccess
              ? 'border-[#00ff66] bg-[#031208] shadow-[0_0_40px_rgba(0,255,102,0.3)]'
              : 'border-[#ff3b5c] bg-[#060908] shadow-[0_0_36px_rgba(255,59,92,0.32)]'
          }`}
        >
          {/* Confetti Overlay on Success */}
          {isSuccess && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            >
              {CONFETTI_PIECES.map((piece) => (
                <motion.span
                  key={piece.id}
                  initial={{ y: -20, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 420,
                    opacity: [1, 1, 0],
                    rotate: piece.rotate + 360,
                  }}
                  transition={{
                    duration: piece.duration,
                    delay: piece.delay,
                    repeat: 1,
                    ease: 'easeOut',
                  }}
                  style={{
                    left: `${piece.leftPct}%`,
                    backgroundColor: piece.color,
                  }}
                  className="absolute top-0 h-2.5 w-1.5 rounded-xs"
                />
              ))}
            </div>
          )}

          {/* EPIDEMIC 2050 HUD Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#113320] pb-3">
            <div>
              <p className="font-mono-tech text-[10px] tracking-widest text-[#7ab592]">
                DISTRIBUTION MAP
              </p>
              <h2
                id="world-attack-heading"
                className="font-mono-tech text-lg sm:text-xl font-bold tracking-widest text-[#00ff66]"
              >
                EPIDEMIC - 2050 · LIVE WORLD MAP
              </h2>
            </div>

            {isSuccess ? (
              <div className="inline-flex items-center gap-2 rounded border border-[#00ff66] bg-[#00ff66]/15 px-3.5 py-2 font-mono-tech text-xs sm:text-sm font-bold text-[#00ff66]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>SYSTEM SECURED · ATTACKS STOPPED</span>
              </div>
            ) : (
              <motion.div
                animate={{ opacity: [1, 0.45, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                className="inline-flex items-center gap-2 rounded border border-[#ff3b5c] bg-[#ff3b5c]/20 px-3.5 py-2 font-mono-tech text-xs sm:text-sm font-bold text-[#ff4d6d] shadow-[0_0_20px_rgba(255,59,92,0.5)]"
              >
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <span>CRITICAL SITUATION - WORLD ATTACK!</span>
              </motion.div>
            )}
          </div>

          {/* Map + Side Telemetry HUD Grid */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* World Map Canvas */}
            <div
              className={`lg:col-span-9 relative overflow-hidden rounded-md border p-2 transition-colors duration-500 ${
                isSuccess
                  ? 'border-[#00ff66]/70 bg-[#021208]'
                  : 'border-[#164227] bg-[#020604]'
              }`}
            >
              <svg
                viewBox="0 0 640 280"
                role="img"
                aria-label="Animated world attack map"
                className="block w-full h-auto"
              >
                {/* Cyber HUD Grid */}
                <g
                  stroke={isSuccess ? '#0b4220' : '#0b2b18'}
                  strokeWidth="0.7"
                >
                  {[40, 80, 120, 160, 200, 240].map((y) => (
                    <line key={`h-${y}`} x1="0" y1={y} x2="640" y2={y} />
                  ))}
                  {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                    <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="280" />
                  ))}
                </g>

                {/* Detailed World Continents (turns bright green on success) */}
                <g
                  fill={isSuccess ? '#0a3d1f' : '#081f13'}
                  stroke={isSuccess ? '#00ff66' : '#35b874'}
                  strokeWidth={isSuccess ? '1.6' : '1.2'}
                  className="transition-all duration-500"
                >
                  {/* North America */}
                  <path d="M54,48 L128,36 L192,52 L214,82 L182,118 L142,134 L116,118 L92,98 L62,74 Z" />
                  {/* Greenland */}
                  <path d="M210,20 L254,18 L266,42 L232,52 L212,38 Z" />
                  {/* South America */}
                  <path d="M158,144 L208,154 L224,194 L196,248 L168,236 L154,182 Z" />
                  {/* Europe & UK */}
                  <path d="M278,44 L344,36 L362,68 L328,88 L282,78 Z" />
                  {/* Africa */}
                  <path d="M282,98 L352,96 L382,136 L354,218 L314,216 L282,152 Z" />
                  {/* Asia */}
                  <path d="M354,40 L516,32 L566,76 L534,132 L462,152 L404,132 L362,88 Z" />
                  {/* Sri Lanka / South Asia tip */}
                  <circle cx="424" cy="148" r="4" />
                  {/* Australia */}
                  <path d="M476,174 L554,170 L568,218 L508,228 L478,204 Z" />
                </g>

                {/* Attack Vectors / Green Defense Links */}
                {!isSuccess ? (
                  <g
                    fill="none"
                    stroke="#ff3b5c"
                    strokeWidth="1.2"
                    strokeOpacity="0.55"
                    strokeDasharray="4 4"
                  >
                    <path d="M148,98 Q220,40 288,74" />
                    <path d="M288,74 Q360,55 468,102" />
                    <path d="M468,102 Q450,130 422,146" />
                    <path d="M304,144 Q360,155 422,146" />
                    <path d="M468,102 Q510,150 526,204" />
                  </g>
                ) : (
                  <g
                    fill="none"
                    stroke="#00ff66"
                    strokeWidth="1.2"
                    strokeOpacity="0.45"
                  >
                    <path d="M148,98 Q220,40 288,74" />
                    <path d="M288,74 Q360,55 468,102" />
                    <path d="M422,146 L468,102" />
                  </g>
                )}

                {/* Blinking Red Dots (Disappear when SUCCESS) OR Green Secured Nodes */}
                {!isSuccess
                  ? ATTACK_HOTSPOTS.map((spot) => (
                      <g key={spot.id}>
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r="12"
                          fill="#ff3b5c"
                          fillOpacity="0.24"
                          className="animate-ping"
                          style={{ transformOrigin: `${spot.x}px ${spot.y}px` }}
                        />
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r="5.5"
                          fill="#ff2448"
                          stroke="#ffd6de"
                          strokeWidth="1"
                        />
                        <text
                          x={spot.x + 8}
                          y={spot.y - 6}
                          fill="#ff8fa3"
                          fontSize="8.5"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="700"
                        >
                          {spot.label}
                        </text>
                      </g>
                    ))
                  : ATTACK_HOTSPOTS.map((spot) => (
                      <g key={spot.id}>
                        <circle
                          cx={spot.x}
                          cy={spot.y}
                          r="5"
                          fill="#00ff66"
                          stroke="#e6f7ed"
                          strokeWidth="1"
                        />
                        <text
                          x={spot.x + 8}
                          y={spot.y - 6}
                          fill="#00ff66"
                          fontSize="8.5"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          SAFE
                        </text>
                      </g>
                    ))}
              </svg>

              {/* Map Bottom Status Banner */}
              <div className="mt-2 flex items-center justify-between px-2 font-mono-tech text-xs">
                <span className={isSuccess ? 'text-[#00ff66]' : 'text-[#ff4d6d]'}>
                  {isSuccess
                    ? 'ALL GLOBAL SECTORS GREEN · FIREWALL ACTIVE'
                    : 'WORLD ATTACK! · 7 ACTIVE BREACH POINTS'}
                </span>
                <span className="text-[#7ab592] tabular-nums">
                  MODE: {isSuccess ? 'PROTECTED' : 'DEFCON 1'}
                </span>
              </div>
            </div>

            {/* Right Telemetry Panel (Attack Counter + Radar) */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-3 rounded-md border border-[#123620] bg-[#030905] p-3.5">
              <div>
                <p className="font-mono-tech text-[11px] font-bold text-[#7ab592]">
                  {isSuccess ? 'ATTACKS NEUTRALIZED' : 'LIVE ATTACK COUNTER'}
                </p>
                <p
                  className={`mt-1 font-mono-tech text-2xl sm:text-3xl font-bold tabular-nums ${
                    isSuccess ? 'text-[#00ff66]' : 'text-[#ff3b5c]'
                  }`}
                >
                  {isSuccess ? '0 ACTIVE' : attackCount.toLocaleString()}
                </p>
                <p className="mt-1 font-mono-tech text-[11px] text-[#7ab592]">
                  {isSuccess
                    ? `${attackCount.toLocaleString()} malicious packets blocked`
                    : 'Incoming attacks per second...'}
                </p>
              </div>

              {/* Circular Radar Gauge */}
              <div className="flex flex-col items-center justify-center rounded-md border border-[#112e1d] bg-[#020503] py-4">
                <div
                  className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 transition-colors duration-500 ${
                    isSuccess
                      ? 'border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]'
                      : 'border-[#ff3b5c] bg-[#ff3b5c]/10 text-[#ff4d6d]'
                  }`}
                >
                  <span className="font-mono-tech text-[10px]">
                    {isSuccess ? 'SHIELD' : 'THREAT'}
                  </span>
                  <span className="font-mono-tech text-base font-bold tabular-nums">
                    {isSuccess ? '100%' : 'CRITICAL'}
                  </span>
                </div>
              </div>

              <div className="font-mono-tech text-[11px] text-[#84bf9b] space-y-1">
                <div className="flex justify-between">
                  <span>FIREWALL:</span>
                  <span className={isSuccess ? 'text-[#00ff66]' : 'text-[#ff4d6d]'}>
                    {isSuccess ? 'LOCKED' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>RED DOTS:</span>
                  <span className="tabular-nums">{isSuccess ? '0' : '7'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. QUESTION IN SINHALA + 3. CODE TERMINAL */}
        <section
          aria-labelledby="stop-attack-question-heading"
          className={`rounded-lg border p-4 sm:p-6 transition-all duration-300 ${
            status === 'wrong'
              ? 'border-[#ff3b5c] bg-[#120407] shadow-[0_0_28px_rgba(255,59,92,0.4)]'
              : isSuccess
                ? 'border-[#00ff66] bg-[#041209] shadow-[0_0_32px_rgba(0,255,102,0.28)]'
                : 'border-[#00ff66]/40 bg-[#030704] shadow-[0_0_24px_rgba(0,255,102,0.08)]'
          }`}
        >
          {/* Sinhala Question */}
          <div className="border-b border-[#112e1d] pb-4">
            <p className="font-mono-tech text-xs font-bold text-[#00ff66]">
              MISSION QUESTION
            </p>
            <h3
              id="stop-attack-question-heading"
              className="mt-1.5 font-display text-lg sm:text-xl font-bold text-[#eefbf3]"
            >
              &ldquo;Me Hacker ge attack eka niwaradiwa nawaththanna oni code eka mokakda?&rdquo;
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#84bf9b]">
              පහත Terminal එකේ නිවැරදි Firewall Command එක Type කර ENTER ඔබන්න.
            </p>
          </div>

          {/* Code Terminal Log */}
          <div className="mt-4 flex items-center gap-2 font-mono-tech text-xs text-[#00ff66]">
            <TerminalIcon className="h-4 w-4" aria-hidden="true" />
            <span>DEFENSE CODE TERMINAL</span>
          </div>

          <div className="mt-2 h-32 overflow-y-auto rounded-md border border-[#0f2919] bg-[#010302] p-3 font-mono-tech text-xs space-y-1.5">
            {terminalLogs.map((line) => (
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

          {/* Terminal Input Form */}
          <form onSubmit={handleSubmitCode} className="mt-3.5 flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="world-attack-code-input" className="sr-only">
              Type firewall command to stop the world attack
            </label>
            <div className="flex flex-1 items-center rounded-md border border-[#19472c] bg-[#020503] px-3.5 py-2.5 focus-within:border-[#00ff66]">
              <span className="font-mono-tech text-sm text-[#00ff66] mr-2 select-none">
                $
              </span>
              <input
                ref={inputRef}
                id="world-attack-code-input"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Type code here and press ENTER..."
                autoComplete="off"
                className="w-full bg-transparent font-mono-tech text-sm text-[#e6f7ed] placeholder-[#4f7a60] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-md bg-[#00ff66] px-6 py-2.5 font-mono-tech text-sm font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer shrink-0"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>ENTER / RUN</span>
            </button>
          </form>

          {/* WRONG CODE FEEDBACK */}
          {status === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-4 rounded-md border-2 border-[#ff3b5c] bg-[#1e050a] p-4 shadow-[0_0_24px_rgba(255,59,92,0.45)]"
            >
              <p className="font-mono-tech text-base sm:text-lg font-bold text-[#ff3b5c]">
                WARADIYI!
              </p>
              <p className="mt-1 font-mono-tech text-xs sm:text-sm text-[#ffd6de]">
                Niwaradi code eka mekai:{' '}
                <strong className="text-[#00ff66] select-all">
                  {CORRECT_CODE}
                </strong>
              </p>
            </motion.div>
          )}

          {/* SUCCESS CELEBRATION BANNER */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="mt-5 rounded-lg border-2 border-[#00ff66] bg-[#04170b] p-5 shadow-[0_0_36px_rgba(0,255,102,0.35)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00ff66] text-[#031208]">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                      <span className="font-mono-tech text-xs font-bold text-[#9edbb5]">
                        MISSION ACCOMPLISHED
                      </span>
                    </div>
                    <h4 className="mt-0.5 font-display text-lg sm:text-2xl font-bold text-[#00ff66]">
                      SAARTHAKAI! OBA ATTACK EKA NAWATHUWA!
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-[#cdeedd]">
                      ඔබ Firewall Rule එක ක්‍රියාත්මක කර ලොව පුරා පැතිරුණු සයිබර් ප්‍රහාරය සම්පූර්ණයෙන්ම නවතා දැමුවා!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </MotionConfig>
  );
}
