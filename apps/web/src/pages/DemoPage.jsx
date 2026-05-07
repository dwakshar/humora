import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '@components/Navbar'
import Footer from '@components/Footer'

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    category: 'Situational',
    q: "You haven't slept. The meeting starts in 5 minutes.",
    opts: [
      { text: "Panic visibly",           score: 8  },
      { text: "Fake a smile and hope",   score: 10 },
      { text: "Caffeinate aggressively", score: 11 },
      { text: "Reschedule boldly",       score: 7  },
    ],
  },
  {
    category: 'Social',
    q: "Someone keeps mispronouncing your name. You...",
    opts: [
      { text: "Correct them every single time",       score: 5  },
      { text: "Let it slide completely",              score: 7  },
      { text: "Correct once, then move on",           score: 10 },
      { text: "Start introducing yourself differently", score: 9 },
    ],
  },
  {
    category: 'Sensory',
    q: "Which would bother you more for an entire workday?",
    opts: [
      { text: "Wet socks",                    score: 10 },
      { text: "A hair tickling your face",    score: 11 },
      { text: "Slightly blurry vision",       score: 6  },
      { text: "One squeaky shoe only",        score: 9  },
    ],
  },
  {
    category: 'Humor',
    q: "The vending machine gives you an extra snack by accident. You...",
    opts: [
      { text: "Keep it — machine's fault",    score: 10 },
      { text: "Leave it for the next person", score: 7  },
      { text: "Tell someone immediately",     score: 4  },
      { text: "Walk away very quickly",       score: 12 },
    ],
  },
  {
    category: 'Emotional',
    q: "Your friend sends a 9-minute voice note. You...",
    opts: [
      { text: "Listen to all of it",                score: 7  },
      { text: "Speed to 2× immediately",            score: 10 },
      { text: "Check if they're okay first",        score: 8  },
      { text: "Reply with an equally long one",     score: 9  },
    ],
  },
]

const PERSONALITY_LINES = [
  'Chaotically empathetic. Definitely not a bot.',
  'Gloriously irrational. Verified human.',
  'Delightfully overthinking it. As expected.',
  'Suspiciously relatable. In a good way.',
  'Emotionally complex. Bots wish they were you.',
  'Beautifully unpredictable. That\'s very human.',
]

const MAX_ANSWER_SCORE = QUESTIONS.reduce((s, q) => s + Math.max(...q.opts.map(o => o.score)), 0) // 54

// ─── Code Snippets ────────────────────────────────────────────────────────────

