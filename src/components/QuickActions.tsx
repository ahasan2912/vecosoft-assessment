import { Flag, MessageCircle, Phone } from 'lucide-react'
import { useOrder, useOrderStore } from '../store/orderStore'
import { cn } from '../lib/cn'

interface Action {
  id: string
  label: string
  hint: string
  icon: typeof Phone
  href?: string
  onPress?: () => void
}

export function QuickActions() {
  const order = useOrder()
  const openSheet = useOrderStore((state) => state.openSheet)
  const pushToast = useOrderStore((state) => state.pushToast)

  const actions: readonly Action[] = [
    {
      id: 'support',
      label: 'Contact Support',
      hint: 'Chat & help',
      icon: MessageCircle,
      onPress: () => openSheet('contact'),
    },
    {
      id: 'courier',
      label: 'Call Courier',
      hint: order.carrierPhone,
      icon: Phone,
      href: `tel:${order.carrierPhone.replace(/[^+\d]/g, '')}`,
      onPress: () => pushToast(`Calling ${order.carrier}…`),
    },
    {
      id: 'issue',
      label: 'Report an Issue',
      hint: 'Resolve fast',
      icon: Flag,
      onPress: () => openSheet('report'),
    },
  ]

  return (
    <section className="grid grid-cols-3 gap-2.5">
      {actions.map(({ id, label, hint, icon: Icon, href, onPress }) => {
        const content = (
          <>
            <span className="grid size-10 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition-colors duration-150 group-hover:bg-indigo-100">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="text-[13px] font-semibold leading-tight text-slate-800">
              {label}
            </span>
            <span className="text-[11px] leading-tight text-slate-400">
              {hint}
            </span>
          </>
        )
        const className = cn(
          'group flex flex-col items-center gap-1.5 rounded-2xl bg-white px-2 py-4 text-center shadow-sm shadow-slate-900/5 transition-colors duration-150 hover:bg-slate-50',
        )

        return href ? (
          <a key={id} href={href} onClick={onPress} className={className}>
            {content}
          </a>
        ) : (
          <button key={id} type="button" onClick={onPress} className={className}>
            {content}
          </button>
        )
      })}
    </section>
  )
}