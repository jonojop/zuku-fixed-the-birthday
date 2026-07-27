// Tiny Web Audio synth. No audio files are downloaded — every effect is a
// short oscillator/noise burst generated locally, gated behind setEnabled(true)
// which the UI only calls after a real user gesture (autoplay-safe).
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

export function playClick(): void {
  tone(660, 0.06, { type: 'square', gain: 0.05 })
}

export function playFixCorrect(): void {
  tone(523, 0.12, { type: 'triangle', gain: 0.09 })
  tone(784, 0.16, { type: 'triangle', gain: 0.08, delay: 0.08 })
}

export function playFixIncorrect(): void {
  tone(180, 0.18, { type: 'sawtooth', gain: 0.07, sweepTo: 90 })
}

export function playTerminalBeep(): void {
  tone(880, 0.04, { type: 'square', gain: 0.035 })
}

export function playNalaJump(): void {
  tone(400, 0.1, { type: 'sine', gain: 0.07, sweepTo: 700 })
}

export function playCandleLight(): void {
  tone(900, 0.05, { type: 'sine', gain: 0.05, sweepTo: 1100 })
}

export function playCandlesOut(): void {
  const audio = getContext()
  if (!audio) return
  const bufferSize = audio.sampleRate * 0.4
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = audio.createBufferSource()
  noise.buffer = buffer
  const gainNode = audio.createGain()
  gainNode.gain.setValueAtTime(0.15, audio.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4)
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1200
  noise.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(audio.destination)
  noise.start()
}

export function playEngineRev(): void {
  tone(80, 0.5, { type: 'sawtooth', gain: 0.06, sweepTo: 140 })
  tone(70, 0.5, { type: 'square', gain: 0.03, delay: 0.05, sweepTo: 130 })
}

export function playDeploySuccess(): void {
  ;[523, 659, 784, 1046].forEach((freq, i) => tone(freq, 0.22, { type: 'triangle', gain: 0.08, delay: i * 0.11 }))
}
