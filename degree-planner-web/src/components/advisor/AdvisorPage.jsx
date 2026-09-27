export default function AdvisorPage({
  chatHistory,
  chatInput,
  chatLoading,
  onInputChange,
  onSend,
  onClear,
}) {
  return (
    <main className="mx-auto flex max-w-[900px] flex-col px-5 py-10 md:px-10 md:py-14">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">AI Advisor</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Ask anything about your plan</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="border border-line px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-ink"
        >
          Clear
        </button>
      </div>

      <div className="flex min-h-[min(68vh,720px)] flex-col border border-line bg-white">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {chatHistory.map((m, i) => (
            <div
              key={i}
              className={[
                'max-w-[85%] whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed',
                m.role === 'user' ? 'ml-auto bg-ink text-white' : 'bg-[#efefec] text-ink',
              ].join(' ')}
            >
              {m.text}
            </div>
          ))}
          {chatLoading && <div className="max-w-[85%] bg-[#efefec] px-4 py-3 text-sm">Thinking…</div>}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
          {[
            'What do I still need to graduate?',
            'Check if my CSYS path is on track.',
            'How does my D+ in CSC 3323 affect credits and GPA?',
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSend(q)}
              className="border border-line px-3 py-1.5 text-[11px] font-semibold text-mute hover:border-ink hover:text-ink"
            >
              {q.includes('D+') ? 'D+ credits & GPA?' : q.includes('CSYS') ? 'CSYS on track?' : 'What do I still need?'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 border-t border-line p-4">
          <input
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSend() }}
            placeholder="Ask your advisor…"
            className="min-w-0 flex-1 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={() => onSend()}
            disabled={chatLoading}
            className="bg-ink px-5 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}
