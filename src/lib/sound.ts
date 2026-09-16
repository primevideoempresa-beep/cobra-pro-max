class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public muted = false;
  public sfxVolume = 0.5;
  public musicVolume = 0.6;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private musicPlaying = false;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctor) this.ctx = new Ctor();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  setSfxLevel(level: number) { const c = Math.max(0, Math.min(10, level)); this.sfxVolume = c / 10; this.enabled = c > 0; }
  isSilent() { return this.muted || !this.enabled || this.sfxVolume <= 0; }
  toggleMute() { this.muted = !this.muted; if (this.muted) this.stopMusic(); else if (this.musicVolume > 0) this.startMusic(); return this.muted; }
  setMusicLevel(level: number) { const c = Math.max(0, Math.min(10, level)); this.musicVolume = c / 10; if (c <= 0 || this.muted) this.stopMusic(); else if (!this.musicPlaying) this.startMusic(); }
  private gain(base: number) { return base * this.sfxVolume; }

  playEat(pitch = 1.0) {
    if (this.isSilent()) return;
    try { this.initCtx(); if (!this.ctx) return;
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(420 * pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420 * pitch * 1.8, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(this.gain(0.15), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }
  playCoin() { this.tone(987.77, 1318.51, "triangle", 0.15, 0.25); }
  playPowerup() { this.sweep(300, 1200, "sine", 0.2, 0.3); }
  playKill() { this.sweep(220, 80, "sawtooth", 0.25, 0.35); }
  playDeath() { this.sweep(280, 70, "square", 0.25, 0.45); }
  playClick() { this.sweep(600, 300, "sine", 0.12, 0.05); }

  private tone(f1: number, f2: number, type: OscillatorType, vol: number, dur: number) {
    if (this.isSilent()) return;
    try { this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime; const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(f1, now); osc.frequency.setValueAtTime(f2, now + 0.08);
      gain.gain.setValueAtTime(this.gain(vol), now); gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(now); osc.stop(now + dur);
    } catch {}
  }
  private sweep(f1: number, f2: number, type: OscillatorType, vol: number, dur: number) {
    if (this.isSilent()) return;
    try { this.initCtx(); if (!this.ctx) return;
      const now = this.ctx.currentTime; const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(f1, now); osc.frequency.exponentialRampToValueAtTime(f2, now + dur);
      gain.gain.setValueAtTime(this.gain(vol), now); gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(now); osc.stop(now + dur);
    } catch {}
  }

  startMusic() { if (this.muted || this.musicPlaying || this.musicVolume <= 0) return; this.musicPlaying = true; this.playMusicNote(); this.musicTimer = setInterval(() => this.playMusicNote(), 520); }
  stopMusic() { this.musicPlaying = false; if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; } }
  private playMusicNote() {
    if (this.muted || !this.musicPlaying) return;
    try { this.initCtx(); if (!this.ctx) return;
      const scale = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
      const freq = scale[Math.floor(Date.now() / 520) % scale.length];
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04 * this.musicVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.45);
    } catch {}
  }
}

export const sounds = new SoundManager();
