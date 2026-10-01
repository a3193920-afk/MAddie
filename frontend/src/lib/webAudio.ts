/**
 * Web Audio API Calming Synthesizer.
 * Generates 8 distinct ambient soundscapes, harmonic chords, and calming game sound effects
 * using client-side synthesis. Zero external audio files or broken links!
 */

export type SoundscapeType = 
  | 'rain' 
  | 'waves' 
  | 'forest' 
  | 'pink_noise'
  | 'zen_bowl'
  | 'campfire'
  | 'alpha_waves'
  | 'thunder_rain';

class WebAudioService {
  private ctx: AudioContext | null = null;
  private currentSources: AudioNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentTrack: SoundscapeType | null = null;
  private volumeLevel = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(level: number): void {
    this.volumeLevel = Math.max(0, Math.min(1, level));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public playSoundscape(type: SoundscapeType): void {
    this.stopSoundscape();
    this.initContext();
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    switch (type) {
      case 'rain':
        this.playRain();
        break;
      case 'waves':
        this.playWaves();
        break;
      case 'forest':
        this.playForestBreeze();
        break;
      case 'pink_noise':
        this.playPinkNoise();
        break;
      case 'zen_bowl':
        this.playZenBowl();
        break;
      case 'campfire':
        this.playCampfire();
        break;
      case 'alpha_waves':
        this.playAlphaWaves();
        break;
      case 'thunder_rain':
        this.playThunderRain();
        break;
    }

    this.isPlaying = true;
    this.currentTrack = type;
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.currentSources.push(noise);
  }

  private playWaves() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

    lfo.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.currentSources.push(noise, lfo);
  }

  private playPinkNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    noise.connect(this.masterGain);
    noise.start();
    this.currentSources.push(noise);
  }

  private playForestBreeze() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.currentSources.push(noise);
  }

  private playZenBowl() {
    if (!this.ctx || !this.masterGain) return;
    // 432 Hz fundamental drone + harmonic overtones (864Hz, 1296Hz)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, this.ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(864, this.ctx.currentTime);

    sub.type = 'triangle';
    sub.frequency.setValueAtTime(216, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.4, this.ctx.currentTime);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.15, this.ctx.currentTime);

    const gainSub = this.ctx.createGain();
    gainSub.gain.setValueAtTime(0.3, this.ctx.currentTime);

    // Warm subtle tremolo
    const tremolo = this.ctx.createOscillator();
    tremolo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const tremoloGain = this.ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    tremolo.connect(tremoloGain);
    tremoloGain.connect(gain1.gain);
    tremolo.start();

    osc1.connect(gain1);
    osc2.connect(gain2);
    sub.connect(gainSub);

    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);
    gainSub.connect(this.masterGain);

    osc1.start();
    osc2.start();
    sub.start();

    this.currentSources.push(osc1, osc2, sub, tremolo);
  }

  private playCampfire() {
    if (!this.ctx || !this.masterGain) return;
    // Warm low-frequency roar + highpass crackle
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Fire body (lowpass warm roar)
    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const bodyGain = this.ctx.createGain();
    bodyGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(this.masterGain);
    noise.start();

    this.currentSources.push(noise);
  }

  private playAlphaWaves() {
    if (!this.ctx || !this.masterGain) return;
    // 10 Hz binaural beat on 210 Hz carrier (210 Hz left, 220 Hz right)
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(210, this.ctx.currentTime);

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(220, this.ctx.currentTime); // 10 Hz difference (Alpha state)

    const merger = this.ctx.createChannelMerger(2);
    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);

    const alphaGain = this.ctx.createGain();
    alphaGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    merger.connect(alphaGain);
    alphaGain.connect(this.masterGain);

    oscL.start();
    oscR.start();
    this.currentSources.push(oscL, oscR);
  }

  private playThunderRain() {
    if (!this.ctx || !this.masterGain) return;
    // Rain background
    this.playRain();

    // Periodic deep thunder rumble
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const thunderSource = this.ctx.createBufferSource();
    thunderSource.buffer = buffer;
    thunderSource.loop = true;

    const thunderFilter = this.ctx.createBiquadFilter();
    thunderFilter.type = 'lowpass';
    thunderFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

    const thunderGain = this.ctx.createGain();
    thunderGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    thunderSource.connect(thunderFilter);
    thunderFilter.connect(thunderGain);
    thunderGain.connect(this.masterGain);
    thunderSource.start();

    this.currentSources.push(thunderSource);
  }

  public playGentleChime(): void {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1056, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  public playHarmonicChord(noteIndex: number): void {
    this.initContext();
    if (!this.ctx) return;
    // C4, E4, G4, B4
    const notes = [261.63, 329.63, 392.00, 493.88];
    const freq = notes[noteIndex % notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.9);
  }

  public playBubblePopSound(sizeFactor: number = 1.0): void {
    this.initContext();
    if (!this.ctx) return;

    const baseFreq = 400 + (1 - Math.min(1, sizeFactor)) * 350;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public stopSoundscape(): void {
    this.currentSources.forEach((src) => {
      try {
        (src as any).stop();
      } catch (e) {}
    });
    this.currentSources = [];
    this.isPlaying = false;
    this.currentTrack = null;
  }

  public getTrack(): SoundscapeType | null {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const webAudioService = new WebAudioService();
