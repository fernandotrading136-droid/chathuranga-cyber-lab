import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

const CYBER_GURU_SYSTEM_INSTRUCTION = `You are "CYBER GURU AI", a friendly, patient, and honest Sri Lankan teacher inside the "CHATHURANGA CYBER LAB" learning platform.

YOUR TEACHING STYLE & LANGUAGE:
- Always reply in easy, clear, friendly Sinhala (you may include clear English technical words or Singlish phrases in brackets where helpful for students, e.g., Firewall (ෆයර්වෝල්), Variable, Equation).
- If the user writes in Singlish (Romanized Sinhala), Sinhala Unicode, or English, understand it naturally and explain clearly in easy Sinhala so any school student or beginner understands immediately.
- Answer ANY question like a supportive teacher: Cyber Security, Coding (HTML, CSS, JavaScript, Python, SQL, C, etc.), School lessons (Grade 1-13, O/L, A/L), English, Maths, Science, ICT, History, or any Homework.
- HONESTY & STEP-BY-STEP RULE:
  1. Always give accurate, simple, honest answers. Never invent fake facts or guess blindly.
  2. Whenever you are unsure about part of a question, or when the user says they don't know the answer or asks how to solve a tricky problem, begin gently with: "Mama danna widiyata..." (මම දන්න විදියට...) and explain it clearly step-by-step (1, 2, 3...) with simple examples.
- Keep answers well-structured with short paragraphs, numbered steps, and clean code blocks when showing code.

CHATHURANGA CYBER LAB WEBSITE LESSONS KNOWLEDGE (Use these exact details whenever asked about this website's lessons, codes, quiz, or cyber words):
1. "STOP THE HACK - LIVE WORLD ATTACK!" (Top Interactive Mission):
   - Shows an EPIDEMIC-2050 animated world attack map with blinking red dots, "CRITICAL SITUATION - WORLD ATTACK!" alert, and a rising attack counter.
   - Question: "Me Hacker ge attack eka niwaradiwa nawaththanna oni code eka mokakda?"
   - Correct Terminal Command: \`firewall block --all-attacks\`
   - When entered correctly: World map turns green, red dots disappear, confetti plays, and displays "SAARTHAKAI! OBA ATTACK EKA NAWATHUWA!".

2. "HACK EKEN BERENA VIDIYA" (Featured Red-Border New Lesson):
   - Story: A hacker broke into a school website through a missing firewall gap at night. Includes the "KAUDA MEKA HACK KARE" section ("CHATHURANGA CYBER LAB EKA EKATHU WENNA! APE ARAKSHAWA WENUWEN API HACKING IGENA GAMU!").
   - Defense Terminal Command: \`enable_firewall\` (Type it and press ENTER / RUN. After 2 wrong attempts, "SHOW CORRECT CODE" hint appears).
   - How to stay safe taught in lesson: Enable WAF Firewall, Strong Admin Password + 2FA, Always Update Software/Plugins, Keep Daily Offline Backups.

3. Dashboard Learning Missions:
   - Hacking Basics: Ethical Hackers test systems legally to find weaknesses and protect them.
   - Password Security: Minimum 12+ characters mixing uppercase, lowercase, numbers, and symbols (e.g., K#9mP!4vL@8xQ) + 2FA.
   - Phishing: Spotting fake Bank/WhatsApp/Email messages asking for OTP or Password.
   - WiFi Security: Using WPA3, VPN, and HTTPS on public Free Wi-Fi.

4. Session 1 Sinhala Quiz (5 Questions):
   - Q1: Phishing (fake bank SMS/Email asking for OTP or Password).
   - Q2: Strong Password (e.g. K#9mP!4vL@8xQ).
   - Q3: 2FA / Two-Factor Authentication (extra OTP/app lock after password).
   - Q4: https:// (encrypted secure connection in browser address bar).
   - Q5: Ransomware (malware that encrypts/locks files and demands ransom).

5. Cyber Words Dictionary (12 Terms + "ARAKSHAKA PIYAWARA" safety popup for each):
   - Phishing, Malware, Firewall, 2FA, Encryption, VPN, Ransomware, Social Engineering, HTTPS, Brute Force Attack, DDoS Attack, Security Patch / Update.
   - Clicking the book button "ARAKSHAKA PIYAWARA" on any card opens "ME PRASHNAYATA GATHA UTHU PIYAWARA:" with 4-5 clear Sinhala safety steps (e.g., never share Bank OTP, call bank's official number, use Play Store/App Store only, turn on Firewall, enable 2FA, keep offline backups).`;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function validateMessages(raw: unknown): ChatMessageInput[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) {
    return null;
  }

  const parsed: ChatMessageInput[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as Record<string, unknown>).role;
    const text = (item as Record<string, unknown>).text;
    if (role !== 'user' && role !== 'model') return null;
    if (typeof text !== 'string') return null;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 4000) return null;
    parsed.push({ role, text: trimmed });
  }

  if (parsed[parsed.length - 1].role !== 'user') {
    return null;
  }
  return parsed;
}

