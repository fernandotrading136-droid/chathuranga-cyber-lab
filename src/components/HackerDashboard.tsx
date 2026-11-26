import { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCw,
  Target,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Radar,
  ArrowRight,
} from 'lucide-react';

interface HackerDashboardProps {
  onJumpToQuiz: () => void;
  onJumpToDictionary: () => void;
  onOpenHackLesson: () => void;
  hackLessonCompleted: boolean;
  onOpenWorldAttackLesson: () => void;
  worldAttackCompleted: boolean;
}

interface CodeScript {
  id: string;
  label: string;
  lines: string[];
}

const CODE_SCRIPTS: CodeScript[] = [
  {
    id: 'auth',
    label: 'Auth Check',
    lines: [
      'import { verifyHash, check2FA } from "./security";',
      'const user = await auth.inspect("hacker_session_01");',
      'if (!user.hasTwoFactor) {',
      '  console.warn("[ALERT] Enable 2FA to protect account!");',
      '}',
      'const entropy = calcPasswordBits("K#9mP!4vL@8xQ");',
      'console.log(`[PASS] Entropy: ${entropy} bits -> STRONG`);',
    ],
  },
  {
    id: 'phishing',
    label: 'Phishing Scan',
    lines: [
      'const emailHeader = parseMail("alert@bank-verify-login.xyz");',
      'const spfOk = verifySPF(emailHeader.domain);',
      'if (!spfOk) {',
      '  blockSender(emailHeader.sender);',
      '  console.log("[BLOCKED] Phishing link neutralized!");',
      '}',
      'console.log("[TIP] Always check HTTPS & real domain.");',
    ],
  },
  {
    id: 'wifi',
    label: 'WiFi Shield',
    lines: [
      'const wlan = scanInterface("wlan0");',
      'if (wlan.encryption !== "WPA3") {',
      '  enableVPNTunnel({ protocol: "WireGuard", port: 51820 });',
      '}',
      'firewall.dropInboundPorts([21, 23, 445]);',
      'console.log("[SECURE] Public WiFi traffic encrypted.");',
    ],
  },
];

interface MissionItem {
  id: string;
  title: string;
  subtitleSi: string;
  progress: number;
  tipSi: string;
}

const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'hacking-basics',
    title: 'Hacking Basics',
    subtitleSi: 'Ethical Hacking & පද්ධති ආරක්ෂාව',
    progress: 75,
    tipSi: 'Ethical Hackers පද්ධතිවල දුර්වලතා සොයා ඒවා ආරක්ෂා කිරීමට උදව් කරති.',
  },
  {
    id: 'password-security',
    title: 'Password Security',
    subtitleSi: 'ශක්තිමත් මුරපද සහ 2FA',
    progress: 50,
    tipSi: 'සෑම ගිණුමකටම අකුරු 12+ ක වෙනස් Password එකක් සහ 2FA භාවිතා කරන්න.',
  },
  {
    id: 'phishing',
    title: 'Phishing',
    subtitleSi: 'ව්‍යාජ Email & SMS හඳුනාගැනීම',
    progress: 50,
    tipSi: 'OTP හෝ Password ඉල්ලා එන නොදන්නා Links කිසිවිටෙක Click නොකරන්න.',
  },
  {
    id: 'wifi-security',
    title: 'WiFi Security',
    subtitleSi: 'WPA3 & Public WiFi ආරක්ෂාව',
    progress: 25,
    tipSi: 'පොදු Free WiFi භාවිතයේදී VPN සහ HTTPS වෙබ් අඩවි පමණක් භාවිතා කරන්න.',
  },
];

interface MapNode {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  latencyMs: number;
  packets: number;
  blocked: number;
}

