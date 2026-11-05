export class RoomAmbiencePlayer {
  private audioCtx: AudioContext | null = null;

  start(): void {
    if (this.audioCtx) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioCtx = new AC();
      const n = this.audioCtx.sampleRate * 2;
      const b = this.audioCtx.createBuffer(1, n, this.audioCtx.sampleRate);
      const d = b.getChannelData(0);
      let l = 0;
      for (let i = 0; i < n; i++) {
        l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = l * 3.5;
      }
      const s = this.audioCtx.createBufferSource();
      s.buffer = b;
      s.loop = true;
      const f = this.audioCtx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 220;
      const g = this.audioCtx.createGain();
      g.gain.value = 0.5;
      s.connect(f);
      f.connect(g);
      g.connect(this.audioCtx.destination);
      s.start();
    } catch {
      // Ignore audio autoplay block
    }
  }

  dispose(): void {
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

