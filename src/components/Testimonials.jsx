import { useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { testimonials } from '../data/siteData'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const item = testimonials[index]
  const previous = () => setIndex((index - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((index + 1) % testimonials.length)

  return (
    <section className="testimonials section-shell">
      <div className="section-heading">
        <span className="eyebrow">Trusted by teams that ship.</span>
        <h2>Built for fast-moving teams.</h2>
      </div>
      <div className="testimonial-card">
        <Quote size={40} strokeWidth={1.3} />
        <blockquote>{item.quote}</blockquote>
        <div className="testimonial-card__footer">
          <div>
            <strong>{item.name}</strong>
            <span>{item.role} · {item.company}</span>
          </div>
          <div className="slider-controls">
            <button onClick={previous} aria-label="Previous testimonial"><ArrowLeft /></button>
            <span>{index + 1} / {testimonials.length}</span>
            <button onClick={next} aria-label="Next testimonial"><ArrowRight /></button>
          </div>
        </div>
      </div>
      <div className="quote-strip"><p>“We shape our tools, and thereafter our tools shape us.”</p><span>Marshall McLuhan</span></div>
    </section>
  )
}
