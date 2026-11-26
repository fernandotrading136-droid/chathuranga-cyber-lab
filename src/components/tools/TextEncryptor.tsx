import { useState } from 'react';
import { Lock, Unlock, ArrowUpDown, Copy, Check, Trash2 } from 'lucide-react';

type CipherAlgorithm = 'aes-gcm' | 'base64' | 'caesar';
type Direction = 'encrypt' | 'decrypt';

function toBase64Bytes(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64Bytes(base64: string): Uint8Array {
  const binary = atob(base64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function aesEncrypt(plainText: string, secret: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(secret, salt);
  const enc = new TextEncoder();
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    enc.encode(plainText)
  );
  const cipherBytes = new Uint8Array(cipherBuffer);
  const combined = new Uint8Array(salt.length + iv.length + cipherBytes.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(cipherBytes, salt.length + iv.length);
  return toBase64Bytes(combined);
}

async function aesDecrypt(payloadBase64: string, secret: string): Promise<string> {
  const combined = fromBase64Bytes(payloadBase64);
  if (combined.length < 29) {
    throw new Error('Invalid encrypted payload');
  }
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const cipherBytes = combined.slice(28);
  const key = await deriveAesKey(secret, salt);
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    cipherBytes.buffer as ArrayBuffer
  );
  return new TextDecoder().decode(plainBuffer);
}

function caesarTransform(text: string, shift: number, decrypt: boolean): string {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + s) % 26) + base);
  });
}

