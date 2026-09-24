import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  Mail,
  ScanLine,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { useOrder, useOrderStore } from '../store/orderStore'
import type { AlertKind } from '../store/orderStore'
import { cn } from '../lib/cn'

function useDispatchCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const remaining = Math.max(0, targetMs - now)

  return useMemo(() => {
    const totalSeconds = Math.floor(remaining / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }, [remaining])
}

const ALERT_OPTIONS: Array<{
  kind: AlertKind
  icon: typeof Smartphone
  label: string
}> = [
  { kind: 'sms', icon: Smartphone, label: 'SMS alerts' },
  { kind: 'email', icon: Mail, label: 'Email alerts' },
]

export function PreparingState() {
  const order = useOrder()
  const alertPrefs = useOrderStore((state) => state.alertPrefs)
  const toggleAlert = useOrderStore((state) => state.toggleAlert)

  // Ship window target: ~3 hours from when the view first mounted.
  const [targetMs] = useState(() => Date.now() + 3 * 60 * 60 * 1000)
  const countdown = useDispatchCountdown(targetMs)

  if (order.trackingNumber) return null

  return (
    <section className="overflow-hidden rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20">
      <div className="p-5">
        <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-indigo-300">
          <Boxes aria-hidden className="size-6" />
        </span>

        <h2 className="mt-3.5 text-xl font-bold text-white">
          Preparing your order
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">
          Your items are being packed at our fulfilment centre. We’ll hand
          them to a courier and a tracking number will appear here.
        </p>

        <div className="relative mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles aria-hidden className="size-4 text-indigo-300" />
              Assigning carrier
            </span>
            <span className="flex items-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1.5 animate-bounce rounded-full bg-indigo-300"
                  style={{ animationDelay: `${dot * 150}ms` }}
                />
              ))}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
            <div className="h-full w-1/3 animate-scan bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm text-slate-300">Estimated time to dispatch</span>
          <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-300">
            <ScanLine aria-hidden className="size-4" />
            {countdown}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 p-5">
        <p className="text-[13px] font-semibold text-white">
          Notify me when tracking is available
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {ALERT_OPTIONS.map(({ kind, icon: Icon, label }) => {
            const enabled = alertPrefs[kind]
            return (
              <button
                key={kind}
                type="button"
                onClick={() => toggleAlert(kind)}
                aria-pressed={enabled}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-150',
                  enabled
                    ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-200'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                )}
              >
                <Icon aria-hidden className="size-4" />
                {enabled ? `${label} on` : `Enable ${label}`}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          No charge. We’ll only message you about this order.
        </p>
      </div>
    </section>
  )
}