const CODE = {
  HTML: {
    lang: 'HTML',
    code: `<!-- 1. Add script to <head> -->
<script src="https://widget.humora.io/humora.min.js"
        async defer></script>

<!-- 2. Place widget in your form -->
<form id="my-form" method="POST">
  <div id="humora-widget"
       data-sitekey="sk_live_YOUR_KEY">
  </div>
  <button type="submit">Submit</button>
</form>

<!-- 3. Handle the verified token -->
<script>
  humora.ready(function() {
    humora.render('humora-widget', {
      callback: function(token) {
        // User passed — submit your form
        document.getElementById('my-form').submit()
      },
      expiredCallback: function() {
        console.log('Token expired, please retry')
      }
    })
  })
</script>`,
  },
  React: {
    lang: 'JSX',
    code: `import { useEffect, useRef } from 'react'

function HumoraWidget({ sitekey, onVerified }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (window.humora && containerRef.current) {
      window.humora.render(containerRef.current, {
        sitekey,
        callback: (token) => onVerified(token),
        expiredCallback: () => onVerified(null),
      })
    }
  }, [])

  return <div ref={containerRef} />
}

// Verify on your backend
async function verifyToken(token) {
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return res.json() // { success: true, score: 61 }
}`,
  },
  'Next.js': {
    lang: 'JS',
    code: `// app/api/verify/route.js
export async function POST(req) {
  const { token } = await req.json()

  const res = await fetch(
    'https://api.humora.io/api/verify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        sitekey: process.env.HUMORA_SITE_KEY,
      }),
    }
  )

  const { success, score } = await res.json()

  if (!success) {
    return Response.json(
      { error: 'Verification failed' },
      { status: 403 }
    )
  }

  return Response.json({ verified: true, score })
}`,
  },
  Vue: {
    lang: 'Vue',
    code: `<template>
  <div ref="container" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['sitekey'])
const emit  = defineEmits(['verified'])
const container = ref(null)

onMounted(() => {
  if (window.humora) {
    window.humora.render(container.value, {
      sitekey: props.sitekey,
      callback: (token) => emit('verified', token),
      expiredCallback: () => emit('verified', null),
    })
  }
})
</script>`,
  },
  WordPress: {
    lang: 'PHP',
    code: `<?php
// functions.php — enqueue the widget script
function humora_enqueue_script() {
  wp_enqueue_script(
    'humora-widget',
    'https://widget.humora.io/humora.min.js',
    [], null, true
  );
}
add_action('wp_enqueue_scripts', 'humora_enqueue_script');

// In your form template:
// <div class="humora-widget"
//      data-sitekey="<?php echo esc_attr(HUMORA_SITE_KEY) ?>">
// </div>

// Verify the token server-side
function humora_verify_token($token) {
  $response = wp_remote_post(
    'https://api.humora.io/api/verify',
    ['body' => json_encode([
      'token'   => $token,
      'sitekey' => HUMORA_SITE_KEY,
    ])]
  );
  $body = json_decode(wp_remote_retrieve_body($response));
  return isset($body->success) && $body->success === true;
}`,
  },
  Python: {
    lang: 'Python',
    code: `# Django view — verify Humora token
import os, requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

HUMORA_SITE_KEY = os.environ['HUMORA_SITE_KEY']

@csrf_exempt
def contact_form(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    token = request.POST.get('humora_token')

    res = requests.post(
        'https://api.humora.io/api/verify',
        json={'token': token, 'sitekey': HUMORA_SITE_KEY},
        timeout=5,
    )

    result = res.json()

    if not result.get('success'):
        return JsonResponse({'error': 'Verification failed'}, status=403)

    # Human verified — process form
    return JsonResponse({'ok': True})`,
  },
}

// ─── Syntax Highlighter ───────────────────────────────────────────────────────

