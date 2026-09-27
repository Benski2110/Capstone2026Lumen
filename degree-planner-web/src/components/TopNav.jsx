import { TABS } from '../data/constants'

export default function TopNav({ active, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-3 md:px-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5"
          aria-label="Lumen home"
        >
          <img src="/lumen-logo.svg" alt="" width="34" height="34" className="size-[34px] object-contain" />
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">Lumen</span>
        </button>

        <nav className="ml-auto flex items-center gap-1 overflow-x-auto md:ml-0 md:flex-1 md:justify-center" aria-label="Primary">
          {TABS.map((t) => {
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onNavigate(t.id)}
                className={[
                  'whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors',
                  isActive ? 'text-ink underline decoration-2 underline-offset-8' : 'text-mute hover:text-ink',
                ].join(' ')}
              >
                {t.label}
              </button>
            )
          })}
        </nav>

        <a
          href="https://www.aui.ma"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-[11px] font-bold uppercase tracking-[0.1em] text-ink underline-offset-4 hover:underline sm:inline"
        >
          AUI Portal
        </a>
      </div>
    </header>
  )
}
