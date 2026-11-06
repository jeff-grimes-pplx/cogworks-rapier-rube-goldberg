// ============================================================================
// COGWORKS — TAKE 606 PHYSICS ATELIER
// Procedural Collision & Mechanical Foley Audio Synthesis Engine (Web Audio API)
// ============================================================================
// Synthesizes material-matched mechanical sounds directly from live Rapier3D
// stage events, contact impulses, and rolling velocities:
//   - 'steel-wood'    : Milled walnut channel bearing impact & rolling rumble
//   - 'brass-bell'    : High-Q brass synchronizer ring harmonic chime
//   - 'cast-iron'     : Heavy forged camshaft lever / seesaw clunk
//   - 'cable-whirr'   : Tensioned steel cable pulley trolley whirr
//   - 'valve-ping'    : 8-note stainless intake valve domino modal ping
//   - 'rubber-thud'   : Hollow radial tire compound thud + uphill tread hum
//   - 'piston-slam'   : Heavy pneumatic cylinder &connecting-rod drop slam
//   - 'muffler-roll'  : Cylindrical stainless exhaust shell resonant roll
//   - 'glass-chime'   : 5-note suspended automotive tempered-glass bell cascade
//   - 'wiper-servo'   : Rhythmic 5 Hz DC windshield-wiper linkage servo pulse
//   - 'spring-twang'  : Suspension coil-spring catapult release twang
//   - 'rotor-whirr'   : Machined dual-disc brake rotor spiral metallic whirr
//   - 'key-fob-beep'  : Dual-tone automotive remote lock chirp + relay click
//   - 'finale-chord'  : Warm triumphant Wieden+Kennedy-inspired horn & chime chord
// ============================================================================

