"use client"

import { CalendarCheck2, CheckCircle2, Clock, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMyAttendance } from "@/features/attendance/hooks/use-my-attendance"
import { STATUS_BADGE, formatDateTime } from "@/features/attendance/constants"

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: "emerald" | "amber" | "red" | "slate"
}) {
  const toneClass = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    slate: "text-slate-300",
  }[tone]
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
        <span className={toneClass}>{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

export function MyAttendanceView() {
  const { t } = useLanguage()
  const { data, isLoading, error, refresh } = useMyAttendance()

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-armath-blue" />
            {t("attendanceMyTitle")}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t("attendanceMySubtitle")}</p>
        </div>
        <button
          onClick={() => void refresh()}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white transition"
          aria-label={t("attendanceRefresh")}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label={t("attendanceStatusPresent")}
          value={data?.summary.present ?? 0}
          tone="emerald"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label={t("attendanceStatusLate")}
          value={data?.summary.late ?? 0}
          tone="amber"
        />
        <StatCard
          icon={<XCircle className="w-4 h-4" />}
          label={t("attendanceStatusAbsent")}
          value={data?.summary.absent ?? 0}
          tone="red"
        />
        <StatCard
          icon={<CalendarCheck2 className="w-4 h-4" />}
          label={t("attendanceTotalSessions")}
          value={data?.summary.total ?? 0}
          tone="slate"
        />
      </div>

      <section className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
        <header className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-white font-semibold">{t("attendanceMyLedger")}</h2>
        </header>
        {data && data.ledger.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">{t("attendanceColScheduled")}</th>
                <th className="px-5 py-3 text-left">{t("attendanceColSubject")}</th>
                <th className="px-5 py-3 text-left">{t("attendanceColGroup")}</th>
                <th className="px-5 py-3 text-left">{t("attendanceColStatus")}</th>
                <th className="px-5 py-3 text-left">{t("attendanceColEntered")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {data.ledger.map((row, index) => (
                <tr key={`${row.session_id}-${index}`}>
                  <td className="px-5 py-3 text-slate-300">{formatDateTime(row.scheduled_at)}</td>
                  <td className="px-5 py-3 text-white">{row.subject}</td>
                  <td className="px-5 py-3 text-slate-300">{row.group_code}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_BADGE[row.status]}`}>
                      {row.status[0].toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{formatDateTime(row.entered_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 py-8 text-center">{t("attendanceNoLedgerYet")}</p>
        )}
      </section>

      <section className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
        <header className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-white font-semibold">{t("attendanceMyEntries")}</h2>
        </header>
        {data && data.logs.length > 0 ? (
          <ul className="divide-y divide-slate-700/40">
            {data.logs.map((log) => (
              <li key={log.id} className="px-5 py-3 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{formatDateTime(log.entered_at)}</p>
                  <p className="text-xs text-slate-400">
                    {log.auth_method.toUpperCase()} · {log.device_id}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 py-8 text-center">{t("attendanceNoEntriesYet")}</p>
        )}
      </section>
    </div>
  )
}
