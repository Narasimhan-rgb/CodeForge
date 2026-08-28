import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { featureTabs } from '../data/siteData'
import WorkspaceDemo from './WorkspaceDemo'

export default function AIWork() {
  const [active, setActive] = useState(0)
  const selected = featureTabs[active]

  return (
    <section className="ai-work section-shell" id="ai-work">
      <div className="section-heading">
        <span className="eyebrow">AI where your team works.</span>
        <h2>A workspace that knows the work.</h2>
      </div>

      <div className="feature-layout">
        <div className="feature-tabs" role="tablist" aria-label="AI capabilities">
          {featureTabs.map((feature, index) => (
            <button
              key={feature.eyebrow}
              className={`feature-tab feature-tab--${feature.accent} ${active === index ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={active === index}
            >
              <span>{feature.eyebrow}</span>
              <h3>{feature.title}</h3>
              <p>{feature.summary}</p>
              <i><ArrowRight size={18} /></i>
            </button>
          ))}
        </div>
        <div className={`feature-stage feature-stage--${selected.accent}`}>
          <div className="feature-stage__badge">{selected.eyebrow}</div>
          <WorkspaceDemo mode={selected.view} />
        </div>
      </div>
    </section>
  )
}
