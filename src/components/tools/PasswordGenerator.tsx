import { useState, useCallback, useEffect } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
} from 'lucide-react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIGUOUS = /[0O1lI]/g;

function getRandomInt(max: number): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedHistoryIdx, setCopiedHistoryIdx] = useState<number | null>(null);

  const generatePassword = useCallback(() => {
    let pool = '';
    const guaranteed: string[] = [];

    const clean = (chars: string) =>
      excludeAmbiguous ? chars.replace(AMBIGUOUS, '') : chars;

    if (useUpper) {
      const c = clean(UPPER);
      pool += c;
      guaranteed.push(c[getRandomInt(c.length)]);
    }
    if (useLower) {
      const c = clean(LOWER);
      pool += c;
      guaranteed.push(c[getRandomInt(c.length)]);
    }
    if (useNumbers) {
      const c = clean(NUMBERS);
      pool += c;
      guaranteed.push(c[getRandomInt(c.length)]);
    }
    if (useSymbols) {
      pool += SYMBOLS;
      guaranteed.push(SYMBOLS[getRandomInt(SYMBOLS.length)]);
    }

    if (!pool) {
      const fallback = clean(LOWER);
      pool = fallback;
      guaranteed.push(fallback[getRandomInt(fallback.length)]);
    }

    const result: string[] = [...guaranteed];
    for (let i = result.length; i < length; i++) {
      result.push(pool[getRandomInt(pool.length)]);
    }

    // Fisher-Yates shuffle using crypto random
    for (let i = result.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    const finalPass = result.join('');
    setPassword(finalPass);
    setCopied(false);
    setHistory((prev) => [finalPass, ...prev.filter((p) => p !== finalPass)].slice(0, 4));
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const poolSize =
    (useUpper ? 26 : 0) +
    (useLower ? 26 : 0) +
    (useNumbers ? 10 : 0) +
    (useSymbols ? SYMBOLS.length : 0) || 26;
  const entropyBits = Math.round(length * Math.log2(poolSize));

  const strength =
    entropyBits >= 90
      ? { label: 'MILITARY GRADE', color: 'text-[#00ff66]', bar: 'bg-[#00ff66] w-full', strong: true }
      : entropyBits >= 64
        ? { label: 'STRONG', color: 'text-[#22e58a]', bar: 'bg-[#22e58a] w-4/5', strong: true }
        : entropyBits >= 45
          ? { label: 'MODERATE', color: 'text-[#facc15]', bar: 'bg-[#facc15] w-1/2', strong: false }
          : { label: 'WEAK', color: 'text-[#ff4d6d]', bar: 'bg-[#ff4d6d] w-1/4', strong: false };

  const copyText = async (text: string, historyIndex?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof historyIndex === 'number') {
        setCopiedHistoryIdx(historyIndex);
        window.setTimeout(() => setCopiedHistoryIdx(null), 1600);
      } else {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Main Generator Card */}
      <section className="lg:col-span-7 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#e6f7ed]">
              Password Generator
            </h2>
          </div>
          <span className="font-mono-tech text-xs text-[#78a88a] tabular-nums">
            {entropyBits} BITS ENTROPY
          </span>
        </div>

        {/* Generated Password Display */}
        <div className="rounded-2xl border border-[#00ff66]/35 bg-[#030704] p-4">
          <p className="font-mono-tech text-base sm:text-xl font-semibold text-[#00ff66] break-all select-all leading-relaxed">
            {password}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {strength.strong ? (
                <ShieldCheck className={`h-4 w-4 ${strength.color}`} aria-hidden="true" />
              ) : (
                <ShieldAlert className={`h-4 w-4 ${strength.color}`} aria-hidden="true" />
              )}
              <span className={`font-mono-tech text-xs font-bold ${strength.color}`}>
                {strength.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generatePassword}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-[#1b472d] bg-[#0a1710] px-4 py-2 font-mono-tech text-xs font-semibold text-[#e6f7ed] hover:border-[#00ff66]/60 hover:text-[#00ff66] transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={() => copyText(password)}
                className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#00ff66] px-4 py-2 font-mono-tech text-xs font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#0e2116]">
            <div className={`h-full rounded-full transition-all ${strength.bar}`} />
          </div>
        </div>

        {/* Length Slider */}
        <div className="rounded-xl border border-[#11291b] bg-[#040a06] p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-length-slider"
              className="text-sm font-medium text-[#d4f0df]"
            >
              Password Length
            </label>
            <span className="font-mono-tech text-sm font-bold text-[#00ff66] tabular-nums">
              {length} chars
            </span>
          </div>
          <input
            id="password-length-slider"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-3 w-full accent-[#00ff66] cursor-pointer h-2"
          />
          <div className="mt-1 flex justify-between font-mono-tech text-[11px] text-[#669478] tabular-nums">
            <span>8</span>
            <span>24</span>
            <span>40</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { label: 'Uppercase (A-Z)', checked: useUpper, onChange: setUseUpper },
            { label: 'Lowercase (a-z)', checked: useLower, onChange: setUseLower },
            { label: 'Numbers (0-9)', checked: useNumbers, onChange: setUseNumbers },
            { label: 'Symbols (!@#$%)', checked: useSymbols, onChange: setUseSymbols },
          ].map((item) => (
            <label
              key={item.label}
              className="min-h-[48px] flex items-center justify-between rounded-xl border border-[#122b1c] bg-[#040a06] px-4 py-2.5 cursor-pointer hover:border-[#00ff66]/40"
            >
              <span className="text-sm text-[#dcf3e4]">{item.label}</span>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="h-5 w-5 accent-[#00ff66] cursor-pointer"
              />
            </label>
          ))}
        </div>

        <label className="min-h-[48px] flex items-center justify-between rounded-xl border border-[#122b1c] bg-[#040a06] px-4 py-2.5 cursor-pointer hover:border-[#00ff66]/40">
          <div>
            <span className="text-sm text-[#dcf3e4]">Exclude Ambiguous Characters</span>
            <p className="text-xs text-[#6e9c80]">Avoids confusing characters like 0, O, 1, l, I</p>
          </div>
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="h-5 w-5 accent-[#00ff66] cursor-pointer"
          />
        </label>
      </section>

      {/* Recent History Panel */}
      <section className="lg:col-span-5 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-[#e6f7ed]">
          Recent Passwords (Session Only)
        </h3>
        <p className="text-xs text-[#78a88a]">
          Tap any recent password to copy it. History clears automatically when you close the app.
        </p>

        <div className="space-y-2.5">
          {history.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-[#122b1c] bg-[#040906] px-3.5 py-2.5"
            >
              <span className="font-mono-tech text-xs text-[#b7e2c7] truncate">
                {item}
              </span>
              <button
                type="button"
                onClick={() => copyText(item, idx)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-[#173824] bg-[#08120c] text-[#00ff66] hover:bg-[#00ff66]/15 transition-colors cursor-pointer shrink-0"
                aria-label="Copy recent password"
              >
                {copiedHistoryIdx === idx ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
