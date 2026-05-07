const ITEMS = [
  'Human Verification',
  'No Traffic Lights',
  'JWT Secured',
  '5 Questions',
  '30 Seconds',
  'Behavioral Scoring',
  'Open Source',
  'Drop-In Ready',
  'Privacy Safe',
  '7,776 Sessions',
]

const ITEMS_ALT = [
  'Zero Frustration',
  'Instant Results',
  'Bot-Proof',
  'No Google',
  'GDPR Friendly',
  'Emotional Intelligence',
  'Self-Hostable',
  'One API Call',
  'MIT License',
  'No Dark Patterns',
]

function Strip({ items, bg, reverse }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ backgroundColor: bg, height: 44, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
          animation: `marquee ${reverse ? '25s' : '20s'} linear infinite ${reverse ? 'reverse' : 'normal'}`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, color: '#fff', padding: '0 28px' }}>
              {item}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function MarqueeStrip() {
  return (
    <div>
      <Strip items={ITEMS}     bg="#4F46E5" reverse={false} />
      <Strip items={ITEMS_ALT} bg="#0F0F0F" reverse={true}  />
    </div>
  )
}
