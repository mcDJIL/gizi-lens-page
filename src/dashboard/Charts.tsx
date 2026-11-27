import { useState } from 'react'
import { ACTIVITY_BY_GRANULARITY, type ActivityGranularity } from '../lib/dashboardData'
import { DotsVerticalIcon, InfoCircleIcon, TrendUpIcon } from './DashboardIcons'

function buildSmoothPath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) return ''
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`

  let path = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i]
    const p1 = coords[i + 1]
    const midX = (p0.x + p1.x) / 2
    path += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return path
}

export function PlatformActivityCard({ onViewReport }: { onViewReport: () => void }) {
  const [granularity, setGranularity] = useState<ActivityGranularity>('Weekly')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const dataset = ACTIVITY_BY_GRANULARITY[granularity]
  const width = 680
  const height = 220
  const padLeft = 42
  const padRight = 24
  const padTop = 28
  const padBottom = 34
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom
  const maxY = 95000

  const points = dataset.points.map((item, idx) => {
    const x = padLeft + (idx / Math.max(dataset.points.length - 1, 1)) * plotW
    const y = padTop + plotH - (item.evaluated / maxY) * plotH
    const prevY = padTop + plotH - (item.previous / maxY) * plotH
    return { ...item, x, y, prevY }
  })

  const linePath = buildSmoothPath(points.map((p) => ({ x: p.x, y: p.y })))
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`
  const activeIdx = hoveredIndex ?? points.length - 1
  const activePoint = points[activeIdx]

  const yTicks = [
    { label: '90k', value: 90000 },
    { label: '60k', value: 60000 },
    { label: '30k', value: 30000 },
    { label: '0k', value: 0 },
  ]

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
                Platform Activity
              </h3>
              <span className="rounded-md bg-[#E7F6EE] px-2 py-0.5 text-[11px] font-bold text-[#059669]">
                Baki MBG
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-[#6B7A72]">
              Aggregated national nutrition assessments completed across all registered SPPGs.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-[#E5EAE7] bg-[#F7F9F8] p-1">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => {
              const active = granularity === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setGranularity(tab)
                    setHoveredIndex(null)
                  }}
                  className={`cursor-pointer rounded-lg px-3 py-1 text-[12px] font-semibold transition ${
                    active
                      ? 'bg-white text-[#0F2A1F] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-[#6B7A72] hover:text-[#0F2A1F]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <div>
              <p className="text-[12px] font-medium text-[#6B7A72]">{dataset.subtitle}</p>
              <p className="mt-0.5 text-[24px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
                {dataset.total}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#059669]">
              <TrendUpIcon />
              {dataset.trend}
            </span>
          </div>

          <div className="flex items-center gap-5 text-[12px] font-medium text-[#526058]">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
              Evaluated Menus
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
              Previous Average
            </span>
          </div>
        </div>

        <div className="mt-3 w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full select-none overflow-visible"
            role="img"
            aria-label="Platform activity nutrition assessments line chart"
          >
            <defs>
              <linearGradient id="activityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => {
              const y = padTop + plotH - (tick.value / maxY) * plotH
              return (
                <g key={tick.label}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#EEF2F0"
                    strokeDasharray={tick.value === 0 ? undefined : '4 4'}
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10.5"
                    fill="#94A39B"
                    fontWeight="500"
                  >
                    {tick.label}
                  </text>
                </g>
              )
            })}

            <path d={areaPath} fill="url(#activityAreaGrad)" />
            <path d={linePath} fill="none" stroke="#059669" strokeWidth="2.5" />

            {points.map((point, idx) => {
              const isSelected = idx === activeIdx
              return (
                <g
                  key={point.label}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <circle cx={point.x} cy={point.prevY} r="3.5" fill="#FFFFFF" stroke="#94A39B" strokeWidth="1.5" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isSelected ? 5.5 : 4}
                    fill={isSelected ? '#059669' : '#FFFFFF'}
                    stroke={isSelected ? '#FFFFFF' : '#059669'}
                    strokeWidth="2.2"
                  />
                  <rect x={point.x - 24} y={padTop} width="48" height={plotH + 16} fill="transparent" />
                  <text
                    x={point.x}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#0F2A1F' : '#8A9891'}
                  >
                    {point.label}
                  </text>
                </g>
              )
            })}

            {activePoint && (
              <g
                transform={`translate(${Math.min(Math.max(activePoint.x - 42, padLeft), width - 110)}, ${Math.max(activePoint.y - 34, 4)})`}
              >
                <rect width="88" height="24" rx="6" fill="#073624" />
                <text
                  x="44"
                  y="15.5"
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  {hoveredIndex === null
                    ? dataset.highlightLabel
                    : `${activePoint.evaluated.toLocaleString('en-US')}`}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#F7F9F8] px-4 py-3 text-[12px] sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[#526058]">
          <InfoCircleIcon className="mt-0.5 shrink-0 text-[#8A9891]" />
          <span>
            Data aggregated at batch and school menu levels. Individual ompreng scans are
            consolidated into 1,240 verified meal menus.
          </span>
        </p>
        <button
          type="button"
          onClick={onViewReport}
          className="shrink-0 cursor-pointer text-left font-bold text-[#059669] transition hover:text-[#047857]"
        >
          View Detailed Report →
        </button>
      </div>
    </section>
  )
}

const COMPLIANCE_SEGMENTS = [
  {
    label: 'Meets Target (AKG)',
    subtitle: 'Calorie & Macro compliant',
    pct: 72,
    count: '229,284 baki',
    color: '#10B981',
  },
  {
    label: 'Needs Nutritionist Review',
    subtitle: 'Minor portion variance',
    pct: 18,
    count: '57,321 baki',
    color: '#F59E0B',
  },
  {
    label: 'Below Standard',
    subtitle: 'Requires reformulation',
    pct: 10,
    count: '31,845 baki',
    color: '#EF4444',
  },
]

const COMPLIANCE_ARCS = COMPLIANCE_SEGMENTS.reduce<
  Array<(typeof COMPLIANCE_SEGMENTS)[number] & { offsetPct: number }>
>((acc, seg) => {
  const prev = acc[acc.length - 1]
  const offsetPct = prev ? prev.offsetPct + prev.pct : 0
  acc.push({ ...seg, offsetPct })
  return acc
}, [])

export function NutritionalComplianceCard() {
  const radius = 58
  const circumference = 2 * Math.PI * radius

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-[#E5EAE7] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,31,0.03)] sm:p-6">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
              Nutritional Compliance
            </h3>
            <p className="mt-0.5 text-[12px] text-[#6B7A72]">AKG Standard Target Distribution</p>
          </div>
          <button
            type="button"
            aria-label="Compliance options"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#8A9891] transition hover:bg-[#F4F7F5] hover:text-[#0F2A1F]"
          >
            <DotsVerticalIcon />
          </button>
        </div>

        <div className="my-6 flex justify-center">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#EEF2F0"
                strokeWidth="18"
              />
              {COMPLIANCE_ARCS.map((seg) => {
                const dashLen = (seg.pct / 100) * circumference
                const dashOffset = -((seg.offsetPct / 100) * circumference)
                return (
                  <circle
                    key={seg.label}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={`${dashLen} ${circumference}`}
                    strokeDashoffset={dashOffset}
                  />
                )
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[22px] font-extrabold tracking-[-0.03em] text-[#0F2A1F]">
                318.4k
              </span>
              <span className="text-[11px] font-medium text-[#6B7A72]">Assessments</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {COMPLIANCE_SEGMENTS.map((seg) => (
            <div
              key={seg.label}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAF9] px-3.5 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <div>
                  <p className="text-[12.5px] font-bold text-[#0F2A1F]">{seg.label}</p>
                  <p className="text-[11px] text-[#6B7A72]">{seg.subtitle}</p>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <p className="text-[12.5px] font-extrabold text-[#0F2A1F]">{seg.pct}%</p>
                <p className="text-[11px] text-[#6B7A72]">{seg.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#8A9891]">
        Evaluated according to Permenkes &amp; BGN Standards
      </p>
    </section>
  )
}
