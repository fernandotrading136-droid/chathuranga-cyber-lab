import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Bot,
  Send,
  BookOpen,
  Code2,
  GraduationCap,
  RotateCcw,
  Sparkles,
  FastForward,
  WifiOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  fallbackReason?: string;
}

interface QuickButtonItem {
  id: string;
  label: string;
  prompt: string;
  icon: 'lessons' | 'code' | 'homework';
}

interface SpeechRecognitionResultEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const QUICK_BUTTONS: QuickButtonItem[] = [
  {
    id: 'lessons',
    label: 'Padam gana ahanawa',
    prompt:
      'Me website eke thiyena Cyber Security padam (STOP THE HACK, HACK EKEN BERENA VIDIYA, Quiz saha Cyber Words) gana mata saralawa Easy Sinhala walin kiyala denna.',
    icon: 'lessons',
  },
  {
    id: 'code',
    label: 'Code eka balanna',
    prompt:
      'Website eke lessons wala thiyena commands saha coding (firewall block --all-attacks, enable_firewall, basic coding) step-by-step mata pennala kiyala denna.',
    icon: 'code',
  },
  {
    id: 'homework',
    label: 'Homework udawwak',
    prompt:
      'Mata school homework ekakata (Maths, Science, English, ICT ho wena subject ekakata) udaw oni. Step-by-step saralawa Easy Sinhala walin kiyala denna.',
    icon: 'homework',
  },
];

const OFFLINE_ANSWERS: Record<string, string> = {
  phishing:
    'Phishing kiyanne boru link / mail walin uba ge password horakam karana eka bn. Link eka click karanna kalin sender wa balapan!',
  password:
    'Hodata password ekak: loku akuru + podi akuru + number + symbol mix karapan. Eka kawadawath kawurut ekka share karanna epa!',
  wifi:
    'Public WiFi eke bank / mail log wenna epa bn. VPN ekak use karapan, nethnam data on karapan.',
  virus:
    'Virus ekak awoth: internet off karapan, antivirus scan karapan, සැක link click karanna epa!',
};

const BUSY_FALLBACK_MESSAGE =
  'Ane tikak inna bn! Guru tikak busy. Thawa minute 1k inna dala aye ahapan. Mama oya gana answer eka hoyala dennam! 🙏';

const INITIAL_GREETING: ChatMessage = {
  id: 'guru-welcome',
  role: 'model',
  text:
    'ආයුබෝවන්! මම ඔබේ CYBER GURU AI ගුරුවරයා.\n\n' +
    'ඔබට Cyber Security, Coding, පාසල් පාඩම් (Maths, Science, English, ICT) හෝ ඕනෑම Homework ප්‍රශ්නයක් සරල සිංහලෙන් අහන්න පුළුවන්.\n\n' +
    'Type කරන්න හෝ Mic button එක click කරලා කතා කරලා අහන්න!',
};

function getOfflineFallback(question: string): string {
  const q = question.toLowerCase();
  for (const key of Object.keys(OFFLINE_ANSWERS)) {
    if (q.includes(key)) {
      return OFFLINE_ANSWERS[key];
    }
  }
  return BUSY_FALLBACK_MESSAGE;
}

