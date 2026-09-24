import { ScenarioSwitcher } from './components/ScenarioSwitcher'
import { StatusBanner } from './components/StatusBanner'
import { DelayAlert } from './components/DelayAlert'
import { NotReceivedPanel } from './components/NotReceivedPanel'
import { PreparingState } from './components/PreparingState'
import { DeliveryEstimate } from './components/DeliveryEstimate'
import { DeliveryTimeline } from './components/DeliveryTimeline'
import { OrderSummary } from './components/OrderSummary'
import { QuickActions } from './components/QuickActions'
import { ContactSheet } from './components/ContactSheet'
import { ReportIssueFlow } from './components/ReportIssueFlow'
import { Toasts } from './components/Toasts'

function App() {
  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <ScenarioSwitcher />

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:px-8 md:pb-16 md:pt-32">
        <header className="mb-6 hidden items-end justify-between md:flex">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Order tracking
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Track your delivery
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Use the demo switcher above to preview states
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          <div className="space-y-4 md:col-span-7 md:space-y-5">
            <DelayAlert />
            <StatusBanner />
            <PreparingState />
            <NotReceivedPanel />
            <DeliveryEstimate />
            <DeliveryTimeline />
          </div>

          <div className="space-y-4 md:sticky md:top-32 md:col-span-5 md:self-start md:space-y-5">
            <OrderSummary />
            <QuickActions />
          </div>
        </div>
      </div>

      <ContactSheet />
      <ReportIssueFlow />
      <Toasts />
    </div>
  )
}

export default App