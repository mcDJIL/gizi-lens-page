import {
  FALLBACK_TRANSACTIONS,
  REGIONAL_OVERVIEW,
  formatUserRoleLabel,
  formatUserStatusLabel,
  type RegionStat,
  type RegistrationRecord,
  type TransactionRecord,
} from '../lib/dashboardData'
import type { UserStatus } from '../lib/auth'
import {
  getApiBaseUrl,
  resolveMediaUrl,
  type ApiInspection,
  type ApiPlan,
  type ApiSummary,
} from '../lib/api'
import { NutritionalComplianceCard } from './Charts'

export type SidebarMenuId =
  | 'dashboard'
  | 'users'
  | 'sppg'
  | 'menu'
  | 'subscriptions'
  | 'transactions'
  | 'reports'
  | 'settings'

type SubViewProps = {
  section: Exclude<SidebarMenuId, 'dashboard'>
  registrations: RegistrationRecord[]
  regions?: RegionStat[]
  transactions?: TransactionRecord[]
  plans?: ApiPlan[] | null
  inspections?: ApiInspection[] | null
  summary?: ApiSummary | null
  searchQuery: string
  syncStatus: 'online' | 'fallback'
  onToggleUserStatus: (id: string, current: UserStatus) => void
  onBackOverview: () => void
}

