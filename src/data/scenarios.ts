import type { Scenario, ScenarioId } from '../types/order'

const items = [
  {
    id: 'i1',
    name: 'Sonic Boom Wireless Headphones',
    variant: 'Matte Black',
    qty: 1,
    price: 129.99,
    emoji: '🎧',
  },
  {
    id: 'i2',
    name: 'Nimbus Mechanical Keyboard',
    variant: 'RGB · Brown Switch',
    qty: 1,
    price: 89.99,
    emoji: '⌨️',
  },
  {
    id: 'i3',
    name: 'Pulse Smart Watch',
    variant: '42mm · Midnight',
    qty: 2,
    price: 199.99,
    emoji: '⌚',
  },
]

const payment = {
  method: 'Visa',
  last4: '4242',
  subtotal: 619.96,
  discount: 20.0,
  shipping: 0,
  tax: 48.0,
  total: 647.96,
}

const base = {
  customerName: 'Ayesha Rahman',
  address: 'Apt 5B, 214 Maple Street, Brooklyn, NY 11201',
  carrier: 'SwiftLogistics',
  carrierPhone: '+1 (800) 555-0142',
  placedAt: 'Sep 20, 2026 · 9:14 AM',
  items,
  payment,
}

export const scenarios: readonly Scenario[] = [
  {
    id: 'normal',
    label: 'Normal',
    timelineTimestamps: {
      placed: 'Sep 20 · 9:14 AM',
      processing: 'Sep 20 · 2:36 PM',
      shipped: 'Sep 21 · 5:02 PM',
      out_for_delivery: 'Sep 22 · 8:47 AM',
    },
    order: {
      ...base,
      id: 'VSO-1004281',
      placedAt: 'Sep 20, 2026 · 9:14 AM',
      status: 'out_for_delivery',
      statusLabel: 'Out for Delivery',
      statusMessage: 'Your courier is on the way with your package.',
trackingNumber: 'SWT-8823-9940-2211',
      estimate: {
        date: 'Fri, Sep 25',
        window: '10:30 AM – 1:30 PM',
        note: 'Live tracking available. Signature may be requested.',
      },
    },
  },
  {
    id: 'delayed',
    label: 'Delayed',
    timelineTimestamps: {
      placed: 'Sep 18 · 8:20 AM',
      processing: 'Sep 18 · 12:04 PM',
      shipped: 'Sep 19 · 4:31 PM',
    },
    order: {
      ...base,
      id: 'VSO-1004298',
      placedAt: 'Sep 18, 2026 · 8:20 AM',
      status: 'shipped',
      statusLabel: 'Shipped',
      statusMessage: 'Your package is in transit. Expected arrival has been revised.',
      trackingNumber: 'SWT-8823-9940-2277',
      estimate: {
        date: 'Fri, Sep 25',
        window: 'Before 8:00 PM',
        note: 'Revised arrival estimate. Updates will follow.',
      },
      delay: {
        reason:
          'Severe weather in your region is slowing regional sort facilities and delivery routes. We’re working with your carrier to get your package moving.',
        originalDate: 'Tue, Sep 22',
        revisedDate: 'Fri, Sep 25',
      },
    },
  },
  {
    id: 'not_received',
    label: 'Missing',
    timelineTimestamps: {
      placed: 'Sep 13 · 7:45 AM',
      processing: 'Sep 13 · 11:12 AM',
      shipped: 'Sep 14 · 9:58 AM',
      out_for_delivery: 'Sep 23 · 7:02 AM',
      delivered: 'Sep 23 · 11:42 AM',
    },
    order: {
      ...base,
      id: 'VSO-1004102',
      placedAt: 'Sep 13, 2026 · 7:45 AM',
      status: 'delivered',
      statusLabel: 'Delivered',
      statusMessage: 'Your package was marked delivered. Did you receive it?',
      trackingNumber: 'SWT-8823-9940-2204',
      estimate: {
        date: 'Wed, Sep 23',
        window: '9:00 AM – 11:00 AM',
        note: 'Package delivered per carrier records.',
      },
      proof: {
        photoPlaceholder: 'Photo proof captured by courier',
        dropOffNote: 'Left at the main lobby security desk, marked “A. Rahman”.',
        deliveredAt: 'Sep 23 · 11:42 AM',
      },
    },
  },
  {
    id: 'preparing',
    label: 'Preparing',
    timelineTimestamps: {
      placed: 'Sep 24 · 10:05 AM',
    },
    order: {
      ...base,
      id: 'VSO-1004315',
      placedAt: 'Sep 24, 2026 · 10:05 AM',
      status: 'processing',
      statusLabel: 'Preparing',
      statusMessage: 'Your order is being packed and will ship shortly.',
      trackingNumber: null,
      estimate: {
        date: 'Thu, Sep 24',
        window: 'Ships within 24 hours',
        note: 'You’ll receive a tracking number as soon as it’s assigned.',
      },
    },
  },
]

export const scenariosById = scenarios.reduce(
  (acc, scenario) => {
    acc[scenario.id] = scenario
    return acc
  },
  {} as Record<ScenarioId, Scenario>,
)