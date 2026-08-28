import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { api, setToken } from '../lib/api'

export default function AuthModal({ mode = 'signup', onClose, onAuthenticated }) {
  const [tab, setTab] = useState(mode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setTab(mode), [mode])
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [onClose])

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = tab === 'signup'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password }
      const result = await api(`/api/auth/${tab}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setToken(result.token)
      onAuthenticated(result.user)
      onClose()
      requestAnimationFrame(() => document.querySelector('#workspace')?.scrollIntoView({ behavior: 'smooth' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop auth-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X /></button>
        <div className="auth-modal__brand"><span className="brand__cube">N</span><span>CodeForge</span></div>
        <h2>{tab === 'signup' ? 'Create your account' : 'Welcome back to CodeForge'}</h2>
        <p className="auth-modal__lead"></p>

        <div className="auth-tabs">
          <button className={tab === 'signup' ? 'is-active' : ''} onClick={() => { setTab('signup'); setError('') }}>Create account</button>
          <button className={tab === 'login' ? 'is-active' : ''} onClick={() => { setTab('login'); setError('') }}>Sign in</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {tab === 'signup' && <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" autoComplete="name" required /></label>}
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" autoComplete="email" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} minLength={6} required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button--dark auth-submit" type="submit" disabled={loading}>{loading ? 'Please wait…' : tab === 'signup' ? 'Create account' : 'Log in'}</button>
        </form>
      </div>
    </div>
  )
}
