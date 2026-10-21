export default function Monogram({ inverse = false, compact = false }) {
  return (
    <span className={`monogram ${inverse ? 'monogram--inverse' : ''} ${compact ? 'monogram--compact' : ''}`} aria-label="Sarah and Jesus">
      <span className="monogram__letters">S<span>&</span>J</span>
    </span>
  )
}
