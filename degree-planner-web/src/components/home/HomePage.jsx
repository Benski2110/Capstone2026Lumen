import { HOME_FEATURES, MARQUEE_COURSES, STUDENT } from '../../data/constants'

function Marquee() {
  const row = [...MARQUEE_COURSES, ...MARQUEE_COURSES]
  return (
    <div className="overflow-hidden border-y border-line bg-white py-3">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap px-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-mute">
        {row.map((code, i) => (
          <span key={`${code}-${i}`} className="inline-flex items-center gap-10">
            {code}
            <span className="size-1 rounded-full bg-ink/30" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border-t-2 border-ink pt-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{value}</p>
    </div>
  )
}

export default function HomePage({ onNavigate, creditsEarned, cgpa }) {
  return (
    <div className="bg-paper">
      {/* Hero — split composition */}
      <section className="mx-auto grid max-w-[1400px] min-h-[calc(100vh-58px)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-rise flex flex-col justify-end border-b border-line px-5 py-14 md:px-10 md:py-20 lg:border-r lg:border-b-0">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.16em]">
            AUI · SSE · Capstone 2026
          </p>
          <h1 className="font-display text-[clamp(3.5rem,11vw,7.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]">
            Lumen
          </h1>
          <p className="mt-5 max-w-[18ch] font-display text-[clamp(1.35rem,3vw,2.15rem)] font-semibold leading-tight tracking-tight">
            the playground for degree clarity
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mute md:text-lg">
            An AUI-first degree planner: live prerequisite checks, catalog grading rules,
            AI advising, and transcript-ready student profiles.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => onNavigate('planner')}
              className="group text-sm font-bold underline decoration-2 underline-offset-[6px]"
            >
              Open Degree Planner
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('advisor')}
              className="group text-sm font-bold underline decoration-2 underline-offset-[6px]"
            >
              Talk to Advisor
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        <aside className="relative flex flex-col justify-between bg-panel px-5 py-12 text-white md:px-10 md:py-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">Now</p>
            <p className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {STUDENT.status.split('—')[0].trim()}
            </p>
            <p className="mt-2 text-sm text-white/60">{STUDENT.name}</p>
          </div>

          <div className="mt-12 space-y-6 border-t border-white/15 pt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">Credits</p>
                <p className="font-display text-5xl font-bold tracking-tight">
                  {creditsEarned ?? '—'}
                  <span className="ml-2 text-lg font-semibold text-white/45">SCH</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">CGPA</p>
                <p className="font-display text-5xl font-bold tracking-tight">{cgpa?.toFixed(2) ?? '—'}</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              D+ and D still earn credits under AUI rules — but they do not satisfy major or
              prerequisite requirements until you retake.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-sm font-bold text-white underline decoration-white/40 underline-offset-6 hover:decoration-white"
            >
              View profile & transcripts →
            </button>
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden
          />
        </aside>
      </section>

      <Marquee />

      {/* Manifesto */}
      <section className="mx-auto grid max-w-[1400px] gap-10 border-b border-line px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute md:col-span-3">
          Manifesto
        </p>
        <div className="md:col-span-9">
          <h2 className="max-w-[18ch] font-display text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-tight">
            Stop checking PDFs by hand. Build a path that already knows AUI.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Lumen is purpose-built for Al Akhawayn — not a generic degree tool. Course
              prerequisites, retake policy, and specialization tracks are first-class.
            </p>
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Advisors stay for complex escalations. Everything routine — sequencing,
              credit math, “can I take this?” — becomes instant and visual.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-[1400px] border-b border-line px-5 py-14 md:px-10 md:py-20">
        <p className="mb-10 text-[11px] font-bold uppercase tracking-[0.16em] text-mute">At a glance</p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Program" value="BSCSC" />
          <Stat label="Minimum" value={`${STUDENT.minCredits} SCH`} />
          <Stat label="Credits earned" value={creditsEarned === null ? '—' : `${creditsEarned}`} />
          <Stat label="CGPA" value={cgpa === null ? '—' : cgpa.toFixed(2)} />
        </div>
      </section>

      {/* Feature modules — BASS “spaces” energy */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Inside Lumen</p>
            <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold tracking-tight">
              Three rooms. One degree path.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Jump into any module — your plan, advisor context, and profile stay in sync.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {HOME_FEATURES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onNavigate(f.tab)}
              className="group flex min-h-[280px] flex-col border border-line bg-white p-6 text-left transition-colors hover:border-ink hover:bg-ink hover:text-white md:p-8"
            >
              <span className="font-display text-sm font-bold text-mute transition-colors group-hover:text-white/45">
                {f.id}
              </span>
              <h3 className="mt-8 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {f.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mute transition-colors group-hover:text-white/65 md:text-base">
                {f.blurb}
              </p>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-mute transition-colors group-hover:text-white/45">
                {f.detail}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                Enter
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
          <h2 className="max-w-[14ch] font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-tight">
            Ready to map your next semester?
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('planner')}
            className="inline-flex items-center justify-center bg-ink px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80"
          >
            Launch planner
          </button>
        </div>
      </section>
    </div>
  )
}