const MAP_NODES: MapNode[] = [
  { id: 'lk', name: 'Colombo, LK', code: 'CMB-01', x: 254, y: 112, latencyMs: 14, packets: 1240, blocked: 18 },
  { id: 'sg', name: 'Singapore, SG', code: 'SIN-02', x: 282, y: 120, latencyMs: 28, packets: 2180, blocked: 31 },
  { id: 'uk', name: 'London, UK', code: 'LON-03', x: 168, y: 54, latencyMs: 112, packets: 1890, blocked: 24 },
  { id: 'us', name: 'New York, US', code: 'NYC-04', x: 96, y: 68, latencyMs: 148, packets: 2640, blocked: 42 },
  { id: 'jp', name: 'Tokyo, JP', code: 'TYO-05', x: 318, y: 74, latencyMs: 64, packets: 1975, blocked: 27 },
];

export function HackerDashboard({
  onJumpToQuiz,
  onJumpToDictionary,
  onOpenHackLesson,
  hackLessonCompleted,
  onOpenWorldAttackLesson,
  worldAttackCompleted,
}: HackerDashboardProps) {
  // 1. Live Terminal typing state
  const [scriptIdx, setScriptIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  const currentScript = CODE_SCRIPTS[scriptIdx];
  const fullCodeText = currentScript.lines.join('\n');

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setCharCount(fullCodeText.length);
      return;
    }
    if (isTypingPaused) return;

    const timer = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= fullCodeText.length) {
          return prev;
        }
        return prev + 1;
      });
    }, 26);

    return () => window.clearInterval(timer);
  }, [fullCodeText, isTypingPaused]);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop =
        terminalScrollRef.current.scrollHeight;
    }
  }, [charCount]);

  const handleSelectScript = (index: number) => {
    setScriptIdx(index);
    setCharCount(0);
    setIsTypingPaused(false);
  };

  // 2. Learning Missions state
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string>('hacking-basics');

  const handleAdvanceMission = (id: string) => {
    setActiveMissionId(id);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextProgress = m.progress >= 100 ? 25 : Math.min(100, m.progress + 25);
        return { ...m, progress: nextProgress };
      })
    );
  };

  const selectedMission =
    missions.find((m) => m.id === activeMissionId) ?? missions[0];

  // 3. Activity Status World Map state
  const [isScanningMap, setIsScanningMap] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('lk');
  const [scanCount, setScanCount] = useState(1420);
  const [threatsBlocked, setThreatsBlocked] = useState(142);

  useEffect(() => {
    if (!isScanningMap) return;
    const interval = window.setInterval(() => {
      setScanCount((prev) => prev + Math.floor(Math.random() * 14 + 4));
    }, 1100);
    return () => window.clearInterval(interval);
  }, [isScanningMap]);

  const selectedNode =
    MAP_NODES.find((n) => n.id === selectedNodeId) ?? MAP_NODES[0];

  const handleTriggerPulseScan = () => {
    setIsScanningMap(true);
    setScanCount((prev) => prev + 64);
    setThreatsBlocked((prev) => prev + 1);
  };

  const typedOutput = fullCodeText.slice(0, charCount);

  return (
    <section
      aria-labelledby="hacker-dashboard-heading"
      className="rounded-lg border border-[#00ff66]/35 bg-[#040806] p-4 sm:p-5 shadow-[0_0_32px_rgba(0,255,102,0.08)]"
    >
      {/* Dashboard Top Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f2b1a] pb-3.5">
        <div className="flex items-center gap-2.5">
          <Radar className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
          <div>
            <h2
              id="hacker-dashboard-heading"
              className="font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#00ff66]"
            >
              HACKER DASHBOARD
            </h2>
            <p className="text-xs text-[#7ab592]">
              Live Code Stream · Learning Missions · Global Scan Monitor
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onJumpToQuiz}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#00ff66]/50 bg-[#00ff66]/10 px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#00ff66] hover:bg-[#00ff66]/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Start Quiz</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onJumpToDictionary}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#174229] bg-[#07110b] px-3 py-1.5 font-mono-tech text-xs font-medium text-[#98d4b0] hover:border-[#00ff66]/50 hover:text-[#00ff66] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Cyber Words</span>
          </button>
        </div>
      </div>

      {/* 3-Column Hacker Dashboard Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 1. LIVE TERMINAL with typing green code animation */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-md border border-[#00ff66]/30 bg-[#020503] p-3.5">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[#0f2919] pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#00ff66]">
                  1. LIVE TERMINAL
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsTypingPaused((p) => !p)}
                  aria-label={isTypingPaused ? 'Resume typing' : 'Pause typing'}
                  className="inline-flex h-7 items-center gap-1 rounded border border-[#143822] bg-[#061009] px-2 font-mono-tech text-[11px] text-[#00ff66] hover:border-[#00ff66] cursor-pointer"
                >
                  {isTypingPaused ? (
                    <>
                      <Play className="h-3 w-3" aria-hidden="true" />
                      <span>Run</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCharCount(0);
                    setIsTypingPaused(false);
                  }}
                  aria-label="Replay typing code"
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#143822] bg-[#061009] text-[#84bf9b] hover:border-[#00ff66] hover:text-[#00ff66] cursor-pointer"
                >
                  <RotateCw className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Script Selector Tabs */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {CODE_SCRIPTS.map((script, idx) => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => handleSelectScript(idx)}
                  className={`min-h-[32px] rounded px-2.5 py-1 font-mono-tech text-[11px] transition-colors cursor-pointer ${
                    scriptIdx === idx
                      ? 'bg-[#00ff66] text-[#021006] font-bold'
                      : 'border border-[#143622] bg-[#050c08] text-[#7fb896] hover:text-[#00ff66]'
                  }`}
                >
                  {script.label}
                </button>
              ))}
            </div>

            {/* Typing Green Code Output */}
            <div
              ref={terminalScrollRef}
              className="mt-2.5 h-48 overflow-y-auto rounded border border-[#0f2919] bg-[#010302] p-3 font-mono-tech text-[11px] leading-relaxed text-[#00ff66]"
            >
              <pre className="whitespace-pre-wrap break-words">
                {typedOutput}
                <span className="terminal-cursor" aria-hidden="true" />
              </pre>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between font-mono-tech text-[11px] text-[#6fa886]">
            <span>
              STATUS: {charCount >= fullCodeText.length ? 'EXECUTED' : 'TYPING...'}
            </span>
            <span className="tabular-nums">
              {charCount}/{fullCodeText.length} CHARS
            </span>
          </div>
        </div>

        {/* 2. LEARNING MISSIONS with progress bars */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-md border border-[#00ff66]/30 bg-[#020503] p-3.5">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[#0f2919] pb-2.5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#00ff66]">
                  2. LEARNING MISSIONS
                </h3>
              </div>
              <span className="font-mono-tech text-[11px] text-[#7ab592] tabular-nums">
                {missions.filter((m) => m.progress === 100).length}/4 DONE
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {/* New Lesson Card: STOP THE HACK - LIVE WORLD ATTACK! */}
              <button
                type="button"
                onClick={onOpenWorldAttackLesson}
                className="w-full text-left rounded-md border-2 border-[#00ff66] bg-[#06180d] p-3 shadow-[0_0_20px_rgba(0,255,102,0.25)] transition-all hover:bg-[#092414] hover:shadow-[0_0_26px_rgba(0,255,102,0.45)] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded bg-[#00ff66] px-1.5 py-0.5 font-mono-tech text-[10px] font-bold tracking-wider text-[#031208]">
                        LIVE
                      </span>
                      {worldAttackCompleted && (
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-[#00ff66]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-mono-tech text-xs font-bold text-[#00ff66] truncate">
                        STOP THE HACK - LIVE WORLD ATTACK!
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#c7f2d7] truncate">
                      EPIDEMIC 2050 World Map · Attack eka nawaththanna!
                    </p>
                  </div>

                  <span className="shrink-0 rounded border border-[#00ff66] bg-[#00ff66]/15 px-2.5 py-1 font-mono-tech text-[11px] font-bold text-[#00ff66]">
                    {worldAttackCompleted ? '100% OPEN' : 'PLAY'}
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#0e2618]">
                  <div
                    className="h-full rounded-full bg-[#00ff66] transition-all duration-200"
                    style={{ width: worldAttackCompleted ? '100%' : '20%' }}
                  />
                </div>
              </button>

              {/* Featured Top Lesson Card: HACK EKEN BERENA VIDIYA */}
              <button
                type="button"
                onClick={onOpenHackLesson}
                className="w-full text-left rounded-md border-2 border-[#ff3b5c] bg-[#19050a] p-3 shadow-[0_0_20px_rgba(255,59,92,0.3)] transition-all hover:bg-[#24070e] hover:shadow-[0_0_26px_rgba(255,59,92,0.5)] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded bg-[#ff3b5c] px-1.5 py-0.5 font-mono-tech text-[10px] font-bold tracking-wider text-white">
                        NEW
                      </span>
                      {hackLessonCompleted && (
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-[#00ff66]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-mono-tech text-xs font-bold text-[#ff8fa3] truncate">
                        HACK EKEN BERENA VIDIYA
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#ffd6de] truncate">
                      වෙබ් අඩවියක් Hack වීමෙන් බේරෙන හැටි · Interactive Lab
                    </p>
                  </div>

                  <span className="shrink-0 rounded border border-[#ff3b5c] bg-[#ff3b5c]/20 px-2.5 py-1 font-mono-tech text-[11px] font-bold text-[#ff8fa3]">
                    {hackLessonCompleted ? '100% OPEN' : 'OPEN'}
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#330c15]">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      hackLessonCompleted ? 'bg-[#00ff66]' : 'bg-[#ff3b5c]'
                    }`}
                    style={{ width: hackLessonCompleted ? '100%' : '15%' }}
                  />
                </div>
              </button>

              {missions.map((mission) => {
                const isSelected = mission.id === activeMissionId;
                const isDone = mission.progress >= 100;
                return (
                  <div
                    key={mission.id}
                    className={`rounded border p-2.5 transition-colors ${
                      isSelected
                        ? 'border-[#00ff66]/60 bg-[#07150c]'
                        : 'border-[#112e1d] bg-[#040a06]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveMissionId(mission.id)}
                        className="text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          {isDone && (
                            <CheckCircle2
                              className="h-3.5 w-3.5 shrink-0 text-[#00ff66]"
                              aria-hidden="true"
                            />
                          )}
                          <span className="font-mono-tech text-xs font-semibold text-[#e6f7ed] truncate">
                            {mission.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7ab592] truncate">
                          {mission.subtitleSi}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdvanceMission(mission.id)}
                        className="min-h-[32px] shrink-0 rounded border border-[#00ff66]/45 bg-[#00ff66]/10 px-2.5 py-1 font-mono-tech text-[11px] font-bold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer tabular-nums"
                      >
                        {isDone ? 'Reset' : `${mission.progress}% +`}
                      </button>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#0e2618]">
                      <div
                        className="h-full rounded-full bg-[#00ff66] transition-all duration-200"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Mission Sinhala Tip */}
          <div className="mt-3 rounded border border-[#123320] bg-[#050e08] p-2.5">
            <p className="font-mono-tech text-[10px] font-bold text-[#00ff66]">
              MISSION INTEL · {selectedMission.title.toUpperCase()}
            </p>
            <p className="mt-1 text-xs text-[#c2e8d0] leading-relaxed">
              {selectedMission.tipSi}
            </p>
          </div>
        </div>

        {/* 3. ACTIVITY STATUS panel with world map and scan data animation */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-md border border-[#00ff66]/30 bg-[#020503] p-3.5">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[#0f2919] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                <h3 className="font-mono-tech text-xs font-bold tracking-wider text-[#00ff66]">
                  3. ACTIVITY STATUS
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsScanningMap((s) => !s)}
                className="inline-flex h-7 items-center gap-1 rounded border border-[#143822] bg-[#061009] px-2.5 font-mono-tech text-[11px] text-[#00ff66] hover:border-[#00ff66] cursor-pointer"
              >
                {isScanningMap ? 'Pause Scan' : 'Resume Scan'}
              </button>
            </div>

            {/* Interactive SVG World Map with Neon Scan Sweep */}
            <div className="relative mt-3 overflow-hidden rounded border border-[#0f2919] bg-[#010402]">
              <svg
                viewBox="0 0 360 175"
                role="img"
                aria-label="Global cyber security network scan world map"
                className="block w-full h-44"
              >
                {/* Grid lines */}
                <g stroke="#0a2415" strokeWidth="0.6">
                  <line x1="0" y1="44" x2="360" y2="44" />
                  <line x1="0" y1="88" x2="360" y2="88" />
                  <line x1="0" y1="132" x2="360" y2="132" />
                  <line x1="90" y1="0" x2="90" y2="175" />
                  <line x1="180" y1="0" x2="180" y2="175" />
                  <line x1="270" y1="0" x2="270" y2="175" />
                </g>

                {/* Simplified Continent Silhouettes */}
                <g fill="#082414" stroke="#165933" strokeWidth="1">
                  {/* North America */}
                  <path d="M35,34 L88,28 L112,50 L98,82 L75,92 L58,76 L38,60 Z" />
                  {/* South America */}
                  <path d="M84,96 L112,102 L120,130 L102,158 L86,144 L80,118 Z" />
                  {/* Europe */}
                  <path d="M156,34 L196,28 L206,54 L182,66 L158,58 Z" />
                  {/* Africa */}
                  <path d="M156,68 L198,68 L214,96 L196,136 L172,134 L154,96 Z" />
                  {/* Asia */}
                  <path d="M206,30 L292,26 L326,56 L310,96 L264,108 L228,88 L206,62 Z" />
                  {/* Australia */}
                  <path d="M284,122 L326,120 L332,148 L294,152 Z" />
                </g>

                {/* Network Connection Arcs */}
                <g
                  fill="none"
                  stroke="#00ff66"
                  strokeOpacity="0.32"
                  strokeWidth="0.9"
                  strokeDasharray="3 3"
                >
                  <path d="M96,68 Q180,22 254,112" />
                  <path d="M168,54 Q212,68 254,112" />
                  <path d="M254,112 Q290,82 318,74" />
                  <path d="M254,112 L282,120" />
                </g>

                {/* Interactive Server / Scan Nodes */}
                {MAP_NODES.map((node) => {
                  const active = node.id === selectedNodeId;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer"
                    >
                      {active && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="10"
                          fill="none"
                          stroke="#00ff66"
                          strokeWidth="1"
                          strokeOpacity="0.65"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={active ? 4.5 : 3.2}
                        fill={active ? '#00ff66' : '#1fe072'}
                      />
                      <text
                        x={node.x + 6}
                        y={node.y - 4}
                        fill={active ? '#00ff66' : '#79b892'}
                        fontSize="7.5"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {node.code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Animated Scan Sweep Overlay */}
              {isScanningMap && (
                <div
                  aria-hidden="true"
                  className="map-scan-beam pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[#00ff66]/20 to-transparent border-r border-[#00ff66]/50"
                />
              )}
            </div>

            {/* Selected Node & Global Scan Counters */}
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono-tech text-xs">
              <div className="rounded border border-[#112e1d] bg-[#040a06] p-2.5">
                <p className="text-[10px] text-[#6ca683]">SELECTED NODE</p>
                <p className="mt-0.5 font-bold text-[#00ff66] truncate">
                  {selectedNode.name}
                </p>
                <p className="text-[11px] text-[#98d4b0] tabular-nums">
                  Ping: {selectedNode.latencyMs}ms
                </p>
              </div>
              <div className="rounded border border-[#112e1d] bg-[#040a06] p-2.5">
                <p className="text-[10px] text-[#6ca683]">SCAN TELEMETRY</p>
                <p className="mt-0.5 font-bold text-[#e6f7ed] tabular-nums">
                  {scanCount.toLocaleString()} PKTS
                </p>
                <p className="text-[11px] text-[#00ff66] tabular-nums">
                  Blocked: {threatsBlocked}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerPulseScan}
            className="mt-3 min-h-[42px] w-full inline-flex items-center justify-center gap-2 rounded border border-[#00ff66]/60 bg-[#00ff66]/10 px-4 py-2 font-mono-tech text-xs font-bold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>RUN GLOBAL SCAN</span>
          </button>
        </div>
      </div>
    </section>
  );
}
