import { Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import WorkspaceDemo from './WorkspaceDemo'

export default function Hero({ onSignup, onOpenDemo }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const heroTitleRef = useRef(null)

  const handleCursorMove = (event) => {
    const title = heroTitleRef.current
    if (!title || window.matchMedia('(pointer: coarse)').matches) return

    const area = event.currentTarget.getBoundingClientRect()
    const normalizedX = ((event.clientX - area.left) / area.width - 0.5) * 2
    const normalizedY = ((event.clientY - area.top) / area.height - 0.5) * 2

    title.style.setProperty('--cursor-x', `${normalizedX * 10}px`)
    title.style.setProperty('--cursor-y', `${normalizedY * 7}px`)
    title.style.setProperty('--cursor-rx', `${normalizedY * -1.8}deg`)
    title.style.setProperty('--cursor-ry', `${normalizedX * 2.2}deg`)
    title.style.setProperty('--cursor-shadow-x', `${normalizedX * -12}px`)
    title.style.setProperty('--cursor-shadow-y', `${normalizedY * -10}px`)
    title.style.setProperty('--cursor-accent-x', `${normalizedX * 7}px`)
  }

  const resetCursorText = () => {
    const title = heroTitleRef.current
    if (!title) return

    title.style.setProperty('--cursor-x', '0px')
    title.style.setProperty('--cursor-y', '0px')
    title.style.setProperty('--cursor-rx', '0deg')
    title.style.setProperty('--cursor-ry', '0deg')
    title.style.setProperty('--cursor-shadow-x', '0px')
    title.style.setProperty('--cursor-shadow-y', '0px')
    title.style.setProperty('--cursor-accent-x', '0px')
  }

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setVideoOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <section className="hero section-shell" id="top">
        <div
          className="hero__copy"
          onPointerMove={handleCursorMove}
          onPointerLeave={resetCursorText}
        >
          <h1
            ref={heroTitleRef}
            className="cursor-reactive-title"
            aria-label="Where teams and agents Think together."
          >
            Where teams and agents <span className="cursor-reactive-highlight">Think</span> together.
          </h1>
          <p>Capture context, find answers, and automate tasks with AI built for your team.</p>
          <div className="hero__actions">
            <button className="button button--blue" onClick={onSignup}>Get Notion free</button>
            <button className="button button--pale" onClick={onOpenDemo}>Request a demo →</button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero-orbit hero-orbit--one">✦</div>
          <div className="hero-orbit hero-orbit--two">✧</div>
          <div className="hero-orbit hero-orbit--three">✦</div>
          <WorkspaceDemo mode="capture" />
          <button className="play-pill" onClick={() => setVideoOpen(true)}><Play size={16} fill="currentColor" /> Play</button>
        </div>
      </section>

      {videoOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={() => setVideoOpen(false)}>
          <div className="video-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoOpen(false)} aria-label="Close"><X /></button>
            <div className="video-modal__copy">
              <span className="eyebrow">AI workspace demo</span>
              <h2>One place to capture, search, and automate work.</h2>
              <p>This competition build recreates the public interaction with an animated product demo while the full-stack workspace below uses your own backend and database.</p>
            </div>
            <WorkspaceDemo mode="automate" compact />
          </div>
        </div>
      )}
    </>
  )
}
