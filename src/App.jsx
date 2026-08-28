import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoBar from './components/LogoBar'
import AIWork from './components/AIWork'
import UseCases from './components/UseCases'
import Testimonials from './components/Testimonials'
import LiveWorkspace from './components/LiveWorkspace'
import DemoCTA from './components/DemoCTA'
import DemoModal from './components/DemoModal'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import { api, getToken, setToken } from './lib/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState(null)
  const [demoOpen, setDemoOpen] = useState(false)

  useEffect(() => {
    if (!getToken()) return
    api('/api/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setToken(null))
  }, [])

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onOpenAuth={setAuthMode} onOpenDemo={() => setDemoOpen(true)} onLogout={logout} />
      <main>
        <Hero onSignup={() => setAuthMode('signup')} onOpenDemo={() => setDemoOpen(true)} />
        <LogoBar />
        <AIWork />
        <UseCases />
        <Testimonials />
        <LiveWorkspace user={user} onOpenAuth={setAuthMode} />
        <DemoCTA onOpenDemo={() => setDemoOpen(true)} />
      </main>
      <Footer />
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuthenticated={setUser} />}
      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}
    </div>
  )
}
