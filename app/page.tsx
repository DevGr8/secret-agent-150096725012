'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

const fallingCharacters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}//\\$#@%&'
const cipherWords = ['NEBULA', 'PHANTOM', 'CIPHER', 'QUANTUM', 'ORBIT']

type LogLine = { text: string; tone?: 'muted' | 'success' | 'error' }

function createRainColumns() {
  return Array.from({ length: 48 }, (_, index) => ({
    left: `${(index / 48) * 100 + Math.random() * 2}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${7 + Math.random() * 11}s`,
    opacity: 0.15 + Math.random() * 0.5,
    text: Array.from({ length: 10 + Math.floor(Math.random() * 15) }, () => fallingCharacters[Math.floor(Math.random() * fallingCharacters.length)]).join(''),
  }))
}

export default function Page() {
  const [logs, setLogs] = useState<LogLine[]>([
    { text: 'SECURE SHELL v2.4.7 // SIMULATION MODE', tone: 'success' },
    { text: 'Type help to see available commands.', tone: 'muted' },
  ])
  const [command, setCommand] = useState('')
  const [progress, setProgress] = useState(68)
  const [muted, setMuted] = useState(true)
  const [gameWord, setGameWord] = useState(() => cipherWords[Math.floor(Math.random() * cipherWords.length)])
  const [guess, setGuess] = useState('')
  const [gameMessage, setGameMessage] = useState('Awaiting your decryption key...')
  const [gameState, setGameState] = useState<'idle' | 'success' | 'failure'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const rain = useMemo(createRainColumns, [])

  useEffect(() => {
    const timer = window.setInterval(() => setProgress((value) => value >= 97 ? 42 : value + 1), 1800)
    return () => window.clearInterval(timer)
  }, [])

  function playTone(frequency: number, duration = 0.08) {
    if (muted || typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = frequency
    oscillator.type = 'square'
    gain.gain.setValueAtTime(0.03, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  }

  function calculateCipherScore(value: string, answer: string) {
    if (!value.trim() || !answer.trim()) return 0
    return value.trim().toUpperCase() === answer.trim().toUpperCase() ? 100 : Math.max(0, 100 - Math.abs(value.trim().length - answer.length) * 12)
  }

  function submitCommand(event: FormEvent) {
    event.preventDefault()
    const trimmed = command.trim().toLowerCase()
    if (!trimmed) {
      setLogs((current) => [...current, { text: 'ERR: Empty input. Enter a command or type help.', tone: 'error' }])
      return
    }
    const responses: Record<string, LogLine[]> = {
      help: [{ text: 'COMMANDS: help  scan  decrypt  status  clear', tone: 'success' }, { text: 'Use decrypt to open the cipher challenge.' }],
      scan: [{ text: 'SCANNING SIMULATED NODE...', tone: 'muted' }, { text: '3 ports found / 0 real systems accessed', tone: 'success' }],
      decrypt: [{ text: 'CIPHER MODULE ONLINE. Check the challenge panel.', tone: 'success' }],
      status: [{ text: `SIMULATION: ACTIVE // SIGNAL: ${progress}% // OPERATOR: AYUSH KUMAR SINGH`, tone: 'success' }],
      clear: [],
    }
    if (trimmed === 'clear') setLogs([])
    else setLogs((current) => [...current, { text: `> ${command}`, tone: 'muted' }, ...(responses[trimmed] ?? [{ text: `ERR: Unknown command "${command}". Try help.`, tone: 'error' }])])
    playTone(trimmed in responses ? 520 : 180)
    setCommand('')
  }

  function submitGuess(event: FormEvent) {
    event.preventDefault()
    const score = calculateCipherScore(guess, gameWord)
    if (!guess.trim()) {
      setGameMessage('Enter a key before submitting.')
      setGameState('failure')
      playTone(160)
      return
    }
    if (score === 100) {
      setGameMessage('ACCESS GRANTED. Cipher neutralized.')
      setGameState('success')
      playTone(760, 0.18)
    } else {
      setGameMessage(`ACCESS DENIED. Signal mismatch (${score}% match).`)
      setGameState('failure')
      playTone(160)
    }
  }

  function restartGame() {
    setGameWord(cipherWords[Math.floor(Math.random() * cipherWords.length)])
    setGuess('')
    setGameMessage('Awaiting your decryption key...')
    setGameState('idle')
  }

  return (
    <main className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="scanlines" aria-hidden="true" />
      <div className="rain" aria-hidden="true">{rain.map((column, index) => <span key={index} style={{ left: column.left, animationDelay: column.delay, animationDuration: column.duration, opacity: column.opacity }}>{column.text}</span>)}</div>
      <div className="terminal-shell">
        <header className="topbar">
          <div className="brand-mark"><span className="brand-dot" /> BLACK//BOX <span className="brand-sub">SECURITY SIMULATION</span></div>
          <button className="mute-button" type="button" onClick={(event) => { event.stopPropagation(); setMuted((value) => !value) }} aria-label={muted ? 'Unmute sound' : 'Mute sound'}>{muted ? 'SOUND: OFF' : 'SOUND: ON'}</button>
        </header>
        <section className="hero-panel">
          <div><p className="eyebrow">// CLASSIFIED TRAINING ENVIRONMENT</p><h1>THE SECRET AGENT<br /><em>HACKER TERMINAL</em></h1><p className="hero-copy">A playful command-line simulation for learning logic, ciphers, and terminal thinking. No real systems are accessed.</p></div>
          <div className="agent-stamp"><span>AGENT</span><strong>007</strong><small>SIMULATION ONLY</small></div>
        </section>
        <div className="dashboard-grid">
          <section className="panel terminal-panel" aria-label="Interactive terminal">
            <div className="panel-heading"><span className="status-light" /> TERMINAL <span className="panel-meta">CONNECTED / LOCAL</span></div>
            <div className="terminal-output" aria-live="polite">{logs.map((log, index) => <p key={`${log.text}-${index}`} className={log.tone}>{log.text}</p>)}</div>
            <form className="command-form" onSubmit={submitCommand}><label htmlFor="command-input" className="prompt">agent@blackbox:~$</label><input ref={inputRef} id="command-input" value={command} onChange={(event) => setCommand(event.target.value)} autoComplete="off" spellCheck={false} aria-label="Terminal command" /><button type="submit" className="sr-only">Run command</button></form>
          </section>
          <section className="panel game-panel" aria-label="Cipher mini-game">
            <div className="panel-heading"><span className="lock-icon">[+]</span> CIPHER BREAKER <span className="panel-meta">MINI-GAME</span></div>
            <div className="game-content"><p className="game-label">DECRYPT THIS WORD</p><div className="cipher-display" aria-label="Scrambled cipher">{gameWord.split('').map((letter, index) => <span key={`${letter}-${index}`}>{String.fromCharCode(((letter.charCodeAt(0) - 65 + 3) % 26) + 65)}</span>)}</div><p className="hint">Hint: Caesar shift −3. Decode the letters above.</p><form onSubmit={submitGuess} className="guess-form"><input value={guess} onChange={(event) => setGuess(event.target.value)} placeholder="ENTER KEY" aria-label="Cipher answer" maxLength={20} /><button type="submit">SUBMIT</button></form><p className={`game-message ${gameState}`}>{gameMessage}</p><button className="restart-button" type="button" onClick={restartGame}>↻ RESTART CHALLENGE</button></div>
          </section>
        </div>
        <section className="mission-strip"><div className="mission-title"><span>MISSION PROGRESS</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><div className="mission-footer"><span>ENCRYPTED CHANNEL: STABLE</span><span>UPTIME 00:42:19</span><span>THREAT LEVEL: LOW</span></div></section>
        <footer><span>CREATED BY STUDENT #150096725012</span><span>AYUSH KUMAR SINGH <i>•</i> EDUCATIONAL PROJECT</span></footer>
      </div>
    </main>
  )
}
