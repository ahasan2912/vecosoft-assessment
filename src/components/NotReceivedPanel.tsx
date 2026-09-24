import {
  BadgeDollarSign,
  Camera,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { useOrder, useOrderStore } from '../store/orderStore'
import { Button } from './ui/Button'

export function NotReceivedPanel() {
  const order = useOrder()
  const notReceivedFlagged = useOrderStore((state) => state.notReceivedFlagged)
  const setNotReceivedFlagged = useOrderStore(
    (state) => state.setNotReceivedFlagged,
  )
  const openSheet = useOrderStore((state) => state.openSheet)
  const pushToast = useOrderStore((state) => state.pushToast)

  if (!order.proof || !notReceivedFlagged) return null

  return (
    <section
      className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 shadow-sm"
      role="alert"
    >
      <div className="flex items-start gap-3 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600">
          <ShieldAlert aria-hidden className="size-6" />
        </span>
        <div>
          <p className="text-base font-bold text-rose-900">
            Didn’t get your package?
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-rose-700">
            It was marked delivered on{' '}
            <span className="font-semibold">{order.proof.deliveredAt}</span>.
            Here’s what the courier recorded — let’s sort this out.
          </p>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-[96px_1fr] gap-3 rounded-2xl border border-rose-100 bg-white p-3">
        <div className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
          <div>
            <Camera
              aria-hidden
              className="mx-auto size-5 text-slate-400"
            />
            <p className="mt-1 px-1 text-[10px] font-medium leading-tight text-slate-400">
              Photo proof
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-800">Drop-off note</p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
            {order.proof.dropOffNote}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-5 pt-4">
        <Button
          variant="outline"
          size="md"
          onClick={() =>
            pushToast(
              'We sent you a checklist for checking with neighbours and building security.',
            )
          }
        >
          <Users aria-hidden className="size-4" />
          Check around
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => openSheet('report')}
        >
          <ShieldAlert aria-hidden className="size-4" />
          Report missing
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="col-span-2"
          onClick={() =>
            pushToast('Refund ticket RF-329-8841 created. Priority follow-up in 24h.')
          }
        >
          <BadgeDollarSign aria-hidden className="size-4" />
          Instant refund / support ticket
        </Button>
      </div>

      <div className="border-t border-rose-100 bg-rose-50 px-5 py-3">
        <button
          type="button"
          onClick={() => setNotReceivedFlagged(false)}
          className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700"
        >
          Actually, I found the package — mark as resolved
        </button>
      </div>
    </section>
  )
}