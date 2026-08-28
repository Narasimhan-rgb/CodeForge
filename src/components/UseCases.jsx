import { useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { useCases } from '../data/siteData'

export default function UseCases() {
  const [selected, setSelected] = useState(null)

  return (
    <section className="use-cases section-shell" id="use-cases">
      <div className="section-heading section-heading--row">
        <div>
          <span className="eyebrow">See what Notion can do</span>
          <h2>Turn everyday work into connected workflows.</h2>
        </div>
        <p>Open any card to see the interaction logic. On the real product these patterns connect to workspace data and integrations.</p>
      </div>

      <div className="use-case-grid">
        {useCases.map((item, index) => (
          <button className={`use-case-card use-case-card--${index + 1}`} key={item.title} onClick={() => setSelected(item)}>
            <span className="use-case-card__emoji">{item.emoji}</span>
            <span className="use-case-card__tag">{item.tag}</span>
            <strong>{item.title}</strong>
            <span className="use-case-card__bottom">Explore <ArrowUpRight size={18} /></span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="drawer-backdrop" onMouseDown={() => setSelected(null)}>
          <aside className="detail-drawer" onMouseDown={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setSelected(null)}><X /></button>
            <span className="detail-drawer__emoji">{selected.emoji}</span>
            <span className="eyebrow">{selected.tag}</span>
            <h3>{selected.title}</h3>
            <p>{selected.text}</p>
            <div className="drawer-demo">
              <div><span>1</span><b>Collect context</b><small>Pull the right project notes and updates.</small></div>
              <div><span>2</span><b>Reason over the work</b><small>Organize the information into a useful next step.</small></div>
              <div><span>3</span><b>Act</b><small>Draft, summarize, assign, or publish.</small></div>
            </div>
            <button className="button button--blue" onClick={() => setSelected(null)}>Done</button>
          </aside>
        </div>
      )}
    </section>
  )
}
