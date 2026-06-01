let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio('/music/bg.mp3');
    audio.loop = true;
    audio.volume = 0.35;
  }
  return audio;
}

export function startMusic() {
  const a = getAudio();
  a.play().catch(() => {
    // 浏览器自动播放策略阻止，或音频文件不存在
  });
}

export function stopMusic() {
  getAudio().pause();
}

export function isMusicPlaying(): boolean {
  return !!audio && !audio.paused;
}
