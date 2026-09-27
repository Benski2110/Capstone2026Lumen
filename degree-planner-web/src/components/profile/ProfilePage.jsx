import { useRef } from 'react'
import { specializationPlans, STUDENT } from '../../data/constants'

export default function ProfilePage({
  specialization,
  creditsEarned,
  cgpa,
  transcripts,
  onSpecializationChange,
  onTranscriptFiles,
  onRemoveTranscript,
}) {
  const fileInputRef = useRef(null)

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-10 md:py-14">
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">Profile</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Student & transcripts</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="border border-line bg-white p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold tracking-tight">Student information</h3>
          <dl className="mt-6 space-y-3">
            {[
              ['Full name', STUDENT.name],
              ['Student ID', STUDENT.id],
              ['Program', STUDENT.program],
              ['School', STUDENT.school],
              ['University', STUDENT.university],
              ['Email', STUDENT.email],
              ['Specialization', specialization],
              ['Credits earned', creditsEarned === null ? '—' : `${creditsEarned} SCH`],
              ['CGPA', cgpa === null ? '—' : cgpa.toFixed(2)],
            ].map(([dt, dd]) => (
              <div key={dt} className="grid gap-1 border-b border-line pb-3 sm:grid-cols-[140px_1fr]">
                <dt className="text-xs text-mute">{dt}</dt>
                <dd className="m-0 text-sm font-medium">{dd}</dd>
              </div>
            ))}
          </dl>
          <label className="mt-6 block text-xs text-mute">
            Change specialization
            <select
              value={specialization}
              onChange={(e) => onSpecializationChange(e.target.value)}
              className="mt-2 block w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink"
            >
              {Object.keys(specializationPlans).map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="border border-line bg-white p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold tracking-tight">Transcripts</h3>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Upload AUI PDF transcripts here. Parsing into the degree plan comes next — files stay in this session for now.
          </p>

          <div
            className="mt-6 border border-dashed border-line bg-[#fafafa] px-4 py-10 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              onTranscriptFiles(e.dataTransfer.files)
            }}
          >
            <p className="mb-4 font-medium">Drop PDF transcripts here</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-ink"
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              hidden
              onChange={(e) => {
                onTranscriptFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {transcripts.length === 0 ? (
            <p className="mt-6 text-center text-sm text-mute">No transcripts uploaded yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {transcripts.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 border border-line p-3">
                  <div>
                    <strong className="block text-sm">{t.name}</strong>
                    <span className="text-xs text-mute">
                      {(t.size / 1024).toFixed(1)} KB · {new Date(t.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#efefec] px-2 py-1 text-[10px] font-bold uppercase text-mute">{t.status}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveTranscript(t.id)}
                      className="border border-line px-2 py-1 text-xs font-semibold hover:border-ink"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
