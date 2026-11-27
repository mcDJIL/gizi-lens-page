import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3.1 2.7-5 6-5s6 1.9 6 5" />
      <path d="M16 5.5a2.8 2.8 0 0 1 0 5.3" />
      <path d="M17.5 14.8c2.1.5 3.5 2 3.5 4.7" />
    </svg>
  )
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M4.5 20.5h15" />
      <path d="M6 20.5V5.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 16 5.5v15" />
      <path d="M16 10h2.5a1.5 1.5 0 0 1 1.5 1.5v9" />
      <path d="M9.5 8h2M9.5 12h2M9.5 16h2" />
    </svg>
  )
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M6 3.5v7a2.5 2.5 0 0 0 5 0v-7" />
      <path d="M8.5 3.5v17" />
      <path d="M16.5 3.5v17" />
      <path d="M16.5 3.5c2 0 3 2 3 5s-1 4.5-3 4.5" />
    </svg>
  )
}

export function SubscriptionIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 14.5 14.5 9.5" />
      <circle cx="9.5" cy="9.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 14h4" />
    </svg>
  )
}

export function ChartBarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M4 19.5h16" />
      <path d="M7.5 16V11M12 16V6.5M16.5 16V9" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M12 3.2 5 6v5.4c0 4.2 2.9 7.6 7 9.4 4.1-1.8 7-5.2 7-9.4V6l-7-2.8Z" />
      <path d="m9 12 2.1 2.1 4-4.2" />
    </svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9c0 .7.4 1.3 1.1 1.5H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="M6.5 16.5h11l-1.2-2V10a4.3 4.3 0 0 0-8.6 0v4.5l-1.2 2Z" />
      <path d="M10.2 18.5a1.8 1.8 0 0 0 3.6 0" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.2v3.3M16 3.2v3.3M3.5 9.5h17" />
    </svg>
  )
}

export function SchoolCapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5-9.5-4.5Z" />
      <path d="M6.5 11.5v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.5" />
      <path d="M21 10.5v5" />
    </svg>
  )
}

export function ClipboardCheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V3.5h6v1" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  )
}

export function CrownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" {...base} {...props}>
      <path d="M3.5 18h17l-1.2-9.5-4.3 3.8L12 6.5l-3 5.8-4.3-3.8L3.5 18Z" />
    </svg>
  )
}

export function WalletIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" {...base} {...props}>
      <path d="m4 16 6-6 4 4 6-6" />
      <path d="M15.5 8H20v4.5" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...base} {...props}>
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...base} {...props}>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    </svg>
  )
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4.5M12 8.2h.01" />
    </svg>
  )
}

export function DotsVerticalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="currentColor" {...props}>
      <circle cx="12" cy="5.5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="18.5" r="1.4" />
    </svg>
  )
}
