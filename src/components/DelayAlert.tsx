import {
  CalendarClock,
  CircleAlert,
  MessageCircle,
  RefreshCw,
  Truck,
} from 'lucide-react'
import { useIsDelayed, useOrder, useOrderStore } from '../store/orderStore'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

export function DelayAlert() {
  const order = useOrder()
  const isDelayed = useIsDelayed()
  const pushToast = useOrderStore((state) => state.pushToast)
  const openSheet = useOrderStore((state) => state.openSheet)

  if (!isDelayed) return null

  const originalDate = order.delay?.originalDate ?? order.estimate.date
  const revisedDate = order.delay?.revisedDate ?? order.estimate.date

  return (
    <section
      className="overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 shadow-md shadow-orange-900/10"
      role="alert"
    >
      <div className="flex items-start gap-3 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-600">
          <CircleAlert aria-hidden className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-base font-bold text-orange-900">Shipment Delayed</p>
          <p className="mt-1 text-[13px] leading-relaxed text-orange-800">
            Your order is running late due to unforeseen logistics delay.
          </p>
          {order.delay?.reason && (
            <p className="mt-2 text-xs leading-relaxed text-orange-700/70">
              {order.delay.reason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-y border-orange-200/70 bg-white/60 px-5 py-3.5">
        <span className="flex-1 text-sm text-orange-800">
          New estimated delivery date
          {originalDate !== revisedDate && (
            <span className="ml-2 text-xs font-medium text-orange-400 line-through">
              {originalDate}
            </span>
          )}
        </span>
        <Badge tone="amber" className="shrink-0 text-[13px]">
          <CalendarClock aria-hidden className="size-3.5" />
          {revisedDate}
        </Badge>
        <span className="hidden items-center gap-1.5 text-xs font-semibold text-orange-600 sm:flex">
          <Truck aria-hidden className="size-4" />
          Re-checking route
        </span>
      </div>

      <div className="flex gap-2.5 p-5 pt-4">
        <Button
          variant="primary"
          size="md"
          className="flex-1 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 shadow-orange-500/30"
          onClick={() =>
            pushToast(
              'Priority update requested — a specialist will reach out shortly.',
            )
          }
        >
          <RefreshCw aria-hidden className="size-4" />
          Request Priority Update
        </Button>
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          onClick={() => openSheet('contact')}
        >
          <MessageCircle aria-hidden className="size-4" />
          Chat with Support
        </Button>
      </div>
    </section>
  )
}