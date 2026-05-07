import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import { api } from '@utils/api'

export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const { setUserFromToken } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      navigate('/login?error=' + (error || 'oauth-failed'), { replace: true })
      return
    }

    localStorage.setItem('humora_auth_token', token)
    api.auth.me()
      .then(user => {
        setUserFromToken(user)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('humora_auth_token')
        navigate('/login?error=auth-failed', { replace: true })
      })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Archivo, sans-serif',
      background: '#F5F5F7',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #E5E7EB',
          borderTop: '3px solid #4F46E5',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: '#6B7280', fontSize: 14 }}>Signing you in…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
