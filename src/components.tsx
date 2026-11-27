import type { CSSProperties, ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...stroke} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  )
}

export function Spark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12 1.8c.4 4.9 2.4 7 7.3 7.4-4.9.4-6.9 2.5-7.3 7.4-.4-4.9-2.4-7-7.3-7.4 4.9-.4 6.9-2.5 7.3-7.4Z" />
      <path
        d="M18.6 15.4c.2 2.3 1.2 3.3 3.5 3.5-2.3.2-3.3 1.2-3.5 3.5-.2-2.3-1.2-3.3-3.5-3.5 2.3-.2 3.3-1.2 3.5-3.5Z"
        opacity=".7"
      />
    </svg>
  )
}

export function Camera(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.1-1.7a1.5 1.5 0 0 1 1.3-.7h4.6a1.5 1.5 0 0 1 1.3.7L16.7 6h1.8A2.5 2.5 0 0 1 21 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
      <circle cx="12" cy="12.4" r="3.4" />
    </svg>
  )
}

export function Layers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6 12 3Z" />
      <path d="m3.5 12 8.5 4.6 8.5-4.6" />
      <path d="m3.5 16.4 8.5 4.6 8.5-4.6" opacity=".5" />
    </svg>
  )
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3 4.8 5.8v5.6c0 4.3 2.9 7.7 7.2 9.6 4.3-1.9 7.2-5.3 7.2-9.6V5.8L12 3Z" />
      <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
    </svg>
  )
}

export function Search(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

export function Menu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  )
}

export function Close(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...stroke} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function Leaf(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...props}>
      <path d="M5 19c0-7 4.6-12.4 14-13-1 9-5.7 13.4-12 13.2" />
      <path d="M5 19c2.6-4.2 5.8-7 10-9.2" />
    </svg>
  )
}

export function Download(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  )
}

export function Gamepad(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <rect x="3" y="6.5" width="18" height="11" rx="5.5" />
      <path d="M8 10v4M6 12h4" />
      <circle cx="15.5" cy="10.8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="13.2" r=".8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
        <rect
          x="6.5"
          y="8.5"
          width="35"
          height="35"
          rx="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          opacity=".45"
        />
        <rect x="11.5" y="13.5" width="11" height="11" rx="3.6" fill="currentColor" />
        <rect x="24.5" y="13.5" width="11" height="11" rx="3.6" fill="currentColor" opacity=".5" />
        <rect x="11.5" y="26.5" width="11" height="11" rx="3.6" fill="currentColor" opacity=".5" />
        <rect x="24.5" y="26.5" width="11" height="11" rx="3.6" fill="currentColor" />
        <path d="M31.5 9.2c2.4-3.4 6.4-4.2 8.6-3.9.2 2.2-.9 6.1-4.6 8.2" fill="var(--color-gold)" />
      </svg>
      <span className="text-[21px] font-extrabold leading-none tracking-[-0.04em]">
        Gizi<span className="opacity-55">Lens</span>
      </span>
    </span>
  )
}

export function Eyebrow({
  children,
  num,
  light = false,
}: {
  children: ReactNode
  num?: string
  light?: boolean
}) {
  return (
    <p
      className={`flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] ${
        light ? 'text-cream/55' : 'text-muted'
      }`}
    >
      {num && <span className="text-gold">{num}</span>}
      <span className={`h-px w-7 ${light ? 'bg-cream/25' : 'bg-forest-900/25'}`} />
      {children}
    </p>
  )
}

type ButtonProps = {
  href?: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'gold' | 'ghost-light'
  size?: 'md' | 'sm'
  arrow?: boolean
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  'aria-haspopup'?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | boolean
  'aria-expanded'?: boolean
}

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  target,
  rel,
  type = 'button',
  className = '',
  onClick,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
}: ButtonProps) {
  const variants = {
    primary:
      'bg-forest-800 text-cream shadow-[0_16px_34px_-20px_rgba(7,46,33,.95)] hover:-translate-y-0.5 hover:bg-forest-900',
    gold: 'bg-gold text-forest-900 shadow-[0_16px_34px_-20px_rgba(214,162,62,.9)] hover:-translate-y-0.5 hover:bg-gold-light',
    ghost: 'border border-line-strong text-ink hover:border-forest-700 hover:bg-paper',
    'ghost-light': 'border border-cream/25 text-cream hover:border-cream/60 hover:bg-white/5',
  }

  const sizes = {
    md: arrow ? 'py-3.5 pl-6 pr-3.5 text-sm' : 'px-6 py-3.5 text-sm',
    sm: arrow ? 'py-2.5 pl-5 pr-2 text-[13px]' : 'px-5 py-2.5 text-[13px]',
  }

  const iconTone = variant === 'gold' ? 'bg-forest-900 text-gold' : 'bg-gold text-forest-900'
  const sharedClassName = `group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full text-center font-bold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {children}
      {arrow && (
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 ${iconTone}`}>
          <ArrowRight />
        </span>
      )}
    </>
  )

  if (href !== undefined) {
    const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel
    return (
      <a
        href={href}
        target={target}
        rel={resolvedRel}
        onClick={onClick}
        className={sharedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      className={sharedClassName}
    >
      {content}
    </button>
  )
}

export function Phone({
  src,
  alt,
  className = '',
  style,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  priority?: boolean
}) {
  return (
    <div
      className={`rounded-[2.2rem] bg-[#0a2a1e] p-[6px] shadow-[0_45px_90px_-35px_rgba(7,46,33,.55),0_14px_30px_-14px_rgba(7,46,33,.35)] ${className}`}
      style={style}
    >
      <div className="phone-screen relative overflow-hidden rounded-[1.8rem] bg-cream">
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
    </div>
  )
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={className} data-reveal style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  )
}
