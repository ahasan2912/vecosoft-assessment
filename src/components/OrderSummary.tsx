import { useState } from 'react'
import { ChevronDown, MapPin, Package } from 'lucide-react'
import { useOrder } from '../store/orderStore'
import { cn } from '../lib/cn'
import { PaymentSummary } from './PaymentSummary'

export function OrderSummary() {
  const order = useOrder()
  const [expanded, setExpanded] = useState(false)

  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Package aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Order summary</h2>
            <p className="text-[13px] text-slate-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ·{' '}
              <span className="font-semibold text-slate-700">
                ${order.payment.total.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          {expanded ? 'Hide' : 'Details'}
          <ChevronDown
            aria-hidden
            className={cn(
              'size-4 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-0 animate-fade-in">
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3.5 py-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 text-2xl">
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.variant} · Qty {item.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2.5 border-t border-slate-100 pt-4 text-[13px] text-slate-600">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <p>
              <span className="font-semibold text-slate-800">Deliver to</span>{' '}
              — {order.address}
            </p>
          </div>

          <PaymentSummary />
        </div>
      )}
    </section>
  )
}