const COMPLIANCE_BADGE: Record<string, string> = {
  SESUAI: 'bg-[#ECFDF5] text-[#059669]',
  'TIDAK SESUAI': 'bg-[#FEF2F2] text-[#DC2626]',
  'BELUM DINILAI': 'bg-[#FFFBEB] text-[#D97706]',
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatScanDate(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function SectionHeader({
  title,
  description,
  onBackOverview,
}: {
  title: string
  description: string
  onBackOverview: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2F0] pb-4">
      <div>
        <h2 className="text-[18px] font-extrabold text-[#0F2A1F]">{title}</h2>
        <p className="mt-1 text-[12.5px] text-[#6B7A72]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onBackOverview}
        className="cursor-pointer rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3.5 py-2 text-[12.5px] font-bold text-[#0F2A1F] transition hover:bg-[#EEF2F0]"
      >
        ← Kembali ke Ringkasan
      </button>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[#D8E0DC] bg-[#F8FAF9] px-4 py-10 text-center text-[12.5px] font-medium text-[#6B7A72]">
      {message}
    </div>
  )
}

function RegionGrid({ items }: { items: RegionStat[] }) {
  if (items.length === 0) {
    return <EmptyState message="Belum ada data wilayah dari API." />
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.province} className="rounded-2xl border border-[#E5EAE7] bg-[#FAFDFB] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-[#0F2A1F]">
              {item.rank}. {item.province}
            </p>
            <span className="rounded-md bg-[#E7F6EE] px-2 py-0.5 text-[11px] font-bold text-[#059669]">
              Peringkat #{item.rank}
            </span>
          </div>
          <dl className="mt-3 space-y-1.5 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-[#6B7A72]">Unit SPPG</dt>
              <dd className="font-bold text-[#0F2A1F]">{item.sppgUnits} unit</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#6B7A72]">Sekolah</dt>
              <dd className="font-bold text-[#0F2A1F]">
                {item.schools.toLocaleString('id-ID')} sekolah
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#6B7A72]">Penilaian</dt>
              <dd className="font-bold text-[#059669]">
                {item.assessments.toLocaleString('id-ID')} baki
              </dd>
            </div>
          </dl>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5EAE7]">
            <div
              className="h-full rounded-full bg-[#059669]"
              style={{ width: `${item.targetPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-right text-[11px] font-medium text-[#6B7A72]">
            {item.targetPct}% Target Volume
          </p>
        </div>
      ))}
    </div>
  )
}

function InspectionTable({ items }: { items: ApiInspection[] }) {
  if (items.length === 0) {
    return <EmptyState message="Belum ada inspeksi ompreng yang tercatat di API." />
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#EEF2F0] text-[11px] font-bold uppercase tracking-[0.04em] text-[#8A9891]">
            <th className="py-3 pr-4">Batch</th>
            <th className="py-3 pr-4">Sekolah / Unit</th>
            <th className="py-3 pr-4">Kelompok AKG</th>
            <th className="py-3 pr-4">Berat</th>
            <th className="py-3 pr-4">Tanggal Scan</th>
            <th className="py-3 text-right">Status Gizi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF2F0]">
          {items.map((item) => {
            const thumb = resolveMediaUrl(item.imageUrl)
            return (
              <tr key={item.id} className="hover:bg-[#FAFDFB]">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={`Foto ompreng ${item.batchCode}`}
                        loading="lazy"
                        className="h-9 w-9 shrink-0 rounded-lg border border-[#E5EAE7] object-cover"
                      />
                    ) : (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#E7F6EE] text-[10px] font-bold text-[#059669]">
                        MBG
                      </span>
                    )}
                    <span className="font-mono text-[11.5px] font-semibold text-[#526058]">
                      {item.batchCode}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="font-bold text-[#0F2A1F]">{item.schoolName ?? '-'}</p>
                  <p className="text-[11.5px] text-[#6B7A72]">{item.unitOperational ?? '-'}</p>
                </td>
                <td className="py-3 pr-4 text-[#526058]">{item.targetGroup ?? '-'}</td>
                <td className="py-3 pr-4 whitespace-nowrap font-semibold text-[#0F2A1F] tabular-nums">
                  {item.totalNetWeight ?? '-'}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-[#6B7A72]">
                  {formatScanDate(item.scannedAt)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      COMPLIANCE_BADGE[item.complianceStatus] ?? 'bg-[#F4F7F5] text-[#526058]'
                    }`}
                  >
                    {item.complianceStatus}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TransactionTable({ items }: { items: TransactionRecord[] }) {
  if (items.length === 0) {
    return <EmptyState message="Belum ada transaksi langganan di API." />
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#EEF2F0] text-[11px] font-bold uppercase tracking-[0.04em] text-[#8A9891]">
            <th className="py-3 pr-4">ID Pesanan</th>
            <th className="py-3 pr-4">Pelanggan</th>
            <th className="py-3 pr-4">Paket</th>
            <th className="py-3 pr-4">Nominal</th>
            <th className="py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEF2F0]">
          {items.map((trx) => (
            <tr key={trx.orderId} className="hover:bg-[#FAFDFB]">
              <td className="py-3.5 pr-4 font-mono text-[12px] font-semibold text-[#526058]">
                {trx.orderId}
              </td>
              <td className="py-3.5 pr-4">
                <p className="font-bold text-[#0F2A1F]">{trx.user}</p>
                <p className="text-[11.5px] text-[#6B7A72]">{trx.organization}</p>
              </td>
              <td className="py-3.5 pr-4 font-semibold text-[#0F2A1F]">{trx.plan}</td>
              <td className="py-3.5 pr-4 font-bold text-[#0F2A1F] tabular-nums">{trx.amount}</td>
              <td className="py-3.5 text-right">
                <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[11.5px] font-bold text-[#059669]">
                  {trx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PlanGrid({ plans }: { plans: ApiPlan[] }) {
  if (plans.length === 0) {
    return <EmptyState message="Belum ada paket langganan di API." />
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={`flex flex-col rounded-2xl border p-4 ${
            plan.isPopular ? 'border-[#A7F3D0] bg-[#F0FDF7]' : 'border-[#E5EAE7] bg-[#FAFDFB]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[15px] font-bold text-[#0F2A1F]">{plan.name}</p>
              <p className="mt-0.5 text-[11.5px] text-[#6B7A72]">{plan.tagline ?? '-'}</p>
            </div>
            {plan.badgeText && (
              <span className="shrink-0 rounded-md bg-[#073624] px-2 py-0.5 text-[10px] font-bold text-white">
                {plan.badgeText}
              </span>
            )}
          </div>

          <p className="mt-3 text-[22px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
            {formatRupiah(plan.billedPrice)}
          </p>
          <p className="text-[11.5px] text-[#6B7A72]">
            {plan.billingPeriod ?? 'Periode'} · setara{' '}
            {formatRupiah(plan.monthlyEquivalentPrice)}/bulan
          </p>

          <ul className="mt-3 flex-1 space-y-1.5 text-[12px] text-[#526058]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5">
                <span className="mt-0.5 text-[#059669]">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 border-t border-[#E5EAE7] pt-2.5 font-mono text-[10.5px] text-[#8A9891]">
            {plan.id}
          </p>
        </article>
      ))}
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="rounded-2xl border border-[#E5EAE7] bg-[#FAFDFB] p-4">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6B7A72]">
        {label}
      </p>
      <p className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[#0F2A1F] tabular-nums">
        {value === null || value === undefined ? '—' : value.toLocaleString('id-ID')}
      </p>
    </div>
  )
}

export function DashboardSubView({
  section,
  registrations,
  regions = REGIONAL_OVERVIEW,
  transactions = FALLBACK_TRANSACTIONS,
  plans = null,
  inspections = null,
  summary = null,
  searchQuery,
  syncStatus,
  onToggleUserStatus,
  onBackOverview,
}: SubViewProps) {
  const q = searchQuery.trim().toLowerCase()

  if (section === 'users') {
    const list = registrations.filter((item) => {
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      )
    })

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <SectionHeader
          title="Manajemen Pengguna"
          description="Data personel MBG dibaca dari API GiziLens (PostgreSQL). Klik status akun untuk memperbarui verifikasi."
          onBackOverview={onBackOverview}
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#EEF2F0] text-[11px] font-bold uppercase tracking-[0.04em] text-[#8A9891]">
                <th className="py-3 pr-4">Nama Pengguna</th>
                <th className="py-3 pr-4">Peran</th>
                <th className="py-3 pr-4">Institusi</th>
                <th className="py-3 pr-4">Terdaftar</th>
                <th className="py-3 text-right">Status / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F0]">
              {list.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFDFB]">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E7F6EE] text-[11.5px] font-bold text-[#059669]">
                        {row.initials}
                      </span>
                      <div>
                        <p className="font-bold text-[#0F2A1F]">
                          {row.name}{' '}
                          {row.isFirestore && (
                            <span className="ml-1.5 rounded bg-[#ECFDF5] px-1.5 py-0.5 text-[9.5px] font-bold text-[#059669]">
                              LIVE
                            </span>
                          )}
                        </p>
                        <p className="text-[11.5px] text-[#6B7A72]">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-[#334155]">
                    {formatUserRoleLabel(row.role)}
                  </td>
                  <td className="py-3.5 pr-4 text-[#526058]">{row.institution}</td>
                  <td className="py-3.5 pr-4 text-[#6B7A72]">{row.dateLabel}</td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleUserStatus(row.id, row.status)}
                      className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-bold transition ${
                        row.status === 'Verified'
                          ? 'bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]'
                          : 'bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]'
                      }`}
                    >
                      {formatUserStatusLabel(row.status)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  if (section === 'sppg') {
    const regionList = regions.filter((r) => (!q ? true : r.province.toLowerCase().includes(q)))

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <SectionHeader
          title="SPPG & Sekolah"
          description="Cakupan operasional dapur SPPG, sekolah penerima manfaat, dan intensitas inspeksi per wilayah."
          onBackOverview={onBackOverview}
        />
        <RegionGrid items={regionList} />
      </section>
    )
  }

  if (section === 'menu') {
    const filtered = (inspections ?? []).filter((item) =>
      !q
        ? true
        : item.batchCode.toLowerCase().includes(q) ||
          (item.schoolName ?? '').toLowerCase().includes(q) ||
          (item.unitOperational ?? '').toLowerCase().includes(q),
    )

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <SectionHeader
          title="Pemantauan Menu · Aktif"
          description="Inspeksi ompreng terbaru dari API GiziLens, lengkap dengan status kepatuhan gizi tiap batch."
          onBackOverview={onBackOverview}
        />
        {inspections === null ? (
          <EmptyState message="Memuat inspeksi ompreng dari API…" />
        ) : (
          <InspectionTable items={filtered} />
        )}
      </section>
    )
  }

  if (section === 'reports') {
    const filtered = (inspections ?? []).filter((item) =>
      !q
        ? true
        : item.batchCode.toLowerCase().includes(q) ||
          (item.schoolName ?? '').toLowerCase().includes(q) ||
          (item.unitOperational ?? '').toLowerCase().includes(q),
    )

    return (
      <section className="space-y-5">
        <div className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
          <SectionHeader
            title="Laporan & Analitik AKG Nasional"
            description="Rekap kepatuhan gizi dan inspeksi ompreng dari data API."
            onBackOverview={onBackOverview}
          />
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <NutritionalComplianceCard />
            </div>
            <div className="min-w-0 lg:col-span-2">
              <h3 className="text-[16px] font-bold tracking-[-0.02em] text-[#0F2A1F]">
                Inspeksi Terbaru
              </h3>
              <p className="mt-1 text-[12.5px] text-[#6B7A72]">
                Riwayat pemeriksaan ompreng per batch dan unit SPPG.
              </p>
              {inspections === null ? (
                <EmptyState message="Memuat inspeksi ompreng dari API…" />
              ) : (
                <InspectionTable items={filtered} />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (section === 'subscriptions') {
    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <SectionHeader
          title="Paket Langganan MBG"
          description="Katalog paket aktif dari API GiziLens beserta harga dan fitur yang berlaku."
          onBackOverview={onBackOverview}
        />
        {plans === null ? (
          <EmptyState message="Memuat paket langganan dari API…" />
        ) : (
          <PlanGrid plans={plans} />
        )}
      </section>
    )
  }

  if (section === 'transactions') {
    const filteredTrx = transactions.filter((t) =>
      !q
        ? true
        : t.user.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.plan.toLowerCase().includes(q),
    )

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <SectionHeader
          title="Riwayat Transaksi Langganan"
          description="Daftar pembayaran langganan dari API GiziLens beserta statusnya."
          onBackOverview={onBackOverview}
        />
        <TransactionTable items={filteredTrx} />
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
      <SectionHeader
        title="Pengaturan Data & Portal"
        description="Firebase hanya untuk autentikasi. Data aplikasi dibaca dari PostgreSQL melalui API GiziLens."
        onBackOverview={onBackOverview}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryTile label="Pengguna" value={summary?.users} />
        <SummaryTile label="Unit SPPG" value={summary?.sppgUnits} />
        <SummaryTile label="Sekolah" value={summary?.schools} />
        <SummaryTile label="Inspeksi" value={summary?.inspections} />
        <SummaryTile label="Pesanan" value={summary?.paymentOrders} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5EAE7] bg-[#F8FAF9] p-4">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6B7A72]">
            Status Koneksi API
          </p>
          <p className="mt-2 text-[16px] font-extrabold text-[#0F2A1F]">
            {syncStatus === 'online' ? 'Terhubung · PostgreSQL' : 'Mode Lokal (fallback)'}
          </p>
          <p className="mt-1 text-[12.5px] text-[#6B7A72]">
            Sumber data:{' '}
            <span className="font-mono font-semibold text-[#0F2A1F]">
              {getApiBaseUrl() || '/api (proxy)'}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5EAE7] bg-[#F8FAF9] p-4">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6B7A72]">
            Endpoint Utama
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-[#526058]">
            <li className="font-mono">GET /dashboard/kpi</li>
            <li className="font-mono">GET /dashboard/summary</li>
            <li className="font-mono">GET /users</li>
            <li className="font-mono">GET /plans</li>
            <li className="font-mono">GET /transactions</li>
            <li className="font-mono">GET /inspections</li>
          </ul>
          <p className="mt-2 text-[12px] text-[#6B7A72]">
            Dokumentasi interaktif tersedia di <span className="font-mono">/docs</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
