export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.active = false;
    this.nodes = {};
  }

  toggle() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._build();
    }
    if (this.active) {
      this.ctx.suspend();
      this.active = false;
      return false;
    } else {
      this.ctx.resume();
      this.active = true;
      return true;
    }
  }

  _build() {
    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);
    this.nodes.master = master;

    // ── Deep drone 1: low sine, very slow frequency drift ──
    const drone1 = ctx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.value = 55;
    const drone1Gain = ctx.createGain();
    drone1Gain.gain.value = 0.35;
    // Slow LFO on frequency
    const drone1LFO = ctx.createOscillator();
    drone1LFO.type = 'sine';
    drone1LFO.frequency.value = 0.03;
    const drone1LFOGain = ctx.createGain();
    drone1LFOGain.gain.value = 2;
    drone1LFO.connect(drone1LFOGain);
    drone1LFOGain.connect(drone1.frequency);
    drone1LFO.start();
    drone1.connect(drone1Gain);
    drone1Gain.connect(master);
    drone1.start();
    this.nodes.drone1 = drone1;

    // ── Deep drone 2: triangle, slightly higher ──
    const drone2 = ctx.createOscillator();
    drone2.type = 'triangle';
    drone2.frequency.value = 82.4;
    const drone2Gain = ctx.createGain();
    drone2Gain.gain.value = 0.2;
    const drone2LFO = ctx.createOscillator();
    drone2LFO.type = 'sine';
    drone2LFO.frequency.value = 0.025;
    const drone2LFOGain = ctx.createGain();
    drone2LFOGain.gain.value = 3;
    drone2LFO.connect(drone2LFOGain);
    drone2LFOGain.connect(drone2.frequency);
    drone2LFO.start();
    drone2.connect(drone2Gain);
    drone2Gain.connect(master);
    drone2.start();
    this.nodes.drone2 = drone2;

    // ── High shimmer: high sine, very quiet ──
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 880;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.06;
    const shimmerLFO = ctx.createOscillator();
    shimmerLFO.type = 'sine';
    shimmerLFO.frequency.value = 0.04;
    const shimmerLFOGain = ctx.createGain();
    shimmerLFOGain.gain.value = 40;
    shimmerLFO.connect(shimmerLFOGain);
    shimmerLFOGain.connect(shimmer.frequency);
    shimmerLFO.start();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start();
    this.nodes.shimmer = shimmer;

    // ── Noise: filtered "cosmic microwave background" ──
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 200;
    noiseFilter.Q.value = 0.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.03;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();
    this.nodes.noise = noiseSource;

    // ── Particle pings: random short sine bursts ──
    this._schedulePing();
  }

  _schedulePing() {
    if (!this.ctx) return;

    const delay = 4000 + Math.random() * 12000; // every 4-16 seconds
    this._pingTimer = setTimeout(() => {
      if (!this.active || !this.ctx) {
        this._schedulePing();
        return;
      }
      this._playPing();
      this._schedulePing();
    }, delay);
  }

  _playPing() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freq = 400 + Math.random() * 1200;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.nodes.master);
    osc.start(now);
    osc.stop(now + 1.5);
  }

  dispose() {
    if (this._pingTimer) clearTimeout(this._pingTimer);
    if (this.ctx) {
      Object.values(this.nodes).forEach(n => {
        try { n.stop?.(); } catch (_) {}
      });
      this.ctx.close();
      this.ctx = null;
    }
  }
}
