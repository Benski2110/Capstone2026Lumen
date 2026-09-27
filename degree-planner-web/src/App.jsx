import { useMemo, useState } from 'react'
import TopNav from './components/TopNav'
import HomePage from './components/home/HomePage'
import PlannerPage from './components/planner/PlannerPage'
import AdvisorPage from './components/advisor/AdvisorPage'
import ProfilePage from './components/profile/ProfilePage'
import Modal from './components/ui/Modal'
import {
  COURSE_CATALOG,
  EARLIEST,
  GRADES,
  seedPlan,
  specializationPlans,
  STUDENT,
  toRows,
} from './data/constants'
import { computeCreditsAndGpa, getSatisfiedCodesBefore } from './lib/auiGrading'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const WELCOME = "Hi — I'm Lumen's AUI advisor. Ask about prerequisites, retakes, CGPA, or what you still need to graduate."

export default function App() {
  const [tab, setTab] = useState('home')
  const [plannerMode, setPlannerMode] = useState(false)
  const [specialization, setSpecialization] = useState('CSYS')
  const [specializationOpen, setSpecializationOpen] = useState(false)
  const [semesters, setSemesters] = useState(() => toRows(seedPlan))
  const [gradeModal, setGradeModal] = useState(null)
  const [addModal, setAddModal] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', text: WELCOME }])
  const [transcripts, setTranscripts] = useState([])

  const academicSummary = useMemo(() => {
    if (plannerMode) return null
    const attempts = semesters.flatMap((s) => s.courses.map((c) => ({ code: c.code, grade: c.grade })))
    return computeCreditsAndGpa(attempts, COURSE_CATALOG)
  }, [plannerMode, semesters])

  const creditsEarned = academicSummary?.creditsEarned ?? null
  const cgpa = academicSummary?.gpa ?? null
  const retakeNeeded = useMemo(() => new Set(academicSummary?.needsRetake ?? []), [academicSummary])
  const courseCodes = Object.keys(COURSE_CATALOG).sort()

  const togglePlannerMode = () => {
    if (!plannerMode) {
      setSemesters(toRows(seedPlan).map((s) => ({ ...s, courses: [] })))
      setSpecializationOpen(true)
    } else {
      setSemesters(toRows(seedPlan))
    }
    setPlannerMode(!plannerMode)
  }

  const updateGrade = (termIdx, code, nextGrade) => {
    setSemesters((prev) => prev.map((s, idx) => (idx !== termIdx ? s : {
      ...s,
      courses: s.courses.map((c) => (c.code === code ? { ...c, grade: nextGrade } : c)),
    })))
    setGradeModal(null)
  }

  const validateCoursePlacement = (termIdx, code) => {
    if (!COURSE_CATALOG[code]) return 'Course is not in the catalog list.'
    const missing = (COURSE_CATALOG[code].prereqs || []).filter((p) => !getSatisfiedCodesBefore(semesters, termIdx).has(p))
    if (missing.length) return `Missing prerequisites: ${missing.join(', ')}`
    const earliest = EARLIEST[code]
    if (typeof earliest === 'number' && termIdx < earliest) {
      return `Too early. Earliest semester: ${semesters[earliest]?.term || `Term ${earliest + 1}`}`
    }
    if (code.startsWith('SPECIALIZATION ')) {
      const slot = Number(code.split(' ')[1])
      const requiredIdx = slot === 1 ? 10 : slot === 2 ? 12 : 13
      if (termIdx !== requiredIdx) return 'Specialization slots must be in Spring 2026, Fall 2026, Spring 2027.'
    }
    return null
  }

  const addCourse = () => {
    if (!addModal?.code) return
    const code = addModal.code.toUpperCase()
    const err = validateCoursePlacement(addModal.termIdx, code)
    if (err) {
      setAddModal((m) => ({ ...m, error: err }))
      return
    }
    const title = addModal.title?.trim() || COURSE_CATALOG[code].title
    setSemesters((prev) => prev.map((s, idx) => (idx !== addModal.termIdx ? s : {
      ...s,
      courses: [...s.courses, { code, title, grade: 'Upcoming' }],
    })))
    setAddModal(null)
  }

  const advisorContext = useMemo(() => {
    const rows = semesters.map((s) => ({
      term: s.term,
      courses: s.courses.map((c) => `${c.code} ${c.title} (${c.grade})`),
    }))
    return `You are Lumen, an AUI degree advisor for a BSCSC student.
Student: ${STUDENT.name} (ID ${STUDENT.id}).
Specialization: ${specialization}.
Minimum degree requirements: ${STUDENT.minCredits} SCH.
Credits earned (AUI: retakes counted once; D+/D still earn SCH): ${creditsEarned ?? 0} SCH.
CGPA (highest grade on retakes; F dropped after successful repeat): ${cgpa ?? 'N/A'}.
Courses still needing retake for major/prereq (D+/D/F without C- yet): ${(academicSummary?.needsRetake ?? []).join(', ') || 'none'}.
Current plan by semester:
${rows.map((r) => `${r.term}: ${r.courses.join(', ') || 'No courses'}`).join('\n')}

Rules:
- Be concise and practical.
- AUI: C- is lowest passing for major/core/prereqs. D+/D earn credits but do NOT satisfy major/core/FAS/prereqs — student must retake.
- If prerequisites are relevant, mention specific missing courses.
- If uncertain, say to confirm with a human advisor.
- Do not invent policies; reason from provided plan data.`
  }, [semesters, specialization, creditsEarned, cgpa, academicSummary])

  const sendChat = async (presetText) => {
    const text = (presetText ?? chatInput).trim()
    if (!text || chatLoading) return
    setChatInput('')
    const nextHistory = [...chatHistory, { role: 'user', text }]
    setChatHistory(nextHistory)
    if (!GEMINI_KEY) {
      setChatHistory((h) => [...h, { role: 'assistant', text: 'Missing VITE_GEMINI_API_KEY in .env.local — restart the dev server after adding it.' }])
      return
    }
    setChatLoading(true)
    try {
      const contents = nextHistory
        .filter((m) => m.role !== 'assistant' || !m.text.startsWith('Hi —'))
        .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] }))
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: advisorContext }] }, contents }),
        },
      )
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        setChatHistory((h) => [...h, { role: 'assistant', text: `API Error: ${errorData.error?.message || res.statusText}` }])
        return
      }
      const data = await res.json()
      setChatHistory((h) => [...h, { role: 'assistant', text: data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.' }])
    } catch {
      setChatHistory((h) => [...h, { role: 'assistant', text: 'Network error while contacting advisor.' }])
    } finally {
      setChatLoading(false)
    }
  }

  const onTranscriptFiles = (files) => {
    const list = [...files].filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    if (!list.length) return
    setTranscripts((prev) => [
      ...prev,
      ...list.map((f) => ({
        id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString(),
        status: 'ready',
      })),
    ])
  }

  return (
    <div className="min-h-screen bg-paper">
      <TopNav active={tab} onNavigate={setTab} />

      {tab === 'home' && (
        <HomePage onNavigate={setTab} creditsEarned={creditsEarned} cgpa={cgpa} />
      )}
      {tab === 'planner' && (
        <PlannerPage
          semesters={semesters}
          plannerMode={plannerMode}
          specialization={specialization}
          creditsEarned={creditsEarned}
          cgpa={cgpa}
          retakeNeeded={retakeNeeded}
          onTogglePlannerMode={togglePlannerMode}
          onAddCourse={(termIdx) => setAddModal({ termIdx, code: '', title: '', error: '' })}
          onChangeGrade={(termIdx, code, grade) => setGradeModal({ termIdx, code, grade })}
        />
      )}
      {tab === 'advisor' && (
        <AdvisorPage
          chatHistory={chatHistory}
          chatInput={chatInput}
          chatLoading={chatLoading}
          onInputChange={setChatInput}
          onSend={sendChat}
          onClear={() => setChatHistory([{ role: 'assistant', text: WELCOME }])}
        />
      )}
      {tab === 'profile' && (
        <ProfilePage
          specialization={specialization}
          creditsEarned={creditsEarned}
          cgpa={cgpa}
          transcripts={transcripts}
          onSpecializationChange={setSpecialization}
          onTranscriptFiles={onTranscriptFiles}
          onRemoveTranscript={(id) => setTranscripts((prev) => prev.filter((t) => t.id !== id))}
        />
      )}

      {gradeModal && (
        <Modal title="Change grade" onClose={() => setGradeModal(null)}>
          <div className="grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => updateGrade(gradeModal.termIdx, gradeModal.code, g)}
                className="border border-line bg-paper py-2 text-sm hover:border-ink"
              >
                {g}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {specializationOpen && (
        <Modal title="Choose specialization" onClose={() => setSpecializationOpen(false)}>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(specializationPlans).map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => { setSpecialization(sp); setSpecializationOpen(false) }}
                className="border border-line bg-paper py-2 text-sm hover:border-ink"
              >
                {sp}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {addModal && (
        <Modal title={`Add course to ${semesters[addModal.termIdx].term}`} onClose={() => setAddModal(null)}>
          <input
            value={addModal.code}
            list="catalog-codes"
            onChange={(e) => {
              const code = e.target.value.toUpperCase()
              setAddModal((m) => ({ ...m, code, title: COURSE_CATALOG[code]?.title || m.title, error: '' }))
            }}
            placeholder="Course code"
            className="mb-2 w-full border border-line bg-paper px-3 py-2"
          />
          <datalist id="catalog-codes">
            {courseCodes.map((code) => <option key={code} value={code} />)}
          </datalist>
          <input
            value={addModal.title}
            onChange={(e) => setAddModal((m) => ({ ...m, title: e.target.value }))}
            placeholder="Course title"
            className="mb-2 w-full border border-line bg-paper px-3 py-2"
          />
          <p className="text-xs text-mute">Prerequisites: {COURSE_CATALOG[addModal.code]?.prereqs?.join(', ') || '—'}</p>
          <p className="text-xs text-mute">
            Earliest semester: {typeof EARLIEST[addModal.code] === 'number' ? semesters[EARLIEST[addModal.code]]?.term : '—'}
          </p>
          {addModal.error && <p className="mt-2 text-sm text-[#8f1f1f]">{addModal.error}</p>}
          <button type="button" onClick={addCourse} className="mt-4 bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            Add course
          </button>
        </Modal>
      )}
    </div>
  )
}
