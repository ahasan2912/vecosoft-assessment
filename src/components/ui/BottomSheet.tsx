import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  /** Test id for demo automation / a11y. */
  labelledBy?: string
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  labelledBy,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative flex max-h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-5">
          <div className="min-w-0">
            {title && (
              <h2
                id={labelledBy}
                className="truncate text-lg font-bold text-slate-900"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full',
              'text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600',
            )}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6 pt-4">{children}</div>
      </div>
    </div>
  )
}