function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, ' code snippet ')
    .replace(/[`*_#>~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function CyberGuruAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptLabel, setAttemptLabel] = useState<string>('CYBER GURU AI typing');

  // Voice Chat state (Browser SpeechRecognition + speechSynthesis)
  const [listening, setListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'si-LK' | 'en-US'>('si-LK');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Typing animation state for the newest model message
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typedCharCount, setTypedCharCount] = useState<number>(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const autoSpeakRef = useRef(autoSpeak);
  const voiceLangRef = useRef(voiceLang);

  autoSpeakRef.current = autoSpeak;
  voiceLangRef.current = voiceLang;

  const activeTypingMessage = messages.find((m) => m.id === typingMessageId);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!activeTypingMessage) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setTypingMessageId(null);
      setTypedCharCount(activeTypingMessage.text.length);
      return;
    }

    const totalLength = activeTypingMessage.text.length;
    if (typedCharCount >= totalLength) {
      setTypingMessageId(null);
      return;
    }

    const timer = window.setInterval(() => {
      setTypedCharCount((prev) => {
        const next = prev + 4;
        if (next >= totalLength) {
          setTypingMessageId(null);
          return totalLength;
        }
        return next;
      });
    }, 16);

    return () => window.clearInterval(timer);
  }, [activeTypingMessage, typedCharCount]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, typedCharCount, isLoading, attemptLabel, voiceNotice]);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speak = (text: string, langOverride?: 'si-LK' | 'en-US') => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      return;
    }

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = langOverride ?? voiceLangRef.current;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const fetchGeminiFromServer = async (
    apiMessages: { role: 'user' | 'model'; text: string }[]
  ): Promise<string> => {
    const res = await fetch('/api/cyber-guru', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      reply?: string;
      error?: string;
    };

    if (!res.ok || !data.reply) {
      throw new Error(
        data.error || `Gemini service unavailable (HTTP ${res.status})`
      );
    }

    return data.reply;
  };

  // Auto Retry (3 attempts, 2s delay) + Friendly Offline Fallback
  const askGuruWithRetry = async (
    question: string,
    apiMessages: { role: 'user' | 'model'; text: string }[]
  ): Promise<{ text: string; fallbackReason?: string }> => {
    let lastError = 'Live Gemini service did not respond.';

    for (let i = 0; i < 3; i++) {
      setAttemptLabel(
        i === 0
          ? 'CYBER GURU AI typing'
          : `CYBER GURU AI retrying (${i + 1}/3)`
      );
      try {
        const reply = await fetchGeminiFromServer(apiMessages);
        return { text: reply };
      } catch (err) {
        lastError =
          err instanceof Error ? err.message : 'Unable to reach Gemini API.';
        if (i === 2) {
          return {
            text: getOfflineFallback(question),
            fallbackReason: lastError,
          };
        }
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
      }
    }

    return {
      text: getOfflineFallback(question),
      fallbackReason: lastError,
    };
  };

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    setVoiceNotice(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setTypingMessageId(null);
    setIsLoading(true);
    setAttemptLabel('CYBER GURU AI typing');

    try {
      const apiMessages = nextHistory
        .filter((m) => m.id !== 'guru-welcome' && !m.fallbackReason)
        .slice(-16)
        .map((m) => ({ role: m.role, text: m.text }));

      const result = await askGuruWithRetry(trimmed, apiMessages);

      const aiMsgId = `guru-${Date.now()}`;
      const aiMessage: ChatMessage = {
        id: aiMsgId,
        role: 'model',
        text: result.text,
        fallbackReason: result.fallbackReason,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setTypedCharCount(0);
      setTypingMessageId(aiMsgId);

      if (autoSpeakRef.current) {
        speak(result.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuestionRef = useRef(sendQuestion);
  sendQuestionRef.current = sendQuestion;

  const startVoice = () => {
    if (isLoading) return;
    setVoiceNotice(null);

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const win = window as WindowWithSpeech;
    const Speech = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Speech) {
      setVoiceNotice('Me browser eke voice na bn, Chrome use karapan!');
      return;
    }

    stopSpeaking();

    try {
      const rec = new Speech();
      rec.lang = voiceLang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (e: SpeechRecognitionResultEvent) => {
        const transcript = e.results?.[0]?.[0]?.transcript?.trim();
        setListening(false);
        if (transcript) {
          void sendQuestionRef.current(transcript);
        }
      };

      rec.onerror = (e) => {
        setListening(false);
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
          setVoiceNotice(
            'Mic permission denna oni bn! Browser address bar eken Microphone allow karala aye try karanna.'
          );
        } else if (e?.error === 'no-speech') {
          setVoiceNotice('Katha karapu sadde ahune na. Aye Mic click karala kiyanna!');
        } else if (e?.error && e.error !== 'aborted') {
          setVoiceNotice('Me browser eke voice support gataluwak awa. Chrome use karapan!');
        }
      };

      rec.onend = () => {
        setListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
      setVoiceNotice('Me browser eke voice na bn, Chrome use karapan!');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const handleResetChat = () => {
    stopSpeaking();
    recognitionRef.current?.stop();
    setListening(false);
    setVoiceNotice(null);
    setMessages([INITIAL_GREETING]);
    setTypingMessageId(null);
    setTypedCharCount(0);
    setInput('');
  };

  const handleSkipTyping = () => {
    if (!activeTypingMessage) return;
    setTypedCharCount(activeTypingMessage.text.length);
    setTypingMessageId(null);
  };

  const renderQuickIcon = (icon: QuickButtonItem['icon']) => {
    if (icon === 'lessons') {
      return <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
    }
    if (icon === 'code') {
      return <Code2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
    }
    return <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />;
  };

  return (
    <section
      id="cyber-guru-ai"
      aria-labelledby="cyber-guru-heading"
      className="rounded-lg border border-[#00ff66]/45 bg-[#040806] p-4 sm:p-6 shadow-[0_0_32px_rgba(0,255,102,0.12)]"
    >
      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f2b1a] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#00ff66] bg-[#06180d] text-[#00ff66] shadow-[0_0_16px_rgba(0,255,102,0.45)]">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="cyber-guru-heading"
                className="font-mono-tech text-base sm:text-lg font-bold tracking-wider text-[#00ff66]"
              >
                CYBER GURU AI
              </h2>
              <span className="inline-flex items-center gap-1 rounded border border-[#00ff66]/50 bg-[#00ff66]/10 px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#00ff66]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                VOICE CHAT + AUTO-RETRY
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#89c9a1]">
              Cyber Security · Coding · Maths · Science · English · School Homework (Easy Sinhala)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Language Selector (si-LK / en-US) */}
          <button
            type="button"
            onClick={() =>
              setVoiceLang((prev) => (prev === 'si-LK' ? 'en-US' : 'si-LK'))
            }
            title="Switch voice language between Sinhala (si-LK) and English (en-US)"
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#174229] bg-[#07110b] px-2.5 py-1.5 font-mono-tech text-xs font-bold text-[#00f0ff] hover:border-[#00f0ff]/60 transition-colors cursor-pointer"
          >
            <span>{voiceLang === 'si-LK' ? 'SI-LK' : 'EN-US'}</span>
          </button>

          {/* Auto-Speak Toggle */}
          <button
            type="button"
            onClick={() => {
              if (autoSpeak) stopSpeaking();
              setAutoSpeak((prev) => !prev);
            }}
            aria-pressed={autoSpeak}
            className={`min-h-[38px] inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono-tech text-xs font-semibold transition-colors cursor-pointer ${
              autoSpeak
                ? 'border-[#00ff66]/55 bg-[#071a0e] text-[#00ff66]'
                : 'border-[#174229] bg-[#07110b] text-[#7ab592]'
            }`}
          >
            {autoSpeak ? (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{autoSpeak ? 'Voice: ON' : 'Voice: OFF'}</span>
          </button>

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#ff3b5c]/60 bg-[#1a060b] px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#ff6b85] hover:bg-[#ff3b5c] hover:text-white transition-colors cursor-pointer"
            >
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>Stop Audio</span>
            </button>
          )}

          {typingMessageId && (
            <button
              type="button"
              onClick={handleSkipTyping}
              className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#00ff66]/50 bg-[#071a0e] px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#00ff66] hover:bg-[#00ff66]/20 transition-colors cursor-pointer"
            >
              <FastForward className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Show Full</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetChat}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded border border-[#174229] bg-[#07110b] px-3 py-1.5 font-mono-tech text-xs font-medium text-[#98d4b0] hover:border-[#00ff66]/50 hover:text-[#00ff66] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Message Stream */}
      <div
        ref={chatScrollRef}
        className="mt-4 h-[360px] sm:h-[400px] overflow-y-auto rounded-md border border-[#0f2919] bg-[#020503] p-3.5 sm:p-4 space-y-3.5"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isFallback = Boolean(msg.fallbackReason);
          const isCurrentlyTyping = msg.id === typingMessageId;
          const visibleText = isCurrentlyTyping
            ? msg.text.slice(0, typedCharCount)
            : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[82%] rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? 'border-[#00f0ff]/45 bg-[#041418] text-[#e6f7fc]'
                    : isFallback
                      ? 'border-[#00ff66]/35 bg-[#07140b] text-[#d6fbe3]'
                      : 'border-[#00ff66]/40 bg-[#051209] text-[#d6fbe3] shadow-[0_0_16px_rgba(0,255,102,0.06)]'
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3 font-mono-tech text-[10px] font-bold tracking-wider">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isUser
                        ? 'text-[#00f0ff]'
                        : isFallback
                          ? 'text-[#facc15]'
                          : 'text-[#00ff66]'
                    }`}
                  >
                    {isFallback && (
                      <WifiOff className="h-3 w-3 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {isUser
                        ? 'YOU (STUDENT)'
                        : isFallback
                          ? 'CYBER GURU AI · OFFLINE FALLBACK'
                          : 'CYBER GURU AI · TEACHER'}
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    {isCurrentlyTyping && (
                      <span className="text-[#7ab592]">TYPING...</span>
                    )}
                    {!isUser && !isCurrentlyTyping && (
                      <button
                        type="button"
                        onClick={() => speak(msg.text)}
                        aria-label="Read this answer aloud"
                        className="inline-flex items-center gap-1 rounded border border-[#00ff66]/35 bg-[#041208] px-1.5 py-0.5 text-[10px] text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] transition-colors cursor-pointer"
                      >
                        <Volume2 className="h-3 w-3" aria-hidden="true" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {visibleText}
                  {isCurrentlyTyping && (
                    <span className="terminal-cursor" aria-hidden="true" />
                  )}
                </div>
                {msg.fallbackReason && !isCurrentlyTyping && (
                  <p className="mt-2 border-t border-[#14331e] pt-1.5 font-mono-tech text-[10px] text-[#84bf9b]">
                    Live Gemini fallback ({msg.fallbackReason})
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Waiting / Auto-Retry Typing Animation */}
        {isLoading && (
          <div className="flex justify-start" aria-live="polite">
            <div className="inline-flex items-center gap-2.5 rounded-lg border border-[#00ff66]/45 bg-[#051209] px-4 py-3 font-mono-tech text-xs text-[#00ff66]">
              <Bot className="h-4 w-4 animate-pulse" aria-hidden="true" />
              <span>{attemptLabel}</span>
              <span className="inline-flex items-center gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline Voice Status / Browser Notice */}
      {(listening || voiceNotice) && (
        <div
          role="status"
          className={`mt-3 flex items-center justify-between gap-2 rounded-md border px-3.5 py-2 font-mono-tech text-xs ${
            listening
              ? 'border-[#00ff66] bg-[#061c0e] text-[#00ff66] shadow-[0_0_16px_rgba(0,255,102,0.22)]'
              : 'border-[#facc15]/50 bg-[#141104] text-[#fef3c7]'
          }`}
        >
          <span>
            {listening
              ? `Listening (${voiceLang})... Katha karanna! (Tap Mic again to stop)`
              : voiceNotice}
          </span>
          {voiceNotice && !listening && (
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="text-[#facc15] underline cursor-pointer shrink-0"
            >
              OK
            </button>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono-tech text-[11px] font-bold text-[#7ab592] mr-1">
          QUICK ASK:
        </span>
        {QUICK_BUTTONS.map((btn) => (
          <button
            key={btn.id}
            type="button"
            disabled={isLoading}
            onClick={() => void sendQuestion(btn.prompt)}
            className="min-h-[38px] inline-flex items-center gap-1.5 rounded-md border border-[#00ff66]/55 bg-[#06180d] px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#00ff66] hover:bg-[#00ff66] hover:text-[#031208] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {renderQuickIcon(btn.icon)}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Question Input + Voice Mic + Send Button */}
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col sm:flex-row gap-2.5">
        <label htmlFor="cyber-guru-input" className="sr-only">
          Ask Cyber Guru AI any question
        </label>
        <div className="flex flex-1 items-center rounded-md border border-[#19472c] bg-[#020503] px-3.5 py-2.5 focus-within:border-[#00ff66]">
          <span className="font-mono-tech text-sm font-bold text-[#00ff66] mr-2 select-none">
            &gt;
          </span>
          <input
            ref={inputRef}
            id="cyber-guru-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Prashnayak ahanna ho Mic click karala kiyanna..."
            disabled={isLoading}
            autoComplete="off"
            className="w-full bg-transparent text-sm text-[#e6f7ed] placeholder-[#4f7a60] focus:outline-none disabled:opacity-60"
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={startVoice}
            disabled={isLoading}
            aria-label={listening ? 'Stop voice input' : 'Ask using voice microphone'}
            title={`Voice Chat (${voiceLang})`}
            className={`min-h-[46px] inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-mono-tech text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              listening
                ? 'border-[#ff3b5c] bg-[#ff3b5c] text-white animate-pulse shadow-[0_0_20px_rgba(255,59,92,0.5)]'
                : 'border-[#00ff66]/60 bg-[#06180d] text-[#00ff66] hover:bg-[#00ff66]/20'
            }`}
          >
            {listening ? (
              <>
                <MicOff className="h-4 w-4" aria-hidden="true" />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" aria-hidden="true" />
                <span>VOICE</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="min-h-[46px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-md bg-[#00ff66] px-6 py-2.5 font-mono-tech text-sm font-bold text-[#031208] hover:bg-[#2dff82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>{isLoading ? 'THINKING...' : 'ASK GURU'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
