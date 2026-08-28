export default function LogoBar() {
  return (
    <section className="logo-bar section-shell" aria-label="Trusted companies">
      <p>Trusted by 98% of the Forbes Cloud 100</p>
      <div className="logo-row">
        {['OpenAI', 'Figma', 'VOLVO', 'ramp', 'Cursor', 'Vercel', 'Perplexity', 'Match'].map((name) => <strong key={name}>{name}</strong>)}
      </div>
    </section>
  )
}