function highlight(code) {
  const parts = []
  let buf = '', i = 0
  const n = code.length
  const flush = (type) => { if (buf) { parts.push({ type, text: buf }); buf = '' } }

  while (i < n) {
    // Line comment //
    if (code[i] === '/' && code[i + 1] === '/') {
      flush('code')
      const end = code.indexOf('\n', i)
      const sl = code.slice(i, end === -1 ? n : end)
      parts.push({ type: 'comment', text: sl }); i += sl.length; continue
    }
    // Hash comment (Python/PHP)
    if (code[i] === '#' && (i === 0 || /[\n ]/.test(code[i - 1]))) {
      flush('code')
      const end = code.indexOf('\n', i)
      const sl = code.slice(i, end === -1 ? n : end)
      parts.push({ type: 'comment', text: sl }); i += sl.length; continue
    }
    // HTML comment
    if (code.slice(i, i + 4) === '<!--') {
      flush('code')
      const ce = code.indexOf('-->', i + 4)
      const sl = code.slice(i, ce === -1 ? n : ce + 3)
      parts.push({ type: 'comment', text: sl }); i += sl.length; continue
    }
    // Double-quoted string
    if (code[i] === '"') {
      flush('code')
      let j = i + 1
      while (j < n && code[j] !== '"') { if (code[j] === '\\') j++; j++ }
      parts.push({ type: 'string', text: code.slice(i, Math.min(j + 1, n)) }); i = j + 1; continue
    }
    // Single-quoted string
    if (code[i] === "'") {
      flush('code')
      let j = i + 1
      while (j < n && code[j] !== "'") { if (code[j] === '\\') j++; j++ }
      parts.push({ type: 'string', text: code.slice(i, Math.min(j + 1, n)) }); i = j + 1; continue
    }
    buf += code[i++]
  }
  flush('code')

  const e = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const KW = /\b(import|export|from|default|const|let|var|function|return|if|else|async|await|new|class|extends|typeof|null|true|false|undefined|def|public|private|protected|static|void|echo|add_action|csrf_exempt|setup|ref|onMounted|defineProps|defineEmits)\b/g
  const NUM = /\b(\d+)\b/g

  return parts.map(p => {
    if (p.type === 'comment') return `<span style="color:#6B7280;font-style:italic">${e(p.text)}</span>`
    if (p.type === 'string')  return `<span style="color:#86EFAC">${e(p.text)}</span>`
    return e(p.text)
      .replace(KW,  '<span style="color:#C084FC">$1</span>')
      .replace(NUM, '<span style="color:#FCD34D">$1</span>')
  }).join('')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcTimingBonus(avgMs) {
  if (avgMs <= 0)      return 0
  if (avgMs < 300)     return 1
  if (avgMs < 800)     return 4
  if (avgMs < 2000)    return 8
  if (avgMs < 4000)    return 10
  if (avgMs < 8000)    return 7
  return 5
}

function scaleAnswerScore(raw) {
  return Math.min(50, Math.round(raw * 50 / MAX_ANSWER_SCORE))
}

function makeFakeJWT(score) {
  const b64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '')
  const payload = btoa(JSON.stringify({ sessionId: `demo_${Date.now()}`, score, verdict: 'pass', exp: Math.floor(Date.now() / 1000) + 300 })).replace(/=/g, '')
  return `${b64}.${payload}.Xk2mNpQ8tZfVwR3jHLcY_demo_sig`
}

// ─── Widget: Welcome ──────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  return (
    <div style={{ padding: '36px 32px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>
        🖐
      </div>
      <h3 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 20, color: '#0F0F0F', margin: '0 0 10px' }}>
        Verify you're human
      </h3>
      <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 14, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.6 }}>
        Answer 5 quick questions.<br />No images. No crosswalks. Just you.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {['~30 sec', '5 questions', 'No tricks'].map(tag => (
          <span key={tag} style={{ backgroundColor: '#F3F4F6', borderRadius: 999, padding: '4px 12px', fontFamily: 'Archivo', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        style={{ width: '100%', height: 52, backgroundColor: '#4F46E5', color: '#fff', border: 'none', borderRadius: 14, fontFamily: 'Archivo', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'all 200ms' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'none' }}
      >
        Start Verification →
      </button>
      <p style={{ fontFamily: 'Archivo', fontSize: 11, color: '#D1D5DB', marginTop: 16 }}>
        Secured by Humora · No data stored
      </p>
    </div>
  )
}

// ─── Widget: Question ────────────────────────────────────────────────────────

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
    <div style={{ padding: '28px 28px 32px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i < qIdx ? 20 : i === qIdx ? 20 : 8, height: 6, borderRadius: 3, backgroundColor: i < qIdx ? '#4F46E5' : i === qIdx ? '#A5B4FC' : '#E5E7EB', transition: 'all 300ms' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 11, color: '#9CA3AF' }}>
          {qIdx + 1} of {total}
        </span>
      </div>

      {/* Category */}
      <div style={{ display: 'inline-block', backgroundColor: '#EEF2FF', borderRadius: 999, padding: '3px 10px', marginBottom: 14 }}>
        <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 10, color: '#4F46E5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {question.category}
        </span>
      </div>

      {/* Question */}
      <p style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 15, color: '#0F0F0F', lineHeight: 1.5, margin: '0 0 20px' }}>
        {question.q}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {question.opts.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(opt, i)}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', border: 'none', borderRadius: 12, cursor: selected !== null ? 'default' : 'pointer',
              backgroundColor: selected === i ? '#EEF2FF' : '#F9FAFB',
              outline: selected === i ? '2px solid #4F46E5' : '1.5px solid #E5E7EB',
              transition: 'all 200ms', textAlign: 'left',
            }}
            onMouseEnter={e => { if (selected === null) e.currentTarget.style.outline = '1.5px solid #A5B4FC' }}
            onMouseLeave={e => { if (selected !== i) e.currentTarget.style.outline = '1.5px solid #E5E7EB' }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: selected === i ? '2px solid #4F46E5' : '2px solid #D1D5DB',
              backgroundColor: selected === i ? '#4F46E5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected === i && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#fff' }} />}
            </div>
            <span style={{ fontFamily: 'Archivo', fontWeight: selected === i ? 600 : 400, fontSize: 13, color: selected === i ? '#4F46E5' : '#374151' }}>
              {opt.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Widget: Scoring ─────────────────────────────────────────────────────────

function ScoringScreen() {
  return (
    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid #EEF2FF', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
      <p style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 15, color: '#0F0F0F', margin: '0 0 8px' }}>
        Analyzing your responses…
      </p>
      <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 13, color: '#9CA3AF', margin: 0 }}>
        Scoring behavior, timing & patterns
      </p>
    </div>
  )
}

