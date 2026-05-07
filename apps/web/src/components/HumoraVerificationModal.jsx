import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
  {
    category: 'Situational',
    q: "You haven't slept. The meeting starts in 5 minutes.",
    opts: [
      { text: 'Panic visibly',           score: 8  },
      { text: 'Fake a smile and hope',   score: 10 },
      { text: 'Caffeinate aggressively', score: 11 },
      { text: 'Reschedule boldly',       score: 7  },
    ],
  },
  {
    category: 'Social',
    q: "Someone keeps mispronouncing your name. You…",
    opts: [
      { text: 'Correct them every single time',        score: 5  },
      { text: 'Let it slide completely',               score: 7  },
      { text: 'Correct once, then move on',            score: 10 },
      { text: 'Start introducing yourself differently', score: 9 },
    ],
  },
  {
    category: 'Sensory',
    q: "Which would bother you more for an entire workday?",
    opts: [
      { text: 'Wet socks',                 score: 10 },
      { text: 'A hair tickling your face', score: 11 },
      { text: 'Slightly blurry vision',    score: 6  },
      { text: 'One squeaky shoe only',     score: 9  },
    ],
  },
  {
    category: 'Humor',
    q: "The vending machine gives you an extra snack by accident. You…",
    opts: [
      { text: "Keep it — machine's fault",   score: 10 },
      { text: 'Leave it for the next person', score: 7  },
      { text: 'Tell someone immediately',     score: 4  },
      { text: 'Walk away very quickly',       score: 12 },
    ],
  },
  {
    category: 'Emotional',
    q: "Your friend sends a 9-minute voice note. You…",
    opts: [
      { text: 'Listen to all of it',             score: 7  },
      { text: 'Speed to 2× immediately',          score: 10 },
      { text: "Check if they're okay first",      score: 8  },
      { text: 'Reply with an equally long one',   score: 9  },
    ],
  },
]

const MAX_ANSWER_SCORE = QUESTIONS.reduce((s, q) => s + Math.max(...q.opts.map(o => o.score)), 0)

function calcTimingBonus(avgMs) {
  if (avgMs <= 0)   return 0
  if (avgMs < 300)  return 1
  if (avgMs < 800)  return 4
  if (avgMs < 2000) return 8
  if (avgMs < 4000) return 10
  if (avgMs < 8000) return 7
  return 5
}

function scaleAnswerScore(raw) {
  return Math.min(50, Math.round(raw * 50 / MAX_ANSWER_SCORE))
}

function makeFakeToken(score) {
  const payload = btoa(JSON.stringify({ score, verdict: 'pass', exp: Math.floor(Date.now() / 1000) + 300 })).replace(/=/g, '')
  return `humora_${payload}_${Date.now()}`
}