export function TextEncryptor() {
  const [algorithm, setAlgorithm] = useState<CipherAlgorithm>('aes-gcm');
  const [direction, setDirection] = useState<Direction>('encrypt');
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [caesarShift, setCaesarShift] = useState(3);
  const [outputText, setOutputText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setErrorMsg('Please enter some text first.');
      return;
    }

    setProcessing(true);
    try {
      if (algorithm === 'aes-gcm') {
        if (!secretKey.trim()) {
          setErrorMsg('Please enter a secret password key for AES-256.');
          setProcessing(false);
          return;
        }
        const res =
          direction === 'encrypt'
            ? await aesEncrypt(inputText, secretKey)
            : await aesDecrypt(inputText, secretKey);
        setOutputText(res);
      } else if (algorithm === 'base64') {
        if (direction === 'encrypt') {
          const bytes = new TextEncoder().encode(inputText);
          setOutputText(toBase64Bytes(bytes));
        } else {
          const bytes = fromBase64Bytes(inputText);
          setOutputText(new TextDecoder().decode(bytes));
        }
      } else {
        setOutputText(
          caesarTransform(inputText, caesarShift, direction === 'decrypt')
        );
      }
    } catch {
      setErrorMsg(
        direction === 'decrypt'
          ? 'Decryption failed. Check that your encrypted text and secret key match.'
          : 'Unable to process text with the selected cipher.'
      );
      setOutputText('');
    } finally {
      setProcessing(false);
    }
  };

  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText('');
    setDirection((prev) => (prev === 'encrypt' ? 'decrypt' : 'encrypt'));
    setErrorMsg(null);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section className="lg:col-span-7 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {direction === 'encrypt' ? (
              <Lock className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
            ) : (
              <Unlock className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
            )}
            <h2 className="font-display text-lg font-bold text-[#e6f7ed]">
              Text Encryptor
            </h2>
          </div>

          <div
            role="group"
            aria-label="Encryption direction"
            className="flex rounded-xl border border-[#122b1c] bg-[#040906] p-1"
          >
            {(['encrypt', 'decrypt'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setDirection(mode);
                  setErrorMsg(null);
                }}
                className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  direction === mode
                    ? 'bg-[#00ff66] text-[#031208]'
                    : 'text-[#8ab89c] hover:text-[#e6f7ed]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Selector */}
        <div
          role="group"
          aria-label="Cipher algorithm"
          className="grid grid-cols-3 gap-2"
        >
          {[
            { id: 'aes-gcm' as const, label: 'AES-256 GCM' },
            { id: 'base64' as const, label: 'Base64' },
            { id: 'caesar' as const, label: 'Caesar Cipher' },
          ].map((alg) => (
            <button
              key={alg.id}
              type="button"
              onClick={() => {
                setAlgorithm(alg.id);
                setErrorMsg(null);
              }}
              className={`min-h-[42px] rounded-xl border px-2 py-2 font-mono-tech text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                algorithm === alg.id
                  ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                  : 'border-[#122b1c] bg-[#040906] text-[#8ab89c] hover:text-[#e6f7ed]'
              }`}
            >
              {alg.label}
            </button>
          ))}
        </div>

        {/* Key / Shift Input */}
        {algorithm === 'aes-gcm' && (
          <div>
            <label
              htmlFor="aes-secret-key"
              className="block text-xs font-medium text-[#98c7ab] mb-1.5"
            >
              Secret Password Key
            </label>
            <input
              id="aes-secret-key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret passphrase..."
              className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3.5 py-2.5 text-sm text-[#e6f7ed] placeholder-[#558066] focus:border-[#00ff66] focus:outline-none"
            />
          </div>
        )}

        {algorithm === 'caesar' && (
          <div className="rounded-xl border border-[#122b1c] bg-[#040906] p-3.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="caesar-shift-slider"
                className="text-xs font-medium text-[#98c7ab]"
              >
                Letter Shift Offset
              </label>
              <span className="font-mono-tech text-xs font-bold text-[#00ff66] tabular-nums">
                +{caesarShift}
              </span>
            </div>
            <input
              id="caesar-shift-slider"
              type="range"
              min={1}
              max={25}
              value={caesarShift}
              onChange={(e) => setCaesarShift(Number(e.target.value))}
              className="mt-2 w-full accent-[#00ff66] cursor-pointer"
            />
          </div>
        )}

        {/* Message Input */}
        <div>
          <label
            htmlFor="cipher-input-text"
            className="block text-xs font-medium text-[#98c7ab] mb-1.5"
          >
            {direction === 'encrypt' ? 'Plain Text Message' : 'Encrypted Text'}
          </label>
          <textarea
            id="cipher-input-text"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              direction === 'encrypt'
                ? 'Type secret message here...'
                : 'Paste encrypted output here...'
            }
            className="w-full rounded-xl border border-[#163823] bg-[#040906] p-3.5 font-mono-tech text-xs sm:text-sm text-[#e6f7ed] placeholder-[#558066] focus:border-[#00ff66] focus:outline-none"
          />
        </div>

        {errorMsg && (
          <p role="alert" className="text-xs font-medium text-[#ff4d6d]">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={processing}
            onClick={handleRun}
            className="min-h-[46px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00ff66] px-4 py-2.5 font-mono-tech text-xs sm:text-sm font-bold text-[#031208] hover:bg-[#2dff82] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {direction === 'encrypt' ? (
              <Lock className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Unlock className="h-4 w-4" aria-hidden="true" />
            )}
            <span>
              {processing
                ? 'Processing...'
                : direction === 'encrypt'
                  ? 'Encrypt Text'
                  : 'Decrypt Text'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInputText('');
              setOutputText('');
              setErrorMsg(null);
            }}
            aria-label="Clear text fields"
            className="min-h-[46px] min-w-[46px] flex items-center justify-center rounded-xl border border-[#163823] bg-[#040906] text-[#8ab89c] hover:text-[#ff4d6d] transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Output Card */}
      <section className="lg:col-span-5 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-[#e6f7ed]">
            Output Result
          </h3>
          <button
            type="button"
            disabled={!outputText}
            onClick={handleSwap}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded-lg border border-[#173a25] bg-[#040906] px-3 py-1.5 font-mono-tech text-xs text-[#8ab89c] hover:text-[#00ff66] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Use as Input</span>
          </button>
        </div>

        <div className="min-h-[160px] rounded-xl border border-[#122b1c] bg-[#030704] p-3.5">
          {outputText ? (
            <p className="font-mono-tech text-xs sm:text-sm text-[#00ff66] break-all select-all leading-relaxed">
              {outputText}
            </p>
          ) : (
            <p className="font-mono-tech text-xs text-[#547d64]">
              Encrypted or decrypted output will appear here...
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!outputText}
          onClick={handleCopy}
          className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#00ff66]/50 bg-[#00ff66]/10 px-4 py-2 font-mono-tech text-xs font-semibold text-[#00ff66] hover:bg-[#00ff66]/20 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>Copy Output</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
}