// ─── Widget: Result ──────────────────────────────────────────────────────────

function ResultScreen({ verdict, score, personality, onReset }) {
  const isPass    = verdict === 'pass'
  const isBorder  = verdict === 'borderline'

  const cfg = {
    pass:        { emoji: '✓', bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', label: 'Verified Human' },
    borderline:  { emoji: '~', bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', label: 'Borderline — extra check' },
    fail:        { emoji: '✗', bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', label: 'Verification Failed' },
  }[verdict]

  return (
    <div style={{ padding: '32px 28px', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: cfg.bg, border: `2px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, color: cfg.text }}
      >
        {cfg.emoji}
      </motion.div>

      <div style={{ display: 'inline-block', backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 999, padding: '5px 14px', marginBottom: 14 }}>
        <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 12, color: cfg.text }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, color: '#4F46E5', marginBottom: 4 }}>
        {score} <span style={{ fontSize: 16, color: '#9CA3AF', fontWeight: 400 }}>/ 70</span>
      </div>

      {isPass && personality && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 13, fontStyle: 'italic', color: '#374151', margin: '0 0 20px', lineHeight: 1.5 }}
        >
          "{personality}"
        </motion.p>
      )}

      {isBorder && (
        <p style={{ fontFamily: 'Archivo', fontSize: 13, color: '#92400E', margin: '0 0 20px' }}>
          One more question to confirm…
        </p>
      )}

      {!isPass && !isBorder && (
        <p style={{ fontFamily: 'Archivo', fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
          Something felt a bit off. No worries — try again.
        </p>
      )}

      <button
        onClick={onReset}
        style={{ width: '100%', height: 44, backgroundColor: isPass ? '#F3F4F6' : '#4F46E5', color: isPass ? '#374151' : '#fff', border: 'none', borderRadius: 12, fontFamily: 'Archivo', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 200ms' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        {isPass ? '↺ Try again' : '↺ Retry verification'}
      </button>
    </div>
  )
}

// ─── Widget State Machine ────────────────────────────────────────────────────

function HumoraWidgetDemo({ onAnswer, onComplete, onReset, timingBonus, behaviorScore }) {
  const [phase,   setPhase]   = useState('welcome') // welcome | question | scoring | pass | fail | borderline
  const [qIdx,    setQIdx]    = useState(0)
  const [score,   setScore]   = useState(0)
  const [rawScore, setRawScore] = useState(0)
  const personality = useMemo(() => PERSONALITY_LINES[Math.floor(Math.random() * PERSONALITY_LINES.length)], [])

  const handleStart = () => setPhase('question')

  const handleAnswer = useCallback((answerScore, timingMs) => {
    onAnswer(answerScore, timingMs)
    const newRaw = rawScore + answerScore
    setRawScore(newRaw)

    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(q => q + 1)
    } else {
      setPhase('scoring')
    }
  }, [qIdx, rawScore, onAnswer])

  useEffect(() => {
    if (phase !== 'scoring') return
    const t = setTimeout(() => {
      const total = Math.min(70, scaleAnswerScore(rawScore) + timingBonus + behaviorScore)
      setScore(total)
      const v = total >= 50 ? 'pass' : total >= 35 ? 'borderline' : 'fail'
      setPhase(v)
      onComplete(v, total)
    }, 1800)
    return () => clearTimeout(t)
  }, [phase, rawScore, timingBonus, behaviorScore, onComplete])

  const handleReset = () => {
    setPhase('welcome'); setQIdx(0); setRawScore(0); setScore(0); onReset()
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'welcome' && (
        <motion.div key="welcome" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <WelcomeScreen onStart={handleStart} />
        </motion.div>
      )}
      {phase === 'question' && (
        <motion.div key={`q${qIdx}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
          <QuestionScreen question={QUESTIONS[qIdx]} qIdx={qIdx} total={QUESTIONS.length} onAnswer={handleAnswer} />
        </motion.div>
      )}
      {phase === 'scoring' && (
        <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <ScoringScreen />
        </motion.div>
      )}
      {(phase === 'pass' || phase === 'fail' || phase === 'borderline') && (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResultScreen verdict={phase} score={score} personality={personality} onReset={handleReset} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Signal Panel ────────────────────────────────────────────────────────────

function Bar({ value, max, color = '#4F46E5', height = 6 }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ height, borderRadius: height / 2, backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ height: '100%', backgroundColor: color, borderRadius: height / 2 }}
      />
    </div>
  )
}

function MetricRow({ label, value, sub, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>{label}</span>
        <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 12, color: color || '#0F0F0F' }}>{value}</span>
      </div>
      {sub}
    </div>
  )
}

function EntropyDot({ level }) {
  const map = { low: { color: '#EF4444', label: 'Low' }, medium: { color: '#F59E0B', label: 'Medium' }, high: { color: '#10B981', label: 'High' } }
  const cfg = map[level]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.color }} />
      <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 12, color: cfg.color }}>{cfg.label}</span>
    </div>
  )
}

