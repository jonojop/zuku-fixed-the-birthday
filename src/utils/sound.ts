// Tiny Web Audio synth. No audio files are downloaded — every effect (and the
// final ambient loop) is generated locally with oscillators/noise, gated behind
// setSoundEnabled(true), which the UI only calls after a real user gesture
// (autoplay-safe) and respects the global mute button everywhere.
let ctx: AudioContext | null = null
let enabled = false

function getContext(): AudioContext | null {
  if (!enabled) return null
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtor) return null
  if (!ctx) ctx = new AudioCtor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setSoundEnabled(value: boolean): void {
  enabled = value
  if (value) getContext()
  else stopFinalAmbientMusic()
}

export function isSoundEnabled(): boolean {
  return enabled
}

function tone(freq: number, duration: number, options: { type?: OscillatorType; gain?: number; delay?: number; sweepTo?: number } = {}) {
  const audio = getContext()
  if (!audio) return
  const { type = 'sine', gain = 0.08, delay = 0, sweepTo } = options
  const start = audio.currentTime + delay
  const osc = audio.createOscillator()
  const gainNode = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, start + duration)
  gainNode.gain.setValueAtTime(0.0001, start)
  gainNode.gain.exponentialRampToValueAtTime(gain, start + 0.015)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gainNode)
  gainNode.connect(audio.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

function noiseBurst(duration: number, options: { gain?: number; lowpass?: number; delay?: number } = {}) {
  const audio = getContext()
  if (!audio) return
  const { gain = 0.15, lowpass = 1200, delay = 0 } = options
  const start = audio.currentTime + delay
  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration))
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = audio.createBufferSource()
  noise.buffer = buffer
  const gainNode = audio.createGain()
  gainNode.gain.setValueAtTime(gain, start)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = lowpass
  noise.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(audio.destination)
  noise.start(start)
}

/** Generic UI click (buttons that aren't a fix result). */
export function playClick(): void {
  tone(660, 0.06, { type: 'square', gain: 0.05 })
}

/** Short, ascending, pleasant confirmation — ~200ms total. */
export function playCorrect(): void {
  tone(523, 0.1, { type: 'triangle', gain: 0.09 })
  tone(784, 0.14, { type: 'triangle', gain: 0.08, delay: 0.07 })
}

/** Short, low, soft descending double-beep — never an alarm. */
export function playIncorrect(): void {
  tone(260, 0.09, { type: 'sine', gain: 0.055, sweepTo: 200 })
  tone(210, 0.11, { type: 'sine', gain: 0.05, delay: 0.1, sweepTo: 150 })
}

export function playTerminalBeep(): void {
  tone(880, 0.04, { type: 'square', gain: 0.035 })
}

/** Crisp short tick used right when "DEPLOY" text appears. */
export function playDeployTick(): void {
  tone(1200, 0.03, { type: 'square', gain: 0.045 })
}

/** Deploy tick + short ascending arpeggio + a tiny "yay" blip. */
export function playLevelComplete(): void {
  playDeployTick()
  ;[523, 659, 784].forEach((freq, i) => tone(freq, 0.16, { type: 'triangle', gain: 0.075, delay: 0.05 + i * 0.09 }))
  tone(988, 0.2, { type: 'sine', gain: 0.06, delay: 0.34, sweepTo: 1180 })
}

/** Playful cue when the Nala celebration screen appears. */
export function playNalaTransition(): void {
  tone(440, 0.08, { type: 'sine', gain: 0.06, sweepTo: 660 })
  tone(660, 0.1, { type: 'sine', gain: 0.05, delay: 0.09, sweepTo: 880 })
}

/** Soft "closing session" cue — warmer and shorter than playIncorrect. */
export function playSessionClose(): void {
  tone(520, 0.1, { type: 'triangle', gain: 0.06, sweepTo: 340 })
  tone(340, 0.14, { type: 'sine', gain: 0.045, delay: 0.08, sweepTo: 220 })
}

export function playNalaJump(): void {
  tone(400, 0.1, { type: 'sine', gain: 0.07, sweepTo: 700 })
}

export function playCandleIgnite(): void {
  tone(900, 0.05, { type: 'sine', gain: 0.05, sweepTo: 1100 })
}

