import { useOrder } from '../store/orderStore'
import { cn } from '../lib/cn'

export function PaymentSummary() {
  const order = useOrder()
  const { payment } = order

  const rows = [
    { label: 'Subtotal', value: payment.subtotal },
    { label: 'Discount', value: -payment.discount },
    {
      label: 'Shipping',
      value: payment.shipping === 0 ? 0 : payment.shipping,
    },
    { label: 'Tax', value: payment.tax },
  ]

  return (
    <div className="mt-4 rounded-xl bg-slate-50 p-4">
      <div className="space-y-2 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between text-slate-600"
          >
            <span>{row.label}</span>
            <span
              className={cn(
                'font-medium',
                row.value < 0 && 'text-emerald-600',
                row.label === 'Shipping' && row.value === 0 && 'text-slate-400',
              )}
            >
              {row.label === 'Shipping' && row.value === 0
                ? 'Free'
                : `${row.value < 0 ? '−' : ''}$${Math.abs(row.value).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-sm font-semibold text-slate-900">Total</span>
        <span className="text-lg font-bold text-slate-900">
          ${payment.total.toFixed(2)}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span className="size-2 rounded-full bg-slate-300" />
        Paid with {payment.method} ending in {payment.last4}
      </p>
    </div>
  )
}