import {
  FALLBACK_TRANSACTIONS,
  REGIONAL_OVERVIEW,
  formatUserRoleLabel,
  formatUserStatusLabel,
  type RegistrationRecord,
} from '../lib/dashboardData'
import type { UserStatus } from '../lib/auth'

export type SidebarMenuId =
  | 'dashboard'
  | 'users'
  | 'sppg'
  | 'menu'
  | 'subscriptions'
  | 'transactions'
  | 'reports'
  | 'admins'
  | 'settings'

type SubViewProps = {
  section: Exclude<SidebarMenuId, 'dashboard'>
  registrations: RegistrationRecord[]
  searchQuery: string
  firestoreStatus: 'online' | 'fallback'
  seeding: boolean
  seedNotice: string | null
  onToggleUserStatus: (id: string, current: UserStatus) => void
  onSeedFirestore: () => void
  onBackOverview: () => void
}

export function DashboardSubView({
  section,
  registrations,
  searchQuery,
  firestoreStatus,
  seeding,
  seedNotice,
  onToggleUserStatus,
  onSeedFirestore,
  onBackOverview,
}: SubViewProps) {
  const q = searchQuery.trim().toLowerCase()

  if (section === 'users' || section === 'admins') {
    const list = registrations.filter((item) => {
      if (
        section === 'admins' &&
        item.role !== 'BGN National Admin' &&
        item.role !== 'admin' &&
        item.role !== 'Ahli Gizi'
      ) {
        return false
      }
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2F0] pb-4">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#0F2A1F]">
              {section === 'admins'
                ? 'Tata Kelola Admin & Verifikator'
                : 'Manajemen Pengguna (Live Firestore)'}
            </h2>
            <p className="mt-1 text-[12.5px] text-[#6B7A72]">
              Kelola personel MBG terdaftar. Klik status pada akun Firestore untuk memperbarui
              verifikasi langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackOverview}
            className="cursor-pointer rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3.5 py-2 text-[12.5px] font-bold text-[#0F2A1F] transition hover:bg-[#EEF2F0]"
          >
            ← Kembali ke Ringkasan
          </button>
        </div>

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

  if (section === 'sppg' || section === 'menu' || section === 'reports') {
    const regions = REGIONAL_OVERVIEW.filter((r) =>
      !q ? true : r.province.toLowerCase().includes(q),
    )

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2F0] pb-4">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#0F2A1F]">
              {section === 'sppg'
                ? 'Manajemen SPPG & Sekolah'
                : section === 'menu'
                  ? 'Pemantauan Menu · Aktif'
                  : 'Laporan & Analitik AKG Nasional'}
            </h2>
            <p className="mt-1 text-[12.5px] text-[#6B7A72]">
              Cakupan operasional dapur SPPG, sekolah penerima manfaat, dan kepatuhan lima pilar
              gizi MBG.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackOverview}
            className="cursor-pointer rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3.5 py-2 text-[12.5px] font-bold text-[#0F2A1F] transition hover:bg-[#EEF2F0]"
          >
            ← Kembali ke Ringkasan
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((item) => (
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
      </section>
    )
  }

  if (section === 'subscriptions' || section === 'transactions') {
    const filteredTrx = FALLBACK_TRANSACTIONS.filter((t) =>
      !q
        ? true
        : t.user.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.plan.toLowerCase().includes(q),
    )

    return (
      <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2F0] pb-4">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#0F2A1F]">
              {section === 'subscriptions' ? 'Langganan Aktif MBG' : 'Riwayat Transaksi Langganan'}
            </h2>
            <p className="mt-1 text-[12.5px] text-[#6B7A72]">
              Daftar paket berlangganan dan penyelesaian pembayaran unit SPPG &amp; sekolah.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackOverview}
            className="cursor-pointer rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3.5 py-2 text-[12.5px] font-bold text-[#0F2A1F] transition hover:bg-[#EEF2F0]"
          >
            ← Kembali ke Ringkasan
          </button>
        </div>

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
              {filteredTrx.map((trx) => (
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
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-[#E5EAE7] bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2F0] pb-4">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#0F2A1F]">
            Pengaturan Firebase &amp; Portal
          </h2>
          <p className="mt-1 text-[12.5px] text-[#6B7A72]">
            Integrasi aktif ke proyek Firebase <span className="font-bold">gizilens-32aa6</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackOverview}
          className="cursor-pointer rounded-xl border border-[#E5EAE7] bg-[#F8FAF9] px-3.5 py-2 text-[12.5px] font-bold text-[#0F2A1F] transition hover:bg-[#EEF2F0]"
        >
          ← Kembali ke Ringkasan
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5EAE7] bg-[#F8FAF9] p-4">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6B7A72]">
            Status Koneksi Firestore
          </p>
          <p className="mt-2 text-[16px] font-extrabold text-[#0F2A1F]">
            {firestoreStatus === 'online' ? 'Terhubung · Sinkronisasi Real-time' : 'Mode Lokal'}
          </p>
          <p className="mt-1 text-[12.5px] text-[#6B7A72]">
            ID Proyek: <span className="font-mono font-semibold text-[#0F2A1F]">gizilens-32aa6</span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5EAE7] bg-[#F8FAF9] p-4">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#6B7A72]">
            Sinkronisasi Data Contoh
          </p>
          <p className="mt-1 text-[12.5px] text-[#6B7A72]">
            Simpan contoh transaksi awal ke koleksi <span className="font-mono">transactions</span> di
            Firestore.
          </p>
          <button
            type="button"
            disabled={seeding}
            onClick={onSeedFirestore}
            className="mt-3 cursor-pointer rounded-xl bg-[#073624] px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#05291B] disabled:opacity-60"
          >
            {seeding ? 'Menyinkronkan...' : 'Simpan Data Contoh ke Firestore'}
          </button>
          {seedNotice && <p className="mt-2 text-[12px] font-medium text-[#059669]">{seedNotice}</p>}
        </div>
      </div>
    </section>
  )
}
