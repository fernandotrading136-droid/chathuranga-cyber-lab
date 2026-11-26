interface WindowWithAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let sharedAudioCtx: AudioContext | null = null;

function withAudioContext(callback: (ctx: AudioContext) => void): void {
  if (typeof window === 'undefined') return;
  const win = window as WindowWithAudio;
  const AudioCtx = window.AudioContext || win.webkitAudioContext;
  if (!AudioCtx) return;

  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === 'suspended') {
      void ctx
        .resume()
        .then(() => callback(ctx))
        .catch(() => {});
      return;
    }
    callback(ctx);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export function playCorrect(): void {
  withAudioContext((ctx) => {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880; // ding!
      gain.gain.value = 0.15;
      osc.start(now);
      osc.stop(now + 0.3);

      // 2 weni ding ekak
      window.setTimeout(() => {
        withAudioContext((ctx2) => {
          try {
            const t2 = ctx2.currentTime;
            const o2 = ctx2.createOscillator();
            const g2 = ctx2.createGain();
            o2.connect(g2);
            g2.connect(ctx2.destination);
            o2.type = 'sine';
            o2.frequency.value = 1320;
            g2.gain.value = 0.15;
            o2.start(t2);
            o2.stop(t2 + 0.4);
          } catch {
            // Ignore audio scheduling errors
          }
        });
      }, 100);
    } catch {
      // Ignore audio errors
    }
  });
}

export function playWrong(): void {
  withAudioContext((ctx) => {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.value = 150; // buzzzz!
      gain.gain.value = 0.1;
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audio errors
    }
  });
}