function parseFriendlyErrorMessage(rawMessage: string): string {
  const trimmed = rawMessage.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as {
        error?: { message?: string };
        message?: string;
      };
      const inner = parsed?.error?.message || parsed?.message;
      if (typeof inner === 'string' && inner.trim()) {
        return inner.trim();
      }
    } catch {
      // Fall through to rawMessage
    }
  }
  return trimmed;
}

function extractApiError(err: unknown): { status: number; message: string } {
  const fallback = {
    status: 500,
    message: 'Cyber Guru AI is temporarily busy right now. Please try again shortly.',
  };

  if (!err || typeof err !== 'object') {
    return fallback;
  }

  const record = err as Record<string, unknown>;
  const rawStatus =
    typeof record.status === 'number'
      ? record.status
      : typeof record.code === 'number'
        ? record.code
        : 500;
  const rawMessage =
    typeof record.message === 'string'
      ? parseFriendlyErrorMessage(record.message)
      : '';

  if (
    rawStatus === 400 ||
    rawStatus === 403 ||
    rawMessage.includes('API_KEY_INVALID') ||
    rawMessage.includes('PERMISSION_DENIED')
  ) {
    return {
      status: rawStatus === 400 ? 400 : 403,
      message:
        'Gemini API key is invalid or unauthorized. Please verify GEMINI_API_KEY in Settings > Secrets.',
    };
  }

  if (rawStatus === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message:
        'Cyber Guru AI quota or rate limit was reached. Please wait a moment or check Settings > Secrets.',
    };
  }

  if (rawStatus === 404 || rawMessage.includes('NOT_FOUND')) {
    return {
      status: 404,
      message: 'Configured Gemini model was not found on the server.',
    };
  }

  return {
    status: rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500,
    message: rawMessage || fallback.message,
  };
}

function isTransientHighDemandError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const record = err as Record<string, unknown>;
  const status = typeof record.status === 'number' ? record.status : 0;
  const msg = typeof record.message === 'string' ? record.message : '';
  return (
    status === 503 ||
    status === 500 ||
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand')
  );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/cyber-guru', async (req: Request, res: Response) => {
    const messages = validateMessages(req.body?.messages);
    if (!messages) {
      res.status(400).json({
        error: 'Please enter a valid question (non-empty text, max 4000 characters).',
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Cyber Guru AI requires GEMINI_API_KEY in Settings > Secrets to answer live.',
      });
      return;
    }

    const contents = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const modelCandidates = [
      'gemini-4-hydrogen',
      'gemini-3.1-flash-lite',
    ] as const;

    let lastErr: unknown = null;

    for (const modelName of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: CYBER_GURU_SYSTEM_INSTRUCTION,
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          res.json({ reply: replyText });
          return;
        }
      } catch (err) {
        lastErr = err;
        if (!isTransientHighDemandError(err)) {
          break;
        }
      }
    }

    if (!lastErr) {
      res.status(502).json({
        error: 'Cyber Guru AI returned an empty response. Please try asking again.',
      });
      return;
    }

    const { status, message } = extractApiError(lastErr);
    res.status(status).json({ error: message });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chathuranga Cyber Lab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
