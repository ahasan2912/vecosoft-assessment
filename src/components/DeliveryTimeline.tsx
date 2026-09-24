import {
  Boxes,
  Check,
  MapPin,
  Package,
  PackageCheck,
  Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { STATUS_ORDER } from '../types/order'
import { useOrder, useScenario } from '../store/orderStore'
import { cn } from '../lib/cn'

interface StepSpec {
  id: (typeof STATUS_ORDER)[number]
  label: string
  description: string
  icon: LucideIcon
}

const STEP_SPECS: readonly StepSpec[] = [
  { id: 'placed', label: 'Order Placed', description: 'We received your order', icon: Package },
  { id: 'processing', label: 'Processing', description: 'Packing your items', icon: Boxes },
  { id: 'shipped', label: 'Shipped', description: 'Handed to the carrier', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', description: 'Courier on the way', icon: MapPin },
  { id: 'delivered', label: 'Delivered', description: 'Package delivered', icon: PackageCheck },
]

export function DeliveryTimeline() {
  const order = useOrder()
  const scenario = useScenario()
  const currentIndex = STATUS_ORDER.indexOf(order.status)

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
      <h2 className="text-base font-bold text-slate-900">Delivery progress</h2>
      <ol className="mt-2">
        {STEP_SPECS.map((spec, index) => {
          const state =
            index < currentIndex
              ? 'done'
              : index === currentIndex
                ? 'active'
                : 'pending'
          const isLast = index === STEP_SPECS.length - 1
          const connectorActive = index < currentIndex

          return (
            <li key={spec.id} className="relative flex gap-4">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-0.5 rounded-full transition-colors duration-300',
                    connectorActive ? 'bg-emerald-500' : 'bg-slate-200',
                  )}
                />
              )}

              <div className="relative z-10 flex shrink-0 flex-col items-center pt-0.5">
                {state === 'done' ? (
                  <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/40">
                    <Check aria-hidden className="size-5" strokeWidth={3} />
                  </span>
                ) : state === 'active' ? (
                  <span className="relative grid size-10 place-items-center rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-600/40">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-indigo-500/50 animate-ping"
                    />
                    <spec.icon aria-hidden className="relative size-5" />
                  </span>
                ) : (
                  <span className="grid size-10 place-items-center rounded-full border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300">
                    <spec.icon aria-hidden className="size-5" />
                  </span>
                )}
              </div>

              <div className="flex flex-1 items-start justify-between gap-3 pb-7">
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-[15px] font-semibold',
                      state === 'pending' ? 'text-slate-400' : 'text-slate-900',
                    )}
                  >
                    {spec.label}
                  </p>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    {spec.description}
                  </p>
                </div>
                {scenario.timelineTimestamps[spec.id] && (
                  <p className="shrink-0 pt-0.5 text-right text-xs font-medium text-slate-400">
                    {scenario.timelineTimestamps[spec.id]}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}