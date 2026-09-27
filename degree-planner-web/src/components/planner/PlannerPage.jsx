import { COURSE_CATALOG, STUDENT } from '../../data/constants'
import { needsRetakeForRequirement } from '../../lib/auiGrading'

function gradeClass(grade) {
  if (grade === 'In progress') return 'grade-in-progress'
  if (grade === 'Upcoming') return 'grade-upcoming'
  const first = grade[0]
  if (['A', 'B', 'C', 'D', 'F', 'P', 'W'].includes(first)) return `grade-${first.toLowerCase()}`
  return 'grade-upcoming'
}

export default function PlannerPage({
  semesters,
  plannerMode,
  specialization,
  creditsEarned,
  cgpa,
  retakeNeeded,
  onTogglePlannerMode,
  onAddCourse,
  onChangeGrade,
}) {
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">Degree Planner</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{STUDENT.name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#efefec] px-3 py-1.5 text-xs font-bold">
            {plannerMode ? 'New Student Mode' : STUDENT.status}
          </span>
          <button
            type="button"
            onClick={onTogglePlannerMode}
            className="border border-line px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-ink"
          >
            {plannerMode ? 'Exit New Student Mode' : 'New Student Mode'}
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 border-y border-line py-5 md:grid-cols-5">
        {[
          ['Program', 'BSCSC'],
          ['Minimum', `${STUDENT.minCredits} SCH`],
          ['Credits', creditsEarned === null ? '—' : `${creditsEarned} SCH`],
          ['CGPA', cgpa === null ? '—' : cgpa.toFixed(2)],
          ['Spec', specialization],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mute">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {semesters.map((sem) => (
          <article key={sem.term} className="border border-line bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-line bg-[#fafafa] px-4 py-3">
              <h3 className="text-sm font-bold">{sem.term}</h3>
              {plannerMode && (
                <button
                  type="button"
                  onClick={() => onAddCourse(sem.index)}
                  className="border border-line bg-white px-2 py-1 text-xs font-semibold hover:border-ink"
                >
                  + Add
                </button>
              )}
            </div>
            {!sem.courses.length && <p className="px-4 py-6 text-center text-sm text-mute">No courses</p>}
            {sem.courses.map((c) => (
              <div key={`${sem.term}-${c.code}-${c.title}`} className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
                <div>
                  <div className="text-[11px] tracking-wide text-mute">{c.code}</div>
                  <div className="text-sm">{c.title}</div>
                  {(COURSE_CATALOG[c.code]?.prereqs?.length ?? 0) > 0 && (
                    <div className="mt-1 text-[10px] text-mute">Prereq: {COURSE_CATALOG[c.code].prereqs.join(', ')}</div>
                  )}
                  {(needsRetakeForRequirement(c.grade) || (retakeNeeded.has(c.code) && c.grade === 'In progress')) && (
                    <div className="mt-1 text-[10px] font-semibold text-[#9a4a12]">Retake needed for major/prereq</div>
                  )}
                </div>
                <button
                  type="button"
                  className={`grade ${gradeClass(c.grade)}`}
                  onClick={() => onChangeGrade(sem.index, c.code, c.grade)}
                >
                  {c.grade}
                </button>
              </div>
            ))}
          </article>
        ))}
      </section>
    </main>
  )
}
