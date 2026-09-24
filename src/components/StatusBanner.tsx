import {
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  ShieldAlert,
  Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { OrderStatus } from '../types/order'
import { useOrder, useOrderStore } from '../store/orderStore'
import { Badge } from './ui/Badge'
import { cn } from '../lib/cn'

interface StatusMeta {
  icon: LucideIcon
  badgeTone: 'indigo' | 'amber' | 'sky' | 'emerald' | 'slate'
  glow: string
  bar: string
}

const STATUS_META: Record<OrderStatus, StatusMeta> = {
  placed: {
    icon: Package,
    badgeTone: 'slate',
    glow: 'bg-slate-500/15 text-slate-600',
    bar: 'bg-slate-400',
  },
  processing: {
    icon: PackageOpen,
    badgeTone: 'amber',
    glow: 'bg-amber-400/20 text-amber-600',
    bar: 'bg-amber-400',
  },
  shipped: {
    icon: Truck,
    badgeTone: 'sky',
    glow: 'bg-sky-500/15 text-sky-600',
    bar: 'bg-sky-400',
  },
  out_for_delivery: {
    icon: MapPin,
    badgeTone: 'indigo',
    glow: 'bg-indigo-500/15 text-indigo-600',
    bar: 'bg-indigo-500',
  },
  delivered: {
    icon: PackageCheck,
    badgeTone: 'emerald',
    glow: 'bg-emerald-500/15 text-emerald-600',
    bar: 'bg-emerald-500',
  },
}

const TRACKING_LABEL: Record<OrderStatus, string> = {
  placed: 'Awaiting processing',
  processing: 'Tracking pending',
  shipped: 'Tracking number',
  out_for_delivery: 'Tracking number',
  delivered: 'Tracking number',
}



export function StatusBanner() {
  const order = useOrder()
  const notReceivedFlagged = useOrderStore((state) => state.notReceivedFlagged)
  const setNotReceivedFlagged = useOrderStore(
    (state) => state.setNotReceivedFlagged,
  )
  const openSheet = useOrderStore((state) => state.openSheet)

  const meta = STATUS_META[order.status]
  const Icon = meta.icon

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-900/5">
      <div className={cn('h-1.5 w-full', meta.bar)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <span
              className={cn(
                'grid size-12 shrink-0 place-items-center rounded-2xl',
                meta.glow,
              )}
            >
              <Icon aria-hidden className="size-6" />
            </span>
            <div>
              <Badge tone={meta.badgeTone}>{order.statusLabel}</Badge>
              <h1 className="mt-1.5 text-xl font-bold leading-snug text-slate-900">
                Order {order.id}
              </h1>
            </div>
          </div>

          <div className="text-right text-sm leading-5">
            <p className="font-medium text-slate-500">Placed</p>
            <p className="font-semibold text-slate-900">{order.placedAt}</p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {order.statusMessage}
        </p>

        {order.proof && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">
            <PackageCheck
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-emerald-500"
            />
            <p>
              <span className="font-semibold text-slate-800">
                Delivered {order.proof.deliveredAt}.
              </span>{' '}
              {order.proof.dropOffNote}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[13px]">
          <span className="text-slate-500">
            Carrier{' '}
            <span className="font-semibold text-slate-800">
              {order.carrier}
            </span>
          </span>
          <span className="text-slate-500">
            {TRACKING_LABEL[order.status]}{' '}
            {order.trackingNumber ? (
              <span className="font-semibold text-slate-800">
                {order.trackingNumber}
              </span>
            ) : (
              <span className="font-medium text-slate-400">
                assigning a carrier…
              </span>
            )}
          </span>
        </div>

        {order.status === 'delivered' && (
          <div className="mt-4">
            {notReceivedFlagged && (
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-600">
                <span className="size-1.5 rounded-full bg-rose-500" />
                Marked as not received — reviewing below
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setNotReceivedFlagged(true)
                openSheet('report')
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-sm shadow-rose-600/25 transition-colors hover:bg-rose-500 active:bg-rose-700"
            >
              <ShieldAlert aria-hidden className="size-4" />
              I Didn’t Receive This Package
            </button>
          </div>
        )}
      </div>
    </section>
  )
}