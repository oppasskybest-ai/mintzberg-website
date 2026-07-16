// Wave transition between stacked full-bleed sections, matching the
// reference pattern from cushnir-site. `fill` should match the color of
// the section this wave sits on TOP of (the section below it visually).
export default function WaveDivider({
  fill = '#fafaf8',
  flip = false,
}: {
  fill?: string
  flip?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : undefined,
        marginTop: flip ? '-1px' : undefined,
        marginBottom: flip ? undefined : '-1px',
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        width="100%"
        height="80"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <path
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,72 1440,24 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
