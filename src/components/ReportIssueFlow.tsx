import { useState } from 'react'
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  Flag,
  MapPin,
  Package,
  PackageSearch,
  Send,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useOrder, useOrderStore } from '../store/orderStore'
import { BottomSheet } from './ui/BottomSheet'
import { Button } from './ui/Button'
import { cn } from '../lib/cn'

const CATEGORIES: ReadonlyArray<{
  id: string
  label: string
  hint: string
  icon: LucideIcon
}> = [
  { id: 'not_received', label: 'Package not received', hint: 'Shows delivered but missing', icon: PackageSearch },
  { id: 'delayed', label: 'Delayed delivery', hint: 'Arriving later than expected', icon: Clock },
  { id: 'damaged', label: 'Damaged or open package', hint: 'Arrived in bad condition', icon: Package },
  { id: 'wrong_item', label: 'Wrong or missing item', hint: 'Contents don’t match', icon: Copy },
  { id: 'address', label: 'Update delivery details', hint: 'Change address or time', icon: MapPin },
  { id: 'other', label: 'Something else', hint: 'We’ll route it to the right team', icon: Flag },
]

type Step = 'category' | 'describe' | 'success'

function buildReference(orderId: string): string {
  const suffix = orderId.replace(/\D/g, '').slice(-4)
  const code = Math.floor(100 + Math.random() * 900)
  return `RF-${suffix}-${code}`
}

interface IssueWizardProps {
  orderId: string
  onClose: () => void
  notify: (message: string) => void
}

function IssueWizard({ orderId, onClose, notify }: IssueWizardProps) {
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const selected = CATEGORIES.find((item) => item.id === category)

  const title =
    step === 'success'
      ? 'Report received'
      : step === 'describe'
        ? 'Describe the issue'
        : 'Report an issue'

  const subtitle =
    step === 'success'
      ? `Reference ${referenceId}`
      : step === 'describe'
        ? selected?.label
        : 'What went wrong with this order?'

  return (
    <BottomSheet
      open
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      labelledBy="report-sheet-title"
    >
      {step === 'category' && (
        <div>
          <div className="space-y-2">
            {CATEGORIES.map(({ id, label, hint, icon: Icon }) => {
              const isSelected = category === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCategory(id)
                    setStep('describe')
                  }}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-150',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-100 bg-white hover:bg-slate-50',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-xl',
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-500',
                    )}
                  >
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-900">
                      {label}
                    </span>
                    <span className="block text-[13px] text-slate-500">
                      {hint}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-slate-400">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            We’ll use these details to investigate and get back to you within 24
            hours.
          </p>
        </div>
      )}

      {step === 'describe' && (
        <div>
          <label
            htmlFor="issue-description"
            className="text-[13px] font-semibold text-slate-700"
          >
            Tell us what happened
          </label>
          <textarea
            id="issue-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="e.g. The status says delivered but nothing was left at the door…"
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="mt-1.5 text-right text-xs text-slate-400">
            {description.length}/400
          </p>

          <div className="mt-4 flex items-center justify-between gap-2.5">
            <Button
              variant="ghost"
              onClick={() => setStep('category')}
              className="shrink-0"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Back
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              disabled={description.trim().length === 0}
              onClick={() => {
                const reference = buildReference(orderId)
                setReferenceId(reference)
                notify(`Report ${reference} submitted. We’re on it.`)
                setStep('success')
              }}
            >
              Submit report
              <Send aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CircleCheck aria-hidden className="size-9" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            We’ve received your report
          </h3>
          <p className="mt-1.5 max-w-[300px] text-sm leading-relaxed text-slate-500">
            Reference{' '}
            <span className="font-semibold text-slate-700">{referenceId}</span>.
            Our team will look into it and reply within 24 hours.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => {
              onClose()
              notify('Ticket logged — you’ll hear from us soon.')
            }}
          >
            Done
          </Button>
        </div>
      )}
    </BottomSheet>
  )
}

export function ReportIssueFlow() {
  const order = useOrder()
  const activeSheet = useOrderStore((state) => state.activeSheet)
  const closeSheet = useOrderStore((state) => state.closeSheet)
  const pushToast = useOrderStore((state) => state.pushToast)

  if (activeSheet !== 'report') return null

  return (
    <IssueWizard
      orderId={order.id}
      onClose={closeSheet}
      notify={pushToast}
    />
  )
}