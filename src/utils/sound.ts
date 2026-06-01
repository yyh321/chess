let audioCtx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function now() {
  return getCtx()?.currentTime ?? 0;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  localStorage.setItem('chess-sound', String(value));
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function initSoundSetting() {
  const saved = localStorage.getItem('chess-sound');
  if (saved !== null) {
    enabled = saved === 'true';
  }
}

export function playSelect() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now());
  gain.gain.setValueAtTime(0.12, now());
  gain.gain.exponentialRampToValueAtTime(0.001, now() + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now());
  osc.stop(now() + 0.05);
}

export function playMove() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(260, now());
  gain.gain.setValueAtTime(0.18, now());
  gain.gain.exponentialRampToValueAtTime(0.001, now() + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now());
  osc.stop(now() + 0.08);
}

export function playCapture() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(280, now());
  osc2.frequency.setValueAtTime(340, now());
  gain.gain.setValueAtTime(0.22, now());
  gain.gain.exponentialRampToValueAtTime(0.001, now() + 0.12);
  osc1.connect(gain).connect(ctx.destination);
  osc2.connect(gain).connect(ctx.destination);
  osc1.start(now());
  osc2.start(now());
  osc1.stop(now() + 0.12);
  osc2.stop(now() + 0.12);
}

export function playCheck() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(420, now());
  osc.frequency.linearRampToValueAtTime(840, now() + 0.1);
  gain.gain.setValueAtTime(0.12, now());
  gain.gain.exponentialRampToValueAtTime(0.001, now() + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now());
  osc.stop(now() + 0.2);
}

export function playCheckmate() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const t = now() + i * 0.1;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}
