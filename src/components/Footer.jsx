import { useMemo, useRef, useState, useEffect } from 'react'
import { ChevronDown, Globe2, Search } from 'lucide-react'
import { languages } from '../data/siteData'

const columns = [
  ['Product', ['Features', "What's New", 'Notion AI', 'Pricing', 'Request a demo', 'Download', 'Explore more →']],
  ['Resources', ['Customer stories', 'Connections', 'Marketplace', 'Help Center', 'Academy', 'Community']],
  ['Company', ['About us', 'Careers', 'Security', 'Status', 'Terms & privacy', 'Your privacy rights']],
  ['Notion for', ['Enterprise', 'Small businesses', 'Startups', 'Developers', 'Explore more →']],
]

export default function Footer() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('English (US)')
  const ref = useRef(null)
  const filtered = useMemo(() => languages.filter((item) => item.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    const close = (event) => ref.current && !ref.current.contains(event.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <footer className="footer" id="footer">
      <div className="section-shell footer__grid">
        <div className="footer__brand"><a className="brand" href="#top"><span className="brand__cube">N</span><span>Notion</span></a><p>The AI workspace that works for you.</p></div>
        {columns.map(([title, links]) => (
          <div className="footer-column" key={title}><strong>{title}</strong>{links.map((link) => <a href="#top" key={link}>{link}</a>)}</div>
        ))}
      </div>
      <div className="section-shell footer__bottom">
        <div className="language" ref={ref}>
          <button className="language__button" onClick={() => setOpen((v) => !v)}><Globe2 size={16} />{language}<ChevronDown size={14} className={open ? 'rotate' : ''} /></button>
          {open && (
            <div className="language__popover">
              <div className="language__search"><Search size={15} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" /></div>
              <div className="language__list">{filtered.map((item) => <button key={item} onClick={() => { setLanguage(item); setOpen(false); setQuery('') }} className={item === language ? 'is-selected' : ''}>{item}</button>)}</div>
            </div>
          )}
        </div>
        <div className="footer__legal"><button>Cookie settings</button><span>© 2026 Notion Labs, Inc.</span></div>
      </div>
    </footer>
  )
}
