/**
 * AUI undergraduate grading & repeat rules
 * Source: Al Akhawayn University Academic Catalog 2024–2025 / 2025–2026
 * (Grading Policy + Undergraduate Repeat Policy)
 *
 * Key rules:
 * - C- is the lowest passing grade for degree / major / core / FAS / prerequisites.
 * - D+ and D still earn SCH and quality points, but are NOT acceptable in major,
 *   minor, core, or FAS. Only one D may count as an elective.
 * - Repeated courses count once for credit; CGPA uses the highest letter grade.
 * - An F is dropped from GPA once the course is successfully repeated.
 * - P earns credit but does not affect GPA (treated as ≥ C for undergrads).
 */

export const GRADE_POINTS = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.67,
  'B+': 3.33,
  B: 3.0,
  'B-': 2.67,
  'C+': 2.33,
  C: 2.0,
  'C-': 1.67,
  'D+': 1.33,
  D: 1.0,
  F: 0.0,
}

/** Grade appears on transcript as a letter that can enter GPA math. */
export function isLetterGrade(grade) {
  return Object.prototype.hasOwnProperty.call(GRADE_POINTS, grade)
}

/** Earns semester credit hours (includes D+/D and P). */
export function earnsCredit(grade) {
  if (grade === 'P' || grade === 'CR') return true
  if (!isLetterGrade(grade)) return false
  return grade !== 'F'
}

/**
 * Satisfies major / minor / core / FAS / prerequisite chains.
 * AUI: C- lowest passing; D+/D not acceptable in those areas.
 */
export function satisfiesRequirement(grade) {
  if (grade === 'P' || grade === 'CR') return true
  if (!isLetterGrade(grade)) return false
  return GRADE_POINTS[grade] >= GRADE_POINTS['C-']
}

/** D+ or D: credits yes, but course still must be retaken for major/prereq. */
export function needsRetakeForRequirement(grade) {
  return grade === 'D+' || grade === 'D'
}

/** Catalog: may repeat C- or lower (and F). */
export function isRepeatable(grade) {
  if (grade === 'F' || grade === 'W' || grade === 'WF') return true
  if (!isLetterGrade(grade)) return false
  return GRADE_POINTS[grade] <= GRADE_POINTS['C-']
}

export function getCourseCredits(code, catalog = {}) {
  if (catalog[code]?.credits != null) return Number(catalog[code].credits)
  const m = String(code).match(/\b(\d{4})\b/)
  if (m) return Number(m[1][1])
  return 3
}

function betterLetter(a, b) {
  return GRADE_POINTS[a] >= GRADE_POINTS[b] ? a : b
}

/**
 * Collapse all attempts of each course code into one academic outcome.
 * @param {Array<{code: string, grade: string}>} attempts
 * @param {Record<string, {credits?: number}>} catalog
 */
export function summarizeAttempts(attempts, catalog = {}) {
  const byCode = new Map()

  for (const { code, grade } of attempts) {
    if (!code) continue
    let row = byCode.get(code)
    if (!row) {
      row = {
        code,
        grades: [],
        credits: getCourseCredits(code, catalog),
      }
      byCode.set(code, row)
    }
    row.grades.push(grade)
  }

  return [...byCode.values()].map((row) => {
    const letterGrades = row.grades.filter(isLetterGrade)
    const bestLetter = letterGrades.length
      ? letterGrades.reduce((best, g) => betterLetter(best, g))
      : null

    const hasCredit = row.grades.some(earnsCredit)
    const hasSatisfying = row.grades.some(satisfiesRequirement)

    // Highest letter for CGPA; drop F entirely once any credit-earning letter exists
    let gpaGrade = null
    if (bestLetter && bestLetter !== 'F') {
      gpaGrade = bestLetter
    } else if (bestLetter === 'F' && !hasCredit) {
      gpaGrade = 'F'
    }

    return {
      code: row.code,
      credits: row.credits,
      bestLetter,
      countsTowardCredits: hasCredit,
      satisfiesRequirement: hasSatisfying,
      // e.g. D+ alone on CSC 3323 → credits yes, still must retake for major/prereq
      needsRetake: !hasSatisfying && row.grades.some(
        (g) => g === 'F' || needsRetakeForRequirement(g),
      ),
      gpaGrade,
    }
  })
}

/**
 * Compute earned SCH + CGPA from a flat list of course attempts.
 * Retakes: credit once; GPA uses highest letter grade (AUI catalog).
 */
export function computeCreditsAndGpa(attempts, catalog = {}) {
  const byCourse = summarizeAttempts(attempts, catalog)

  let creditsEarned = 0
  let qualityPoints = 0
  let creditsAttemptedForGpa = 0
  const needsRetake = []

  for (const row of byCourse) {
    if (row.countsTowardCredits) creditsEarned += row.credits
    if (row.needsRetake && !row.satisfiesRequirement) needsRetake.push(row.code)
    if (row.gpaGrade) {
      qualityPoints += GRADE_POINTS[row.gpaGrade] * row.credits
      creditsAttemptedForGpa += row.credits
    }
  }

  const gpa = creditsAttemptedForGpa > 0
    ? Math.round((qualityPoints / creditsAttemptedForGpa) * 100) / 100
    : null

  return {
    creditsEarned,
    gpa,
    qualityPoints,
    creditsAttemptedForGpa,
    needsRetake,
    byCourse,
  }
}

/** Codes completed with C- or better (or P) before a given term — for prereq checks. */
export function getSatisfiedCodesBefore(semesters, termIdx) {
  const set = new Set()
  semesters.forEach((s, idx) => {
    if (idx >= termIdx) return
    s.courses.forEach((c) => {
      if (satisfiesRequirement(c.grade)) set.add(c.code)
    })
  })
  return set
}