// ── WelcomeScreen ─────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <div style={{ padding: '32px 28px', textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>
        🖐
      </div>
      <h3 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 18, color: '#0F0F0F', margin: '0 0 8px' }}>
        Quick human check
      </h3>
      <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
        Answer 5 quick questions.<br />No images. No crosswalks. Just you.
      </p>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
        {['~30 sec', '5 questions', 'No tricks'].map(tag => (
          <span key={tag} style={{ backgroundColor: '#F3F4F6', borderRadius: 999, padding: '3px 10px', fontFamily: 'Archivo, sans-serif', fontWeight: 500, fontSize: 11, color: '#6B7280' }}>
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        style={{ width: '100%', height: 48, backgroundColor: '#4F46E5', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 200ms' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4338CA' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4F46E5' }}
      >
        Start Verification →
      </button>
      <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 10, color: '#D1D5DB', marginTop: 14 }}>
        Secured by Humora · No data stored
      </p>
    </div>
  )
}

// ── QuestionScreen ────────────────────────────────────────────
function QuestionScreen({ question, qIdx, total, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const startRef = useRef(Date.now())

  const handleSelect = (opt, idx) => {
    if (selected !== null) return
    setSelected(idx)
    const ms = Date.now() - startRef.current
    setTimeout(() => onAnswer(opt.score, ms), 400)
  }

  return (
    <div style={{ padding: '24px 24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i <= qIdx ? 18 : 7, height: 5, borderRadius: 3, backgroundColor: i < qIdx ? '#4F46E5' : i === qIdx ? '#A5B4FC' : '#E5E7EB', transition: 'all 300ms' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 500, fontSize: 11, color: '#9CA3AF' }}>
          {qIdx + 1} / {total}
        </span>
      </div>

      <div style={{ display: 'inline-block', backgroundColor: '#EEF2FF', borderRadius: 999, padding: '3px 9px', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 9, color: '#4F46E5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {question.category}
        </span>
      </div>

      <p style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 14, color: '#0F0F0F', lineHeight: 1.5, margin: '0 0 16px' }}>
        {question.q}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.opts.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(opt, i)}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', border: 'none', borderRadius: 10, cursor: selected !== null ? 'default' : 'pointer',
              backgroundColor: selected === i ? '#EEF2FF' : '#F9FAFB',
              outline: selected === i ? '2px solid #4F46E5' : '1.5px solid #E5E7EB',
              transition: 'all 200ms', textAlign: 'left',
            }}
            onMouseEnter={e => { if (selected === null) e.currentTarget.style.outline = '1.5px solid #A5B4FC' }}
            onMouseLeave={e => { if (selected !== i) e.currentTarget.style.outline = '1.5px solid #E5E7EB' }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              border: selected === i ? '2px solid #4F46E5' : '2px solid #D1D5DB',
              backgroundColor: selected === i ? '#4F46E5' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected === i && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />}
            </div>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: selected === i ? 600 : 400, fontSize: 13, color: selected === i ? '#4F46E5' : '#374151' }}>
              {opt.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── ScoringScreen ─────────────────────────────────────────────
function ScoringScreen() {
  return (
    <div style={{ padding: '48px 28px', textAlign: 'center' }}>
      <style>{`@keyframes hum-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #EEF2FF', borderTopColor: '#4F46E5', animation: 'hum-spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 14, color: '#0F0F0F', margin: '0 0 6px' }}>
        Analyzing responses…
      </p>
      <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: '#9CA3AF', margin: 0 }}>
        Scoring behavior, timing & patterns
      </p>
    </div>
  )
}

// ── PassScreen ────────────────────────────────────────────────
function PassScreen({ score }) {
  return (
    <div style={{ padding: '36px 28px', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, color: '#065F46' }}
      >
        ✓
      </motion.div>
      <div style={{ display: 'inline-block', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 999, padding: '4px 12px', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, color: '#065F46' }}>Verified Human</span>
      </div>
      <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 28, color: '#4F46E5', marginBottom: 8 }}>
        {score} <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 400 }}>/ 70</span>
      </div>
      <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
        Proceeding…
      </p>
      <div style={{ width: '100%', height: 3, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ height: '100%', backgroundColor: '#10B981', borderRadius: 999 }}
        />
      </div>
    </div>
  )
}

// ── FailScreen ────────────────────────────────────────────────
function FailScreen({ score, onRetry }) {
  return (
    <div style={{ padding: '36px 28px', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#FEF2F2', border: '2px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, color: '#991B1B' }}
      >
        ✗
      </motion.div>
      <div style={{ display: 'inline-block', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 999, padding: '4px 12px', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, color: '#991B1B' }}>Verification Failed</span>
      </div>
      <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 28, color: '#4F46E5', marginBottom: 8 }}>
        {score} <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 400 }}>/ 70</span>
      </div>
      <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
        Something felt off. No worries — give it another go.
      </p>
      <button
        onClick={onRetry}
        style={{ width: '100%', height: 44, backgroundColor: '#4F46E5', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        ↺ Retry verification
      </button>
    </div>
  )
}

// ── Widget state machine ──────────────────────────────────────
function VerificationWidget({ onVerified, onFailed }) {
  const [phase, setPhase] = useState('welcome')
  const [qIdx, setQIdx] = useState(0)
  const [rawScore, setRawScore] = useState(0)
  const [timings, setTimings] = useState([])
  const [finalScore, setFinalScore] = useState(0)

  const handleStart = () => setPhase('question')

  const handleAnswer = useCallback((answerScore, ms) => {
    const newRaw = rawScore + answerScore
    setRawScore(newRaw)
    setTimings(prev => [...prev, ms])

    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(q => q + 1)
    } else {
      setPhase('scoring')
    }
  }, [qIdx, rawScore])

  useEffect(() => {
    if (phase !== 'scoring') return
    const t = setTimeout(() => {
      const avgMs = timings.length ? timings.reduce((s, v) => s + v, 0) / timings.length : 0
      const total = Math.min(70, scaleAnswerScore(rawScore) + calcTimingBonus(avgMs) + 6)
      setFinalScore(total)
      if (total >= 50) {
        setPhase('pass')
        setTimeout(() => onVerified(makeFakeToken(total)), 1400)
      } else {
        setPhase('fail')
        onFailed()
      }
    }, 1800)
    return () => clearTimeout(t)
  }, [phase, rawScore, timings, onVerified, onFailed])

  const handleRetry = () => {
    setPhase('welcome')
    setQIdx(0)
    setRawScore(0)
    setTimings([])
    setFinalScore(0)
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'welcome' && (
        <motion.div key="welcome" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <WelcomeScreen onStart={handleStart} />
        </motion.div>
      )}
      {phase === 'question' && (
        <motion.div key={`q${qIdx}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
          <QuestionScreen question={QUESTIONS[qIdx]} qIdx={qIdx} total={QUESTIONS.length} onAnswer={handleAnswer} />
        </motion.div>
      )}
      {phase === 'scoring' && (
        <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <ScoringScreen />
        </motion.div>
      )}
      {phase === 'pass' && (
        <motion.div key="pass" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <PassScreen score={finalScore} />
        </motion.div>
      )}
      {phase === 'fail' && (
        <motion.div key="fail" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <FailScreen score={finalScore} onRetry={handleRetry} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Modal overlay ─────────────────────────────────────────────
export default function HumoraVerificationModal({ isOpen, onVerified, onClose }) {
  const handleVerified = useCallback((token) => {
    onVerified(token)
  }, [onVerified])

  const handleFailed = useCallback(() => {
    // stay open — user can retry inside the modal
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              width: '100%',
              maxWidth: 400,
              backgroundColor: '#fff',
              borderRadius: 20,
              boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#4F46E5" />
                  <path d="M12 7a4 4 0 0 1 4 4c0 2.2-.8 4.2-2.1 5.8" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M8 11a4 4 0 0 1 4-4" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.6-1.8 6.4" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.77 4.42-2.07 6.1" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, color: '#0F0F0F' }}>
                  Humora · Human Verification
                </span>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', fontSize: 18, lineHeight: 1, borderRadius: 6 }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.color = '#374151' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF' }}
                aria-label="Close verification"
              >
                ×
              </button>
            </div>

            <VerificationWidget key={isOpen ? 'open' : 'closed'} onVerified={handleVerified} onFailed={handleFailed} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
