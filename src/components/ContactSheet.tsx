import { Headphones, Mail, MessageCircle, Phone } from 'lucide-react'
import { useOrder, useOrderStore } from '../store/orderStore'
import { BottomSheet } from './ui/BottomSheet'

const FAQS = [
  {
    q: 'When will my order arrive?',
    a: 'Check the Estimated delivery card at the top of this page — it shows your current ETA.',
  },
  {
    q: 'How do I change my delivery address?',
    a: 'Tap “Report an Issue” and choose “Update delivery details”. We’ll confirm the change by text.',
  },
  {
    q: 'Where is my package right now?',
    a: 'Use the live tracking number in the order banner with your carrier’s app or site.',
  },
]

export function ContactSheet() {
  const order = useOrder()
  const activeSheet = useOrderStore((state) => state.activeSheet)
  const closeSheet = useOrderStore((state) => state.closeSheet)
  const pushToast = useOrderStore((state) => state.pushToast)

  const open = activeSheet === 'contact'

  const channels = [
    {
      id: 'call',
      label: 'Call support',
      hint: order.carrierPhone,
      icon: Phone,
      href: `tel:${order.carrierPhone.replace(/[^+\d]/g, '')}`,
      onClick: () => pushToast(`Calling support at ${order.carrierPhone}…`),
    },
    {
      id: 'chat',
      label: 'Chat with an agent',
      hint: 'Avg. response under 5 min',
      icon: MessageCircle,
      onClick: () => {
        closeSheet()
        pushToast('Connecting you to a support agent…')
      },
    },
    {
      id: 'email',
      label: 'Email us',
      hint: 'help@vecosoft.example',
      icon: Mail,
      href: 'mailto:help@vecosoft.example?subject=' + encodeURIComponent(`Order ${order.id}`),
    },
  ]

  return (
    <BottomSheet
      open={open}
      onClose={closeSheet}
      title="Contact support"
      subtitle="We’re here to help with your order."
      labelledBy="contact-sheet-title"
    >
      <div className="space-y-2.5">
        {channels.map(({ id, label, hint, icon: Icon, href, onClick }) => {
          const content = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-slate-900">
                  {label}
                </span>
                <span className="block text-[13px] text-slate-500">{hint}</span>
              </span>
              <Headphones
                aria-hidden
                className="size-4 text-slate-300"
              />
            </>
          )
          const className =
            'flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 text-left transition-colors hover:bg-slate-50'
          return href ? (
            <a key={id} href={href} onClick={onClick} className={className}>
              {content}
            </a>
          ) : (
            <button key={id} type="button" onClick={onClick} className={className}>
              {content}
            </button>
          )
        })}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Quick answers
        </p>
        <div className="mt-2.5 space-y-2">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                {faq.q}
              </summary>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}