function SignalPanel({ answers, timings, mouseEntropy, phase, totalScore, timingBonus, behaviorScore }) {
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [copied,      setCopied]      = useState(false)
  const [jwt]         = useState(() => makeFakeJWT(totalScore))
  const answerScore   = Math.min(50, Math.round(answers.reduce((s, a) => s + a, 0) * 50 / MAX_ANSWER_SCORE))
  const lastTiming    = timings[timings.length - 1] || 0
  const avgTiming     = timings.length > 0 ? Math.round(timings.reduce((s, t) => s + t, 0) / timings.length) : 0
  const timingColor   = avgTiming === 0 ? '#9CA3AF' : avgTiming < 300 ? '#EF4444' : avgTiming < 800 ? '#F59E0B' : '#10B981'

  // Countdown on pass
  useEffect(() => {
    if (phase !== 'pass') return
    const id = setInterval(() => setSecondsLeft(s => s <= 1 ? (clearInterval(id), 0) : s - 1), 1000)
    return () => clearInterval(id)
  }, [phase])

  const timeStr = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`

  const copyJWT = () => {
    navigator.clipboard.writeText(jwt).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const empty = phase === 'welcome'
  const done  = phase === 'pass' || phase === 'fail' || phase === 'borderline'

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', padding: 24, position: 'sticky', top: 88 }}>
      <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 10, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
        What Humora Sees in Real Time
      </div>

      {/* Response Time */}
      <MetricRow
        label="Response Time"
        value={avgTiming > 0 ? `${avgTiming.toLocaleString()}ms` : '—'}
        color={timingColor}
        sub={<Bar value={Math.min(avgTiming, 5000)} max={5000} color={timingColor} />}
      />

      {/* Mouse Entropy */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 12, color: '#6B7280' }}>Mouse Entropy</span>
          <EntropyDot level={mouseEntropy} />
        </div>
      </div>

      {/* Answer Score */}
      <MetricRow
        label="Answer Score"
        value={empty ? '— / 50' : `${answerScore} / 50`}
        sub={<Bar value={answerScore} max={50} color="#4F46E5" />}
      />

      {/* Timing Bonus */}
      <MetricRow
        label="Timing Bonus"
        value={empty ? '— / 10' : `${timingBonus} / 10`}
        sub={<Bar value={timingBonus} max={10} color="#7C3AED" />}
      />

      {/* Behavior Score */}
      <MetricRow
        label="Behavior Score"
        value={empty ? '— / 10' : `${behaviorScore} / 10`}
        sub={<Bar value={behaviorScore} max={10} color="#0891B2" />}
      />

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#F3F4F6', margin: '16px 0' }} />

      {/* Total Score */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
          <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, color: '#0F0F0F' }}>Total Score</span>
          <motion.span
            key={totalScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 28, color: '#4F46E5', lineHeight: 1 }}
          >
            {empty ? '—' : totalScore}
            <span style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 13, color: '#9CA3AF' }}> / 70</span>
          </motion.span>
        </div>
        {/* Score bar with threshold markers */}
        <div style={{ position: 'relative' }}>
          <Bar value={empty ? 0 : totalScore} max={70} color="#4F46E5" height={10} />
          {/* Fail threshold marker at 35 */}
          <div style={{ position: 'absolute', top: -4, left: `${(35/70)*100}%`, width: 2, height: 18, backgroundColor: '#EF4444', borderRadius: 1 }} title="Fail threshold" />
          {/* Pass threshold marker at 50 */}
          <div style={{ position: 'absolute', top: -4, left: `${(50/70)*100}%`, width: 2, height: 18, backgroundColor: '#10B981', borderRadius: 1 }} title="Pass threshold" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'Archivo', fontSize: 10, color: '#EF4444' }}>✗ &lt;35</span>
          <span style={{ fontFamily: 'Archivo', fontSize: 10, color: '#F59E0B' }}>~ 35–49</span>
          <span style={{ fontFamily: 'Archivo', fontSize: 10, color: '#10B981' }}>✓ 50+</span>
        </div>
      </div>

      {/* Verdict */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Verdict badge */}
            {(() => {
              const vcfg = {
                pass:       { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', icon: '✓', label: 'PASS' },
                borderline: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', icon: '⚠', label: 'BORDERLINE' },
                fail:       { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '✗', label: 'FAIL' },
              }[phase]
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: vcfg.bg, border: `1px solid ${vcfg.border}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, color: vcfg.text }}>{vcfg.icon}</span>
                  <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, color: vcfg.text, letterSpacing: '0.06em' }}>{vcfg.label}</span>
                </div>
              )
            })()}

            {/* JWT on pass */}
            {phase === 'pass' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 11, color: '#374151' }}>JWT Token</span>
                  <span style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 11, color: '#9CA3AF' }}>
                    Expires in {timeStr}
                  </span>
                </div>
                <div style={{ position: 'relative', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px 10px', marginBottom: 0 }}>
                  <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#0F0F0F', margin: 0, wordBreak: 'break-all', lineHeight: 1.5, paddingRight: 28 }}>
                    {jwt.slice(0, 72)}…
                  </p>
                  <button
                    onClick={copyJWT}
                    title="Copy token"
                    style={{ position: 'absolute', top: 8, right: 8, backgroundColor: copied ? '#ECFDF5' : '#E5E7EB', border: 'none', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, transition: 'all 200ms' }}
                  >
                    {copied ? '✓' : '⎘'}
                  </button>
                </div>
                {copied && (
                  <p style={{ fontFamily: 'Archivo', fontSize: 11, color: '#10B981', marginTop: 6, textAlign: 'right' }}>
                    Copied!
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state hint */}
      {empty && (
        <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 12, color: '#D1D5DB', textAlign: 'center', margin: 0 }}>
          Start the widget to see live signals
        </p>
      )}
    </div>
  )
}

