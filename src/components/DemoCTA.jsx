import { ArrowRight, CalendarCheck2, CheckCircle2, Database, ShieldCheck } from 'lucide-react'

export default function DemoCTA({ onOpenDemo }) {
  return (
    <section className="demo-cta section-shell" id="demo">
      <div className="demo-cta__copy">
        <span className="eyebrow">Bring your team together</span>
        <h2>See CodeForge built around your team’s real workflow.</h2>
        <p>Book a tailored walkthrough covering collaboration, AI assistance, workspace organization, security, and the implementation path that fits your team.</p>
        <div className="demo-inline-points">
          <span><CheckCircle2 size={16} /> Tailored to your use case</span>
          <span><CalendarCheck2 size={16} /> 20–30 minute walkthrough</span>
          <span><ShieldCheck size={16} /> Security & architecture overview</span>
          <span><Database size={16} /> Full-stack persistence demo</span>
        </div>
      </div>
      <div className="demo-form-card demo-launch-card">
        <span className="demo-launch-icon">CF</span>
        <h3>Request a personalized demo</h3>
        <p>Answer a few questions so the walkthrough can focus on your team size, department, primary use case, and rollout timeline.</p>
        <button className="button button--blue demo-launch-button" onClick={onOpenDemo}>Request a demo <ArrowRight size={16} /></button>
        <small>No payment details required. Your request is saved to the CodeForge demo database.</small>
      </div>
    </section>
  )
}
