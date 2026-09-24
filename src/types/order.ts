export type OrderStatus =
  | 'placed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'

export type ScenarioId = 'normal' | 'delayed' | 'not_received' | 'preparing'

/** Ordered position of each status in the delivery timeline. */
export const STATUS_ORDER: readonly OrderStatus[] = [
  'placed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
]

export type StepId = (typeof STATUS_ORDER)[number]

export interface TimelineStep {
  id: StepId
  label: string
  description: string
  /** Where this step sits relative to the order's current status. */
  state: 'done' | 'active' | 'pending'
  timestamp?: string
}

export interface OrderItem {
  id: string
  name: string
  variant: string
  qty: number
  price: number
  emoji: string
}

export interface DeliveryEstimate {
  /** Primary date shown, e.g. "Thu, Sep 24". */
  date: string
  /** Time window or "within 24h" style note. */
  window: string
  note?: string
}

export interface DelayInfo {
  reason: string
  originalDate: string
  revisedDate: string
}

export interface DeliveryProof {
  photoPlaceholder: string
  dropOffNote: string
  deliveredAt: string
}

export interface PaymentSummary {
  method: string
  last4: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}

export interface Order {
  id: string
  customerName: string
  address: string
  carrier: string
  carrierPhone: string
  /** null when the carrier hasn't assigned a tracking number yet. */
  trackingNumber: string | null
  status: OrderStatus
  statusLabel: string
  statusMessage: string
  placedAt: string
  estimate: DeliveryEstimate
  delay?: DelayInfo
  proof?: DeliveryProof
  items: OrderItem[]
  payment: PaymentSummary
}

export interface Scenario {
  id: ScenarioId
  /** Short label shown in the demo switcher. */
  label: string
  /** ISO timestamps for timeline steps that have already happened. */
  timelineTimestamps: Partial<Record<StepId, string>>
  order: Order
}