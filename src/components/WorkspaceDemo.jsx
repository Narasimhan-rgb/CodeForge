import { Bot, Check, FileText, Search, Sparkles, WandSparkles } from 'lucide-react'

export default function WorkspaceDemo({ mode = 'capture', compact = false }) {
  const content = {
    capture: {
      title: 'Launch plan',
      emoji: '🚀',
      status: 'In progress',
      heading: 'Project knowledge',
      ai: 'Summarize this project',
    },
    search: {
      title: 'Enterprise Search',
      emoji: '🔎',
      status: 'Answer found',
      heading: 'What changed in the launch plan?',
      ai: '3 cited sources',
    },
    automate: {
      title: 'Weekly reporting agent',
      emoji: '✨',
      status: 'Running',
      heading: 'Collect updates and publish summary',
      ai: 'Agent completed 7 steps',
    },
  }[mode]

  return (
    <div className={`workspace ${compact ? 'workspace--compact' : ''}`}>
      <div className="workspace__chrome">
        <div className="window-dots"><i /><i /><i /></div>
        <div className="workspace__title"><span className="brand__cube brand__cube--mini">N</span>{content.title}</div>
        <div className="workspace__avatars"><span>A</span><span>M</span><span>+</span></div>
      </div>
      <div className="workspace__body">
        <aside className="workspace__sidebar">
          <div className="sidebar-profile"><span>ND</span><b>Workspace</b></div>
          <div className="sidebar-row"><Search size={14} /> Search</div>
          <div className="sidebar-row sidebar-row--active"><FileText size={14} /> Home</div>
          <div className="sidebar-row"><Sparkles size={14} /> Notion AI</div>
          <div className="sidebar-line" />
          <div className="sidebar-row">📄 Product</div>
          <div className="sidebar-row">📋 Projects</div>
          <div className="sidebar-row">🎯 Goals</div>
        </aside>
        <section className="workspace__doc">
          <span className="doc-emoji">{content.emoji}</span>
          <h3>{content.heading}</h3>
          <div className="doc-meta"><span>Owner</span><b>You</b><span className="doc-status">{content.status}</span></div>
          <div className="doc-line doc-line--wide" />
          <div className="doc-line" />
          {mode === 'search' ? (
            <div className="search-result">
              <div className="search-result__head"><Search size={17} /><strong>Answer</strong></div>
              <p>The launch moved to Friday after design review. The final checklist is owned by Product Ops.</p>
              <div className="citation-row"><span>1</span> Launch plan</div>
              <div className="citation-row"><span>2</span> Product meeting notes</div>
              <div className="citation-row"><span>3</span> Slack — #launch</div>
            </div>
          ) : mode === 'automate' ? (
            <div className="agent-flow">
              {['Read project updates', 'Find blockers', 'Draft weekly summary', 'Publish to team home'].map((item, index) => (
                <div className="agent-step" key={item}><span>{index < 3 ? <Check size={13} /> : <WandSparkles size={13} />}</span>{item}</div>
              ))}
            </div>
          ) : (
            <div className="task-card">
              <div className="task-card__title"><Check size={16} /> Launch checklist</div>
              {['Finalize launch copy', 'QA product tour', 'Publish release notes'].map((item, i) => (
                <div className="task-item" key={item}><span className={i === 1 ? 'task-check task-check--done' : 'task-check'}>{i === 1 ? '✓' : ''}</span>{item}</div>
              ))}
            </div>
          )}
          <div className="ai-command"><Bot size={17} /><span>{content.ai}</span><kbd>↵</kbd></div>
        </section>
      </div>
    </div>
  )
}
