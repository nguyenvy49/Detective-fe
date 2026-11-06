export type FootstepSurface = 'wood' | 'tile' | 'stairs' | 'outdoor';

export class RoomAmbiencePlayer {
  private audioCtx: AudioContext | null = null;
  private stepParity = 0;

  private ensureCtx(): AudioContext | null {
    if (!this.audioCtx) return null;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

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
      g.gain.value = 0.42;
      s.connect(f);
      f.connect(g);
      g.connect(this.audioCtx.destination);
      s.start();
    } catch {
      // Ignore audio autoplay block
    }
  }

  playFootstep(surface: FootstepSurface = 'wood', isSprint = false): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      this.stepParity = 1 - this.stepParity;
      const pitchJitter = (this.stepParity ? 1.04 : 0.96) * (0.97 + Math.random() * 0.06);
      const vol = (isSprint ? 0.24 : 0.15) * (0.9 + Math.random() * 0.2);

      // 1. Low thud (heel impact)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const baseFreq =
        surface === 'wood'
          ? 92
          : surface === 'tile'
          ? 135
          : surface === 'stairs'
          ? 115
          : 78;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * pitchJitter, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.075);

      oscGain.gain.setValueAtTime(vol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);

      // 2. Surface texture transient (sole tap / gravel crunch)
      const dur = surface === 'outdoor' ? 0.095 : 0.045;
      const len = Math.floor(ctx.sampleRate * dur);
      const nBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = nBuf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, surface === 'outdoor' ? 1.4 : 2.5);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const nSrc = ctx.createBufferSource();
      nSrc.buffer = nBuf;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value =
        (surface === 'tile'
          ? 1650
          : surface === 'stairs'
          ? 1250
          : surface === 'wood'
          ? 880
          : 1100) * pitchJitter;
      filter.Q.value = surface === 'outdoor' ? 1.2 : 2.4;

      const nGain = ctx.createGain();
      nGain.gain.value = vol * (surface === 'outdoor' ? 0.85 : 0.55);
      nSrc.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      nSrc.start(now + 0.008);
    } catch {
      // Ignore audio errors
    }
  }

  playSwitchClick(): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.025);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore
    }
  }

  playDoorOrDrawer(isDoor = false): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Handle latch click
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isDoor ? 320 : 210, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + (isDoor ? 0.18 : 0.14));
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + (isDoor ? 0.2 : 0.15));
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  dispose(): void {
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
