import { FlaskConical } from 'lucide-react'
import { scenarios } from '../data/scenarios'
import { useOrderStore } from '../store/orderStore'
import { cn } from '../lib/cn'

export function ScenarioSwitcher() {
  const activeScenario = useOrderStore((state) => state.activeScenario)
  const setScenario = useOrderStore((state) => state.setScenario)

  return (
    <div className="fixed inset-x-0 top-0 z-40 px-4 pt-3 md:px-8 md:pt-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:text-xs">
            <FlaskConical className="size-3.5 text-indigo-400" />
            Demo scenarios
          </span>
          <span className="text-[11px] text-slate-400 md:text-xs">
            switch to preview states
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-lg shadow-slate-900/5 backdrop-blur">
          {scenarios.map((scenario) => {
            const isActive = scenario.id === activeScenario
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setScenario(scenario.id)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-xl py-1.5 text-[13px] font-semibold transition-all duration-200 md:py-2 md:text-sm',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}