import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X, Sparkles, Bot, FileText, Search, BookOpen, CalendarDays, ShieldCheck, Plug, LogOut } from 'lucide-react'
import { menuData } from '../data/siteData'

const iconMap = {
  'Notion AI': Sparkles,
  Agents: Bot,
  'AI Meeting Notes': FileText,
  'Enterprise Search': Search,
  'Knowledge Base': BookOpen,
  Docs: FileText,
  Projects: BookOpen,
  Connections: Plug,
  Security: ShieldCheck,
  'Notion Calendar': CalendarDays,
}

function MegaMenu({ name }) {
  return (
    <div className={`mega-menu mega-menu--${name.toLowerCase()}`} role="menu">
      <div className="mega-menu__grid">
        {menuData[name].map((group) => (
          <div className="mega-group" key={group.title}>
            <div className="mega-group__title">{group.title}</div>
            {group.items.map(([label, description]) => {
              const Icon = iconMap[label]
              return (
                <a className="mega-item" href="#ai-work" key={label} role="menuitem">
                  {Icon && <span className="mega-item__icon"><Icon size={18} strokeWidth={1.8} /></span>}
                  <span><strong>{label}</strong><small>{description}</small></span>
                </a>
              )
            })}
          </div>
        ))}
      </div>
      {name === 'Product' && <div className="mega-menu__footer"><a href="#use-cases">See what’s new →</a><a href="#footer">Download the Notion App →</a></div>}
    </div>
  )
}

export default function Navbar({ user, onOpenAuth, onOpenDemo, onLogout }) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const navRef = useRef(null)
  const closeTimer = useRef(null)

  const openMenu = (name) => { clearTimeout(closeTimer.current); setActiveMenu(name) }
  const queueClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setActiveMenu(null), 120) }

  useEffect(() => {
    const onOutside = (event) => { if (navRef.current && !navRef.current.contains(event.target)) setActiveMenu(null) }
    const onKey = (event) => { if (event.key === 'Escape') { setActiveMenu(null); setMobileOpen(false) } }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onOutside); document.removeEventListener('keydown', onKey); clearTimeout(closeTimer.current) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className="navbar" ref={navRef}>
        <div className="navbar__left">
          <a className="brand" href="#top" aria-label="Notion home"><span className="brand__cube">N</span><span>Notion</span></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {['Product', 'AI', 'Resources'].map((name) => (
              <div className="nav-dropdown" key={name} onMouseEnter={() => openMenu(name)} onMouseLeave={queueClose}>
                <button className={`nav-link ${activeMenu === name ? 'is-active' : ''}`} onClick={() => setActiveMenu(activeMenu === name ? null : name)} aria-expanded={activeMenu === name}>{name}<ChevronDown size={14} className={activeMenu === name ? 'rotate' : ''} /></button>
                {activeMenu === name && <MegaMenu name={name} />}
              </div>
            ))}
            {['Developers', 'Startups', 'Enterprise', 'Pricing'].map((item) => <a className="nav-link" href="#use-cases" key={item}>{item}</a>)}
            {user && <a className="nav-link" href="#workspace">Workspace</a>}
          </nav>
        </div>

        <div className="navbar__right">
          <button className="nav-link" onClick={onOpenDemo}>Request a demo</button>
          <span className="nav-separator" />
          {user ? (
            <>
              <a className="user-chip" href="#workspace"><span>{user.name.slice(0, 1).toUpperCase()}</span>{user.name}</a>
              <button className="nav-link" onClick={onLogout}><LogOut size={15} /> Log out</button>
            </>
          ) : (
            <>
              <button className="nav-login-button" onClick={() => onOpenAuth('login')}>Log in</button>
              <button className="button button--dark button--small" onClick={() => onOpenAuth('signup')}>Get Notion free</button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav">
          {['Product', 'AI', 'Resources'].map((name) => (
            <div className="mobile-nav__group" key={name}>
              <button onClick={() => setMobileSection(mobileSection === name ? null : name)}>{name}<ChevronDown size={19} className={mobileSection === name ? 'rotate' : ''} /></button>
              {mobileSection === name && <div className="mobile-nav__submenu">{menuData[name].flatMap((group) => group.items).map(([label, desc]) => <a href="#ai-work" key={label} onClick={closeMobile}><strong>{label}</strong><small>{desc}</small></a>)}</div>}
            </div>
          ))}
          {['Developers', 'Startups', 'Enterprise', 'Pricing'].map((item) => <a className="mobile-nav__direct" href="#use-cases" key={item} onClick={closeMobile}>{item}</a>)}
          <div className="mobile-nav__actions">
            <button className="button button--light" onClick={() => { onOpenDemo(); closeMobile() }}>Request a demo</button>
            {user ? <><a className="button button--outline" href="#workspace" onClick={closeMobile}>Open workspace</a><button className="button button--dark" onClick={() => { onLogout(); closeMobile() }}>Log out</button></> : <><button className="button button--outline" onClick={() => { onOpenAuth('login'); closeMobile() }}>Log in</button><button className="button button--dark" onClick={() => { onOpenAuth('signup'); closeMobile() }}>Get Notion free</button></>}
          </div>
        </div>
      )}
    </>
  )
}
