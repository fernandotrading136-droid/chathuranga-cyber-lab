import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Terminal as TerminalIcon, ScanLine, LogIn, RotateCcw } from 'lucide-react';

interface TerminalLine {
  id: string;
  text: string;
  tone: 'green' | 'cyan' | 'muted' | 'warn';
}

interface TerminalBoxProps {
  onEnterSystem: () => void;
  onJumpDictionary: () => void;
  quizScore: number;
  quizCompleted: boolean;
}

const INITIAL_LOGS: TerminalLine[] = [
  {
    id: 'boot-1',
    text: 'root@chathuranga-lab:~# ./init_session_01.sh',
    tone: 'muted',
  },
  {
    id: 'boot-2',
    text: '[OK] Cyber Security Learning Module loaded (Sinhala + English)',
    tone: 'cyan',
  },
];

export function TerminalBox({
  onEnterSystem,
  onJumpDictionary,
  quizScore,
  quizCompleted,
}: TerminalBoxProps) {
  const [logs, setLogs] = useState<TerminalLine[]>(INITIAL_LOGS);
  const [isScanning, setIsScanning] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const scanTimersRef = useRef<number[]>([]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      scanTimersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const appendLog = (text: string, tone: TerminalLine['tone'] = 'green') => {
    setLogs((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, tone },
    ]);
  };

  const handleScanSystem = () => {
    if (isScanning) return;
    setIsScanning(true);
    scanTimersRef.current.forEach((t) => window.clearTimeout(t));
    scanTimersRef.current = [];

    const steps: { delay: number; text: string; tone: TerminalLine['tone'] }[] = [
      {
        delay: 120,
        text: '> Running beginner security scan... (පද්ධති පරීක්ෂාව ආරම්භ විය)',
        tone: 'cyan',
      },
      {
        delay: 500,
        text: '[CHECK 1/4] Firewall Shield ............. ACTIVE',
        tone: 'green',
      },
      {
        delay: 900,
        text: '[CHECK 2/4] HTTPS Encryption ............ VERIFIED',
        tone: 'green',
      },
      {
        delay: 1300,
        text: '[CHECK 3/4] Phishing Defense ............ READY FOR TRAINING',
        tone: 'warn',
      },
      {
        delay: 1700,
        text: '[CHECK 4/4] Session 1 Quiz (5 Questions). UNLOCKED',
        tone: 'cyan',
      },
      {
        delay: 2050,
        text: 'Scan complete! Click ENTER SYSTEM to start the Sinhala Quiz.',
        tone: 'green',
      },
    ];

    steps.forEach((step, idx) => {
      const id = window.setTimeout(() => {
        appendLog(step.text, step.tone);
        if (idx === steps.length - 1) {
          setIsScanning(false);
        }
      }, step.delay);
      scanTimersRef.current.push(id);
    });
  };

  const handleEnterSystem = () => {
    appendLog('> Entering Session 1 Quiz Mode... Good luck, Hacker!', 'cyan');
    onEnterSystem();
  };

  const handleResetTerminal = () => {
    scanTimersRef.current.forEach((t) => window.clearTimeout(t));
    setIsScanning(false);
    setLogs(INITIAL_LOGS);
  };

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    appendLog(`hacker@lab:~$ ${commandInput.trim()}`, 'muted');
    setCommandInput('');

    if (cmd === 'help') {
      appendLog(
        'Commands: scan | quiz | words | status | clear',
        'cyan'
      );
    } else if (cmd === 'scan') {
      handleScanSystem();
    } else if (cmd === 'quiz' || cmd === 'start') {
      handleEnterSystem();
    } else if (cmd === 'words' || cmd === 'dict') {
      appendLog('> Opening Cyber Words Dictionary...', 'cyan');
      onJumpDictionary();
    } else if (cmd === 'status') {
      appendLog(
        `USER: HACKER | SESSION: 1 | SCORE: ${quizScore}/5 | COMPLETED: ${quizCompleted ? 'YES' : 'IN PROGRESS'}`,
        'green'
      );
    } else if (cmd === 'clear') {
      handleResetTerminal();
    } else {
      appendLog(
        `Unknown command "${cmd}". Type "help" for available commands.`,
        'warn'
      );
    }
  };

  return (
    <section
      aria-labelledby="terminal-heading"
      className="flex flex-col justify-between rounded-lg border border-[#00ff66]/30 bg-[#070c10] p-4 sm:p-6 shadow-[0_0_30px_rgba(0,255,102,0.06)]"
    >
      <div>
        {/* Box Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#142630] pb-3">
          <div className="flex items-center gap-2.5">
            <TerminalIcon className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
            <h2
              id="terminal-heading"
              className="font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#00ff66]"
            >
              TERMINAL
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetTerminal}
            title="Clear terminal logs"
            className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono-tech text-xs text-[#7fa6b8] hover:bg-[#0f1c24] hover:text-[#00f0ff] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        {/* Hero Terminal Prompt Line */}
        <div className="mt-4 rounded-md border border-[#122631] bg-[#040709] p-4">
          <p className="font-mono-tech text-base sm:text-lg font-medium text-[#00ff66] leading-relaxed">
            <span className="text-[#00f0ff] mr-2" aria-hidden="true">
              $
            </span>
            Welcome Hacker... Quiz eka patan ganna
            <span className="terminal-cursor" aria-hidden="true" />
          </p>
          <p className="mt-2 text-xs sm:text-sm text-[#9cc0d0]">
            සයිබර් ආරක්ෂාව මුල සිට සිංහලෙන් සහ ඉංග්‍රීසියෙන් ඉගෙන ගැනීමට පහත බොත්තම් භාවිතා කරන්න.
          </p>
        </div>

        {/* Scrollable Log Output */}
        <div
          ref={logContainerRef}
          aria-live="polite"
          className="mt-3 h-40 overflow-y-auto rounded-md border border-[#102029] bg-[#030507] p-3 font-mono-tech text-xs space-y-1.5"
        >
          {logs.map((line) => {
            const colorClass =
              line.tone === 'green'
                ? 'text-[#00ff66]'
                : line.tone === 'cyan'
                  ? 'text-[#00f0ff]'
                  : line.tone === 'warn'
                    ? 'text-[#facc15]'
                    : 'text-[#7392a3]';
            return (
              <div key={line.id} className={`${colorClass} leading-relaxed break-words`}>
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Interactive CLI Command Prompt */}
        <form onSubmit={handleCommandSubmit} className="mt-3 flex items-center gap-2">
          <label htmlFor="cli-input" className="sr-only">
            Terminal command input
          </label>
          <div className="flex flex-1 items-center rounded-md border border-[#152d3a] bg-[#040709] px-3 py-2 focus-within:border-[#00f0ff]">
            <span className="font-mono-tech text-xs text-[#00f0ff] mr-2 select-none">
              &gt;
            </span>
            <input
              id="cli-input"
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='Type "help", "scan", "quiz", or "words"...'
              className="w-full bg-transparent font-mono-tech text-xs text-[#e2f1f8] placeholder-[#527080] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[40px] rounded-md border border-[#1b3a4a] bg-[#0c1820] px-3 py-2 font-mono-tech text-xs font-medium text-[#00f0ff] hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            Run
          </button>
        </form>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleScanSystem}
          disabled={isScanning}
          className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-md border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-4 py-2.5 font-mono-tech text-sm font-semibold text-[#00f0ff] hover:bg-[#00f0ff]/20 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#00f0ff]"
        >
          <ScanLine className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{isScanning ? 'SCANNING...' : 'SCAN SYSTEM'}</span>
        </button>

        <button
          type="button"
          onClick={handleEnterSystem}
          className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-md bg-[#00ff66] px-4 py-2.5 font-mono-tech text-sm font-bold text-[#031208] hover:bg-[#26ff80] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#00ff66]"
        >
          <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>ENTER SYSTEM</span>
        </button>
      </div>
    </section>
  );
}
