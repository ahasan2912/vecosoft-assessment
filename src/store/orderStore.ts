import { create } from 'zustand'
import { scenariosById } from '../data/scenarios'
import type { ScenarioId } from '../types/order'

export type SheetId = 'contact' | 'report'
export type AlertKind = 'sms' | 'email'

export interface Toast {
  id: number
  message: string
}

export interface OrderStore {
  activeScenario: ScenarioId
  setScenario: (id: ScenarioId) => void
  notReceivedFlagged: boolean
  setNotReceivedFlagged: (value: boolean) => void
  activeSheet: SheetId | null
  openSheet: (sheet: SheetId) => void
  closeSheet: () => void
  alertPrefs: Record<AlertKind, boolean>
  toggleAlert: (kind: AlertKind) => void
  toasts: Toast[]
  pushToast: (message: string) => void
  dismissToast: (id: number) => void
}

let toastId = 0

export const useOrderStore = create<OrderStore>()((set, get) => ({
  activeScenario: 'normal',
  setScenario: (id) =>
    set({
      activeScenario: id,
      notReceivedFlagged: id === 'not_received',
      activeSheet: null,
      toasts: [],
    }),

  notReceivedFlagged: false,
  setNotReceivedFlagged: (value) => set({ notReceivedFlagged: value }),

  activeSheet: null,
  openSheet: (sheet) => set({ activeSheet: sheet }),
  closeSheet: () => set({ activeSheet: null }),

  alertPrefs: { sms: false, email: false },
  toggleAlert: (kind) => {
    const next = { ...get().alertPrefs, [kind]: !get().alertPrefs[kind] }
    set({ alertPrefs: next })
    if (next[kind]) {
      get().pushToast(
        kind === 'sms'
          ? 'SMS alerts turned on — we’ll text you tracking updates.'
          : 'Email alerts turned on — we’ll email you tracking updates.',
      )
    }
  },

  toasts: [],
  pushToast: (message) => {
    const id = ++toastId
    set((state) => ({ toasts: [...state.toasts, { id, message }] }))
    window.setTimeout(() => {
      const { dismissToast } = get()
      dismissToast(id)
    }, 3600)
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

export function useOrder() {
  return useOrderStore((state) => scenariosById[state.activeScenario].order)
}

export function useScenario() {
  return useOrderStore((state) => scenariosById[state.activeScenario])
}

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

/**
 * Parses an estimate label like "Fri, Sep 25" into a local Date for the
 * current year. Returns null when the label isn't in the expected format.
 */
export function parseEstimateDate(label: string): Date | null {
  const match = label.match(/(?<month>[A-Z][a-z]{2})[a-z]*\s(?<day>\d{1,2})/)
  if (!match?.groups) return null
  const month = MONTH_INDEX[match.groups.month]
  const day = Number.parseInt(match.groups.day, 10)
  if (month === undefined || Number.isNaN(day)) return null
  return new Date(new Date().getFullYear(), month, day)
}

/** True when the estimate date falls before today (local start of day). */
export function isEstimateInPast(label: string): boolean {
  const estimate = parseEstimateDate(label)
  if (!estimate) return false
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return estimate.getTime() < today.getTime()
}

/**
 * Derived delay state: an order is flagged as delayed when the carrier has
 * reported a delay, or when the estimated delivery date has already passed
 * and the package hasn't been delivered yet.
 */
export function useIsDelayed(): boolean {
  const order = useOrder()
  if (order.delay) return true
  if (order.status === 'delivered') return false
  return isEstimateInPast(order.estimate.date)
}