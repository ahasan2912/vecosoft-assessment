import { CalendarClock, Info } from 'lucide-react'
import { useOrder } from '../store/orderStore'
import { Badge } from './ui/Badge'
import { cn } from '../lib/cn'

export function DeliveryEstimate() {
  const order = useOrder()
  const revised = order.delay?.revisedDate

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white">
          <CalendarClock aria-hidden className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-500">
              Estimated delivery
            </p>
            {revised && <Badge tone="amber">Delayed</Badge>}
          </div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-lg font-bold text-slate-900">
              {revised ?? order.estimate.date}
            </p>
            {revised && (
              <span className="text-sm font-medium text-slate-400 line-through">
                {order.delay?.originalDate}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-indigo-600">
            {order.estimate.window}
          </p>
        </div>
      </div>

      {order.estimate.note && (
        <p
          className={cn(
            'mt-4 flex items-start gap-2 border-t border-slate-100 pt-3.5 text-[13px] leading-relaxed',
            revised ? 'text-amber-700' : 'text-slate-500',
          )}
        >
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          {revised
            ? `You’ve been notified of the new date. ${order.estimate.note}`
            : order.estimate.note}
        </p>
      )}
    </section>
  )
}