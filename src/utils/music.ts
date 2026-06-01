let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let nextNoteTime = 0;
let beatIndex = 0;
let timerId: ReturnType<typeof setInterval> | null = null;

const TEMPO = 56;
const SECONDS_PER_BEAT = 60 / TEMPO;

// 中国五声音阶 C 宫调旋律
const MELODY = [
  { freq: 261.63, dur: 1 }, { freq: 329.63, dur: 1 },
  { freq: 392.00, dur: 1 }, { freq: 440.00, dur: 1 },
  { freq: 392.00, dur: 1 }, { freq: 329.63, dur: 1 },
  { freq: 293.66, dur: 1 }, { freq: 261.63, dur: 1 },
  { freq: 293.66, dur: 1 }, { freq: 329.63, dur: 0.5 },
  { freq: 293.66, dur: 0.5 }, { freq: 261.63, dur: 2 },
  { freq: 196.00, dur: 2 }, { freq: 261.63, dur: 2 },
];

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

function playTone(
  ctx: AudioContext,
  time: number,
  freq: number,
  duration: number,
  volume: number,
  type: OscillatorType,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = 1000;
  filter.Q.value = 0.5;

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  const dest = masterGain || ctx.destination;
  osc.connect(filter).connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + duration);
}

function scheduleNote(beatNumber: number, time: number) {
  const ctx = getCtx();
  if (!ctx) return;

  const note = MELODY[beatNumber % MELODY.length];

  // 低音 drone：每两拍一个根音，音量极轻
  if (beatNumber % 2 === 0) {
    const drone = beatNumber % 8 < 4 ? 130.81 : 196.0;
    playTone(ctx, time, drone, 2.5, 0.025, 'sine');
  }

  // 主旋律
  playTone(ctx, time, note.freq, note.dur * SECONDS_PER_BEAT, 0.055, 'triangle');

  // 轻微和声：隔拍加一个五度音
  if (beatNumber % 2 === 1) {
    const harmony = note.freq * 1.5;
    playTone(ctx, time, harmony, note.dur * SECONDS_PER_BEAT * 0.8, 0.02, 'sine');
  }
}

function scheduler() {
  const ctx = getCtx();
  if (!ctx || !isPlaying) return;

  while (nextNoteTime < ctx.currentTime + 0.15) {
    scheduleNote(beatIndex, nextNoteTime);
    const note = MELODY[beatIndex % MELODY.length];
    nextNoteTime += note.dur * SECONDS_PER_BEAT;
    beatIndex++;
  }
}

export function startMusic() {
  const ctx = getCtx();
  if (!ctx || isPlaying) return;

  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.45;
    masterGain.connect(ctx.destination);
  }

  isPlaying = true;
  nextNoteTime = ctx.currentTime + 0.05;
  beatIndex = 0;
  timerId = setInterval(scheduler, 50);
}

export function stopMusic() {
  isPlaying = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

export function isMusicPlaying(): boolean {
  return isPlaying;
}

// 页面切回时尝试恢复 AudioContext
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && audioCtx?.state === 'suspended') {
    audioCtx.resume();
  }
});
