import { CheckCircle2 } from 'lucide-react'
import { useOrderStore } from '../store/orderStore'

export function Toasts() {
  const toasts = useOrderStore((state) => state.toasts)
  const dismissToast = useOrderStore((state) => state.dismissToast)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className="pointer-events-auto flex max-w-[400px] items-center gap-2.5 rounded-2xl bg-slate-900 py-3 pl-3.5 pr-4 text-left text-sm font-medium text-white shadow-lg shadow-slate-900/20 animate-toast-in"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  )
}