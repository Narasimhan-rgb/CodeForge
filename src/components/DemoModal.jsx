import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe2,
  LayoutGrid,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
} from 'lucide-react'
import { api } from '../lib/api'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  companySize: '',
  country: 'India',
  department: '',
  interest: '',
  timeline: '',
  message: '',
  consent: false,
}


export default function DemoModal({ onClose }) {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const validateStepOne = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Enter your first and last name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid work email.'
    if (!form.company.trim()) return 'Enter your company or organization.'
    if (!form.jobTitle.trim()) return 'Enter your role or job title.'
    if (!form.companySize) return 'Select your organization size.'
    return ''
  }

  const next = () => {
    const problem = validateStepOne()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setStep(2)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.department || !form.interest || !form.timeline) {
      setError('Choose a department, primary interest, and expected timeline.')
      return
    }
    if (!form.consent) {
      setError('Please confirm that we may contact you about this demo request.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await api('/api/demo-requests', {
        method: 'POST',
        body: JSON.stringify({
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          company: form.company.trim(),
          details: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.trim(),
            jobTitle: form.jobTitle.trim(),
            companySize: form.companySize,
            country: form.country,
            department: form.department,
            interest: form.interest,
            timeline: form.timeline,
            message: form.message.trim(),
          },
        }),
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-modal-backdrop" role="dialog" aria-modal="true" aria-label="Request a CodeForge demo" onMouseDown={onClose}>
      <div className="demo-request-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="demo-modal-close" onClick={onClose} aria-label="Close demo request"><X size={20} /></button>

        <aside className="demo-request-aside demo-request-aside--visual">
          <div className="demo-brand-mark">
            <span className="demo-brand-logo">C</span>
            <span className="demo-brand-word">CodeForge</span>
          </div>

          <div className="demo-aside-visual">
            <span className="demo-visual-orb orb-one" />
            <span className="demo-visual-orb orb-two" />
            <span className="demo-visual-orb orb-three" />

            <div className="demo-hero-badge">
              <span className="demo-status-dot" />
              Workspace Cloud
            </div>

            <div className="demo-visual-card">
              <div className="demo-visual-card__top">
                <div className="demo-window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="demo-window-pill">Live preview</span>
              </div>

              <div className="demo-visual-headline">
                <div className="demo-visual-title" />
                <div className="demo-visual-title short" />
              </div>

              <div className="demo-visual-metrics">
                <div className="demo-metric-card">
                  <div className="demo-metric-icon"><Users size={16} /></div>
                  <strong>128</strong>
                  <small>active users</small>
                </div>

                <div className="demo-metric-card">
                  <div className="demo-metric-icon"><Workflow size={16} /></div>
                  <strong>24</strong>
                  <small>live flows</small>
                </div>

                <div className="demo-metric-card">
                  <div className="demo-metric-icon"><ShieldCheck size={16} /></div>
                  <strong>99.9%</strong>
                  <small>uptime</small>
                </div>
              </div>

              <div className="demo-preview-board">
                <div className="demo-preview-sidebar">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="demo-preview-content">
                  <div className="demo-preview-row row-long" />
                  <div className="demo-preview-row row-medium" />
                  <div className="demo-preview-panels">
                    <div className="demo-mini-panel panel-blue">
                      <LayoutGrid size={16} />
                    </div>
                    <div className="demo-mini-panel panel-purple">
                      <Bot size={16} />
                    </div>
                  </div>
                  <div className="demo-preview-chart">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-floating-chip chip-top">
              <Sparkles size={14} />
              AI
            </div>

            <div className="demo-floating-chip chip-mid">
              <Search size={14} />
              Search
            </div>

            <div className="demo-floating-chip chip-bottom">
              <ShieldCheck size={14} />
              Secure
            </div>

            <div className="demo-ring-cluster">
              <span className="ring ring-a" />
              <span className="ring ring-b" />
              <span className="ring ring-c" />
            </div>
          </div>
        </aside>

        <div className="demo-request-main">
          {submitted ? (
            <div className="demo-submit-success">
              <span className="demo-success-icon"><CheckCircle2 size={34} /></span>
              <span className="eyebrow">Request received</span>
              <h3>Thanks, {form.firstName}.</h3>
              <p>Your tailored demo request has been saved successfully. A team member can now review your company, use case, and preferred timeline.</p>
              <div className="demo-success-summary">
                <div><small>Organization</small><strong>{form.company}</strong></div>
                <div><small>Primary interest</small><strong>{form.interest}</strong></div>
                <div><small>Timeline</small><strong>{form.timeline}</strong></div>
              </div>
              <button className="button button--blue" onClick={onClose}>Done</button>
              <button className="demo-text-button" onClick={() => { setForm(initialForm); setSubmitted(false); setStep(1) }}>Submit another request</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="demo-form-header">
                <div>
                  <span className="eyebrow">Request a tailored demo</span>
                  <h3>{step === 1 ? 'Tell us about you' : 'What would you like to explore?'}</h3>
                </div>
                <div className="demo-step-copy">Step {step} of 2</div>
              </div>

              <div className="demo-progress" aria-hidden="true"><span className={step === 2 ? 'is-complete' : ''} /></div>

              {step === 1 ? (
                <div className="demo-form-grid">
                  <label>First name *<input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Aarav" autoFocus /></label>
                  <label>Last name *<input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Sharma" /></label>
                  <label className="demo-field-wide">Work email *<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="aarav@company.com" /></label>
                  <label>Company / organization *<div className="input-with-icon"><Building2 size={16} /><input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Acme Technologies" /></div></label>
                  <label>Role / job title *<div className="input-with-icon"><BriefcaseBusiness size={16} /><input value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} placeholder="Product Manager" /></div></label>
                  <label>Organization size *<select value={form.companySize} onChange={(e) => update('companySize', e.target.value)}><option value="">Select size</option><option>1–20</option><option>21–100</option><option>101–500</option><option>501–1,000</option><option>1,001–5,000</option><option>5,000+</option></select></label>
                  <label>Country / region<div className="input-with-icon"><Globe2 size={16} /><select value={form.country} onChange={(e) => update('country', e.target.value)}><option>India</option><option>United States</option><option>United Kingdom</option><option>Singapore</option><option>United Arab Emirates</option><option>Germany</option><option>Netherlands</option><option>Other</option></select></div></label>
                  <label className="demo-field-wide">Phone <span className="optional-label">optional</span><input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" /></label>
                </div>
              ) : (
                <div className="demo-form-grid">
                  <label>Department / team *<select value={form.department} onChange={(e) => update('department', e.target.value)} autoFocus><option value="">Select team</option><option>Product & Engineering</option><option>IT & Security</option><option>Operations</option><option>Sales & Customer Success</option><option>HR & People</option><option>Marketing</option><option>Leadership</option><option>Education / Research</option><option>Other</option></select></label>
                  <label>Primary interest *<select value={form.interest} onChange={(e) => update('interest', e.target.value)}><option value="">Select interest</option><option>AI workspace</option><option>Knowledge management</option><option>Projects & tasks</option><option>Enterprise search</option><option>Workflow automation</option><option>Team collaboration</option><option>Security & administration</option><option>API / integrations</option></select></label>
                  <label className="demo-field-wide">When are you looking to get started? *<select value={form.timeline} onChange={(e) => update('timeline', e.target.value)}><option value="">Select timeline</option><option>Immediately</option><option>Within 30 days</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option><option>Just exploring</option></select></label>
                  <label className="demo-field-wide">What would make this demo useful for you?<textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Example: We want one place for project documentation, AI search across team knowledge, and a secure workflow for around 80 users." rows="5" /></label>
                  <label className="demo-consent demo-field-wide"><input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} /><span>I agree to be contacted about this demo request. This is a competition demo and the submission is stored only in the local CodeForge project database.</span></label>
                </div>
              )}

              {error && <div className="form-error demo-form-error">{error}</div>}

              <div className="demo-form-actions">
                {step === 2 && <button type="button" className="button button--outline" onClick={() => { setError(''); setStep(1) }}><ArrowLeft size={16} /> Back</button>}
                <div className="demo-form-actions__spacer" />
                {step === 1 ? (
                  <button type="button" className="button button--blue" onClick={next}>Continue <ArrowRight size={16} /></button>
                ) : (
                  <button type="submit" className="button button--blue" disabled={loading}>{loading ? 'Saving request…' : <>Request my demo <ArrowRight size={16} /></>}</button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