export class CogworksAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.lastWiperPulseTime = 0;
    this.lastRollingPulseTime = 0;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.enabled ? 0.45 : 0.0;
    this.masterGain.connect(this.ctx.destination);
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.enabled ? 0.45 : 0.0, this.ctx.currentTime, 0.02);
    }
  }

  toggle() {
    this.init();
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  processSimulationEvents(events, snapshot) {
    if (!this.enabled) return;
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    for (const evt of events) {
      if (evt.type === 'stage_triggered') {
        this.playSound(evt.sound, evt.impulseNs || 2.5, evt);
      } else if (evt.type === 'valve_domino_ping') {
        this.playValvePing(evt.pitchIndex || 0);
      } else if (evt.type === 'glass_louver_chime') {
        this.playGlassChime((evt.louverIndex || 1) - 1);
      } else if (evt.type === 'key_fob_pressed') {
        this.playKeyFobChirp();
      } else if (evt.type === 'finale_completed') {
        this.playFinaleChord();
      } else if (evt.type === 'stage_failed') {
        this.playStallThud();
      }
    }

    // Continuous servo pulse during Stage 10 Walking Wiper
    if (snapshot && snapshot.started && !snapshot.completed && !snapshot.failedStage) {
      const now = this.ctx.currentTime;
      if (snapshot.activeStage === 10 && now - this.lastWiperPulseTime > 0.20) {
        this.lastWiperPulseTime = now;
        this.playWiperPulse();
      } else if (
        (snapshot.activeStage === 1 || snapshot.activeStage === 4 || snapshot.activeStage === 6 || snapshot.activeStage === 8 || snapshot.activeStage === 12) &&
        snapshot.activeBody &&
        snapshot.activeBody.speed > 0.35 &&
        now - this.lastRollingPulseTime > 0.14
      ) {
        this.lastRollingPulseTime = now;
        this.playRollingGrain(snapshot.activeStage, snapshot.activeBody.speed);
      }
    }
  }

  playSound(soundType, impulse = 2.0, meta = {}) {
    if (!this.ctx || !this.enabled) return;
    const gainScale = Math.min(1.3, Math.max(0.35, impulse / 4.0));

    switch (soundType) {
      case 'steel-wood':
        this._tone(165, 92, 0.18, 'triangle', 0.35 * gainScale);
        this._noiseBurst(0.08, 950, 0.22 * gainScale);
        break;
      case 'brass-bell':
        this._modalBell([1180, 1775, 2640], 0.55, 0.34 * gainScale);
        break;
      case 'cast-iron':
        this._tone(130, 58, 0.24, 'sawtooth', 0.42 * gainScale);
        this._modalBell([320, 485], 0.22, 0.25 * gainScale);
        break;
      case 'cable-whirr':
        this._tone(420, 790, 0.42, 'sine', 0.24 * gainScale);
        this._noiseBurst(0.35, 1800, 0.16 * gainScale);
        break;
      case 'valve-ping':
        this.playValvePing(meta.pitchIndex || 0);
        break;
      case 'rubber-thud':
        this._tone(98, 44, 0.28, 'sine', 0.52 * gainScale);
        break;
      case 'piston-slam':
        this._tone(140, 42, 0.26, 'triangle', 0.50 * gainScale);
        this._noiseBurst(0.15, 650, 0.32 * gainScale);
        break;
      case 'muffler-roll':
        this._modalBell([240, 362, 510], 0.40, 0.32 * gainScale);
        break;
      case 'glass-chime':
        this.playGlassChime(0);
        break;
      case 'wiper-servo':
        this.playWiperPulse();
        break;
      case 'spring-twang':
        this._tone(195, 520, 0.34, 'sawtooth', 0.32 * gainScale);
        this._modalBell([580, 870], 0.38, 0.24 * gainScale);
        break;
      case 'rotor-whirr':
        this._modalBell([690, 1035, 1520], 0.45, 0.28 * gainScale);
        break;
      default:
        this._tone(240, 140, 0.15, 'triangle', 0.25 * gainScale);
        break;
    }
  }

  playValvePing(idx = 0) {
    if (!this.ctx || !this.enabled) return;
    // Ascending pentatonic stainless-steel valve stem pings
    const scale = [1318.5, 1480.0, 1661.2, 1760.0, 1975.5, 2217.5, 2489.0, 2637.0];
    const f = scale[idx % scale.length];
    this._modalBell([f, f * 1.51, f * 2.18], 0.32, 0.26);
  }

  playGlassChime(idx = 0) {
    if (!this.ctx || !this.enabled) return;
    // Crystalline tempered automotive glass harmonic series (Lydian shimmer)
    const notes = [1046.5, 1174.7, 1318.5, 1480.0, 1568.0];
    const f = notes[idx % notes.length];
    this._modalBell([f, f * 2.0, f * 2.76], 0.78, 0.32);
  }

  playWiperPulse() {
    if (!this.ctx || !this.enabled) return;
    this._tone(210, 295, 0.11, 'sawtooth', 0.15);
    this._noiseBurst(0.05, 1200, 0.08);
  }

  playRollingGrain(stageId, speed) {
    if (!this.ctx || !this.enabled) return;
    const baseFreq = stageId === 6 ? 78 : stageId === 4 ? 540 : stageId === 12 ? 460 : 145;
    const f = baseFreq + Math.min(220, speed * 28);
    this._tone(f, f * 0.92, 0.09, 'sine', Math.min(0.14, speed * 0.03));
  }

  playKeyFobChirp() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    [0, 0.11].forEach((offset) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2150, now + offset);
      osc.frequency.exponentialRampToValueAtTime(2480, now + offset + 0.07);
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.28, now + offset + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });
  }

  playFinaleChord() {
    if (!this.ctx || !this.enabled) return;
    // Warm D-major 9th gallery chime & brass horn resonance ("The Power of Dreams" nod)
    const freqs = [293.66, 369.99, 440.0, 587.33, 659.25, 880.0];
    const now = this.ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = idx < 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.16, now + 0.08 + idx * 0.03);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.45);
    });
  }

  playStallThud() {
    if (!this.ctx || !this.enabled) return;
    this._tone(115, 52, 0.38, 'triangle', 0.36);
  }

  _tone(fStart, fEnd, duration, type = 'sine', peakGain = 0.25) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, fStart), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), now + duration);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(peakGain, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  _modalBell(freqs, duration = 0.45, peakGain = 0.25) {
    const now = this.ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      const amp = peakGain / Math.pow(1.6, idx);
      const d = duration / Math.pow(1.25, idx);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(amp, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0008, now + d);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + d + 0.02);
    });
  }

  _noiseBurst(duration = 0.1, filterFreq = 1000, peakGain = 0.2) {
    const now = this.ctx.currentTime;
    const bufferSize = Math.max(256, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.setValueAtTime(2.4, now);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(peakGain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    noise.start(now);
  }
}
