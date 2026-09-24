# VecoSoft · Mobile Order Tracking

A self-contained, mobile-first order tracking app for e-commerce — built with
React, TypeScript, Vite, Tailwind CSS, Zustand and Lucide icons. All data is
static mock data; no backend required.

## Features

- **Delivery progress timeline** — Order Placed → Processing → Shipped → Out
  for Delivery → Delivered, with done/active/pending micro-states and timestamps.
- **Live status banner** with order id, carrier and tracking number.
- **Estimated delivery** card with contextual notes.
- **Expandable order & payment summary** — items, quantities, order id,
  delivery address and payment breakdown.
- **Quick actions** — Contact Support, Call Courier, Report an Issue (bottom
  sheet with a 3-step interactive report flow).
- **Demo scenario switcher** (top bar) to preview three edge cases:
  - **Delayed** — delay warning banner with reason, revised ETA and next steps.
  - **Missing** — "Delivered" order flagged as not received, with photo-proof
    details and recovery actions.
  - **Preparing** — no tracking number yet; animated prep state with live
    dispatch countdown and SMS/email alert opt-in.

## Run

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Structure

```
src/
  types/order.ts          data model
  data/scenarios.ts       mock scenario data
  store/orderStore.ts     Zustand store (scenario switch, sheets, toasts)
  components/
    ui/                   Button, Badge, BottomSheet primitives
    *.tsx                 feature components
```