/** Filtered noise "blow" with a soft fade and a couple of extinguish pops. */
export function playCandlesBlow(): void {
  noiseBurst(1.1, { gain: 0.16, lowpass: 900 })
  tone(300, 0.05, { type: 'sine', gain: 0.04, delay: 0.05, sweepTo: 120 })
  tone(260, 0.05, { type: 'sine', gain: 0.03, delay: 0.22, sweepTo: 100 })
}

/** Short "engine on + brief acceleration" cue for the R33 reveal (~2.5s). */
export function playEngineRev(): void {
  const audio = getContext()
  if (!audio) return
  const start = audio.currentTime

  const rumble = audio.createOscillator()
  rumble.type = 'sawtooth'
  const rumbleGain = audio.createGain()
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(300, start)
  filter.frequency.exponentialRampToValueAtTime(900, start + 1.4)
  filter.frequency.exponentialRampToValueAtTime(500, start + 2.4)

  rumble.frequency.setValueAtTime(55, start)
  rumble.frequency.exponentialRampToValueAtTime(160, start + 1.2)
  rumble.frequency.exponentialRampToValueAtTime(110, start + 2.4)

  rumbleGain.gain.setValueAtTime(0.0001, start)
  rumbleGain.gain.exponentialRampToValueAtTime(0.09, start + 0.2)
  rumbleGain.gain.exponentialRampToValueAtTime(0.07, start + 1.6)
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, start + 2.5)

  rumble.connect(filter)
  filter.connect(rumbleGain)
  rumbleGain.connect(audio.destination)
  rumble.start(start)
  rumble.stop(start + 2.55)

  noiseBurst(0.3, { gain: 0.12, lowpass: 2500 })
}

/** Short celebratory burst for the very start of the final screen. */
export function playFinalCelebration(): void {
  ;[523, 659, 784, 988, 1318].forEach((freq, i) => tone(freq, 0.24, { type: 'triangle', gain: 0.07, delay: i * 0.08 }))
  noiseBurst(0.5, { gain: 0.05, lowpass: 4000, delay: 0.05 })
  tone(1600, 0.05, { type: 'sine', gain: 0.03, delay: 0.5 })
  tone(1800, 0.05, { type: 'sine', gain: 0.03, delay: 0.6 })
}

// --- Final screen ambient loop -------------------------------------------------
// A soft, slow, pentatonic pad + occasional plucks. Entirely synthesized,
// looped by re-scheduling itself, and always fadeable/stoppable.
const PENTATONIC = [220, 246.94, 293.66, 329.63, 392] // A minor pentatonic-ish, low register

let ambientMaster: GainNode | null = null
let ambientDrone: { osc: OscillatorNode; gain: GainNode } | null = null
let ambientTimer: number | null = null

function scheduleAmbientPluck(audio: AudioContext) {
  const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] * 2
  const start = audio.currentTime + 0.05
  const osc = audio.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, start)
  const gain = audio.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.035, start + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6)
  osc.connect(gain)
  if (ambientMaster) gain.connect(ambientMaster)
  osc.start(start)
  osc.stop(start + 1.7)
}

export function startFinalAmbientMusic(): void {
  const audio = getContext()
  if (!audio || ambientTimer !== null) return

  ambientMaster = audio.createGain()
  ambientMaster.gain.setValueAtTime(0, audio.currentTime)
  ambientMaster.gain.linearRampToValueAtTime(0.5, audio.currentTime + 2)
  ambientMaster.connect(audio.destination)

  const drone = audio.createOscillator()
  drone.type = 'sine'
  drone.frequency.value = PENTATONIC[0] / 2
  const droneGain = audio.createGain()
  droneGain.gain.value = 0.025
  drone.connect(droneGain)
  droneGain.connect(ambientMaster)
  drone.start()
  ambientDrone = { osc: drone, gain: droneGain }

  scheduleAmbientPluck(audio)
  ambientTimer = window.setInterval(() => {
    const current = getContext()
    if (current) scheduleAmbientPluck(current)
  }, 1900)
}

export function stopFinalAmbientMusic(): void {
  if (ambientTimer !== null) {
    window.clearInterval(ambientTimer)
    ambientTimer = null
  }
  const audio = ctx
  if (ambientMaster && audio) {
    const gain = ambientMaster
    const drone = ambientDrone
    gain.gain.cancelScheduledValues(audio.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, audio.currentTime)
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + 0.8)
    window.setTimeout(() => {
      drone?.osc.stop()
      gain.disconnect()
    }, 900)
  }
  ambientMaster = null
  ambientDrone = null
}