// ─── Demo Area (orchestrator) ─────────────────────────────────────────────────

function DemoArea() {
  const [answers,       setAnswers]       = useState([])
  const [timings,       setTimings]       = useState([])
  const [phase,         setPhase]         = useState('welcome')
  const [finalScore,    setFinalScore]    = useState(0)
  const [mouseMovements, setMouseMovements] = useState([])

  // Mouse tracking for entropy
  useEffect(() => {
    const onMove = (e) => {
      if (phase !== 'question') return
      setMouseMovements(prev => {
        const next = [...prev, { x: e.clientX, y: e.clientY }]
        return next.slice(-60)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [phase])

  const mouseEntropy = useMemo(() => {
    if (mouseMovements.length < 6) return 'low'
    const dists = mouseMovements.slice(1).map((m, i) => {
      const dx = m.x - mouseMovements[i].x
      const dy = m.y - mouseMovements[i].y
      return Math.sqrt(dx * dx + dy * dy)
    })
    const avg = dists.reduce((a, b) => a + b, 0) / dists.length
    const variance = dists.map(d => (d - avg) ** 2).reduce((a, b) => a + b, 0) / dists.length
    const entropy = Math.sqrt(variance)
    return entropy < 8 ? 'low' : entropy < 25 ? 'medium' : 'high'
  }, [mouseMovements])

  const handleAnswer = useCallback((answerScore, timingMs) => {
    setAnswers(prev => [...prev, answerScore])
    setTimings(prev => [...prev, timingMs])
  }, [])

  const handleComplete = useCallback((v, score) => {
    setPhase(v)
    setFinalScore(score)
  }, [])

  const handleReset = useCallback(() => {
    setAnswers([]); setTimings([]); setPhase('welcome'); setFinalScore(0); setMouseMovements([])
  }, [])

  const avgTiming    = timings.length > 0 ? Math.round(timings.reduce((s, t) => s + t, 0) / timings.length) : 0
  const timingBonus  = calcTimingBonus(avgTiming)
  const behaviorScore = mouseEntropy === 'high' ? 8 : mouseEntropy === 'medium' ? 5 : 2
  const answerScore  = Math.min(50, Math.round(answers.reduce((s, a) => s + a, 0) * 50 / MAX_ANSWER_SCORE))
  const totalScore   = phase === 'welcome' ? 0 : phase === 'question' ? answerScore + timingBonus + behaviorScore : finalScore

  return (
    <section style={{ backgroundColor: '#fff', padding: '0 0 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32, alignItems: 'start' }}>

          {/* Left: Widget */}
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 10, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Live Widget
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', overflow: 'hidden', minHeight: 320 }}>
              <HumoraWidgetDemo
                onAnswer={handleAnswer}
                onComplete={handleComplete}
                onReset={handleReset}
                timingBonus={timingBonus}
                behaviorScore={behaviorScore}
              />
            </div>
            <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 12, color: '#C4C4C4', textAlign: 'center', marginTop: 12 }}>
              ↑ This is exactly what your users see
            </p>
          </div>

          {/* Right: Signal Panel */}
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 10, color: '#9CA3AF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              What Humora Sees
            </div>
            <SignalPanel
              answers={answers}
              timings={timings}
              mouseEntropy={mouseEntropy}
              phase={phase}
              totalScore={totalScore}
              timingBonus={timingBonus}
              behaviorScore={behaviorScore}
            />
          </div>
        </div>

        {/* Responsive */}
        <style>{`
          @media (max-width: 768px) {
            .demo-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ tab }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(tab.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const html = useMemo(() => highlight(tab.code), [tab.code])

  return (
    <div style={{ backgroundColor: '#0F1117', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 11, color: '#4B5563', letterSpacing: '0.06em' }}>
          {tab.lang}
        </span>
        <button
          onClick={copy}
          style={{ backgroundColor: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: '5px 12px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 11, color: copied ? '#10B981' : '#9CA3AF', cursor: 'pointer', transition: 'all 200ms' }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {/* Code */}
      <pre
        style={{ margin: 0, padding: '20px 24px', fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace', fontSize: 13, lineHeight: 1.75, overflowX: 'auto', color: '#F8FAFC' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// ─── Code Tabs ────────────────────────────────────────────────────────────────

function CodeTabs() {
  const [active, setActive] = useState('HTML')
  const tabKeys = Object.keys(CODE)

  return (
    <section style={{ backgroundColor: '#F5F5F7', padding: '80px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 36px)', color: '#0F0F0F', textAlign: 'center', margin: '0 0 40px', letterSpacing: '-0.02em' }}
        >
          Add it to your site in 5 minutes
        </motion.h2>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 24, overflowX: 'auto' }}>
          {tabKeys.map(key => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'Archivo', fontWeight: active === key ? 600 : 400, fontSize: 14,
                color: active === key ? '#4F46E5' : '#6B7280',
                borderBottom: active === key ? '2px solid #4F46E5' : '2px solid transparent',
                marginBottom: -2, whiteSpace: 'nowrap', transition: 'color 150ms',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <CodeBlock tab={CODE[active]} />
          </motion.div>
        </AnimatePresence>

        <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 20 }}>
          Full guides available for HTML, React, Next.js, Vue, WordPress, Django · &nbsp;
          <a href="/docs" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>View docs →</a>
        </p>
      </div>
    </section>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function DemoHero() {
  return (
    <section style={{ backgroundColor: '#fff', padding: '80px 0 56px', textAlign: 'center' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div style={{ display: 'inline-block', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: 13, color: '#065F46' }}>No signup required</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 'clamp(38px, 6vw, 56px)', color: '#0F0F0F', letterSpacing: '-0.02em', margin: '0 0 20px', lineHeight: 1.1 }}
        >
          Try Humora yourself.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 17, color: '#6B7280', lineHeight: 1.7, margin: 0 }}
        >
          This is exactly what your users see.<br />
          5 questions. 30 seconds. Zero frustration.<br />
          No bots. Just pure, delightful verification.
        </motion.p>
      </div>
    </section>
  )
}

function BottomCTA() {
  return (
    <section style={{ backgroundColor: '#fff', padding: '80px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#0F0F0F', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            Ready to replace your CAPTCHA?
          </h2>
          <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 16, color: '#6B7280', margin: '0 0 32px' }}>
            Get your free API key in 30 seconds.
          </p>
          <Link
            to="/signup"
            style={{ display: 'inline-flex', alignItems: 'center', height: 56, backgroundColor: '#4F46E5', color: '#fff', fontFamily: 'Archivo', fontWeight: 600, fontSize: 16, borderRadius: 14, padding: '0 36px', textDecoration: 'none', transition: 'all 200ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Get Your Free API Key →
          </Link>
          <p style={{ fontFamily: 'Archivo', fontWeight: 400, fontSize: 13, color: '#9CA3AF', marginTop: 18 }}>
            Already using Humora?&nbsp;
            <Link to="/login" style={{ color: '#6B7280', fontWeight: 500, textDecoration: 'underline' }}>
              Sign in to your dashboard →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <DemoHero />
        <DemoArea />
        <CodeTabs />
        <BottomCTA />
      </main>
      <Footer />
    </>
  )
}
