import catalogData from './course-catalog.json'

export const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'W', 'In progress', 'Upcoming']

export const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'planner', label: 'Degree Planner' },
  { id: 'advisor', label: 'Advisor' },
  { id: 'profile', label: 'Profile' },
]

export const COURSE_CATALOG = Object.fromEntries(
  catalogData.courses.map((c) => [c.code, { title: c.title, prereqs: c.prereqs, credits: c.credits }]),
)

export const EARLIEST = {
  'FYE 1101': 0, 'FAS 0210': 0, 'ENG 1301': 0, 'CSC 1401': 0, 'MTH 1303': 0, 'CHE 1401': 1,
  'FYE 1102': 1, 'FAS 1220': 1, 'COM 1301': 1, 'CSC 2302': 1, 'MTH 1304': 1,
  'ENG 2303': 3, 'CSC 2306': 4, 'MTH 2301': 4, 'PHY 1401': 4, 'EGR 2302': 4,
  'CSC 2305': 7, 'CSC 3315': 7, 'CSC 3323': 7, 'MTH 3301': 7, 'PHY 1402': 8, 'CSC 3324': 8, 'CSC 3326': 9,
  'CSC 3351': 9, 'CSC 3371': 9, 'FREE ELECTIVE 1': 9,
  'SPECIALIZATION 1': 10, 'COMPUTING ELECTIVE': 10,
  'SPECIALIZATION 2': 12, 'EGR 4300': 12, 'EGR 4402': 12,
  'SPECIALIZATION 3': 13, 'MINOR COURSE 5': 13, 'FREE ELECTIVE 2': 13,
}

export const specializationPlans = {
  CSYS: ['CSC 3373', 'CSC 3328', 'CSC 3329'],
  AI: ['SPECIALIZATION 1', 'SPECIALIZATION 2', 'SPECIALIZATION 3'],
  ACS: ['SPECIALIZATION 1', 'SPECIALIZATION 2', 'SPECIALIZATION 3'],
  BDA: ['SPECIALIZATION 1', 'SPECIALIZATION 2', 'SPECIALIZATION 3'],
  SE: ['SPECIALIZATION 1', 'SPECIALIZATION 2', 'SPECIALIZATION 3'],
  UNSURE: ['SPECIALIZATION 1', 'SPECIALIZATION 2', 'SPECIALIZATION 3'],
}

export const STUDENT = {
  name: 'Mohammed Benabdallah Belbaraka',
  id: '121160',
  program: 'B.S. Computer Science (BSCSC)',
  school: 'School of Science & Engineering',
  university: 'Al Akhawayn University',
  email: 'm.belbaraka@aui.ma',
  status: 'Spring 2026 — In Progress',
  minCredits: 134,
}

export const seedPlan = [
  { term: 'Fall 2022', courses: [['ARB 1203', 'Arabic Communication', 'A-'], ['CSC 1401', 'Computer Programming', 'B+'], ['ENG 1301', 'English Composition', 'A-'], ['FAS 0210', 'Strategic Academic Skills', 'P'], ['FYE 1101', 'First Year Experience I', 'P'], ['MTH 1304', 'Discrete Mathematics', 'F']] },
  { term: 'Spring 2023', courses: [['CHE 1401', 'General Chemistry I', 'C+'], ['COM 1301', 'Public Speaking', 'A+'], ['CSC 2302', 'Data Structures', 'D'], ['FAS 1220', 'Critical Thinking', 'B'], ['FYE 1102', 'First Year Experience II', 'P'], ['MTH 1303', 'Calculus I', 'F']] },
  { term: 'Summer 2023', courses: [['MTH 1304', 'Discrete Mathematics', 'A+'], ['PHI 2302', 'History of Ideas', 'A+']] },
  { term: 'Fall 2023', courses: [['COM 1304', 'New Media Technologies', 'A-'], ['CSC 2302', 'Data Structures', 'A-'], ['ENG 2303', 'Technical Writing', 'A-'], ['MTH 1303', 'Calculus I', 'A-'], ['PSY 1301', 'Intro to Psychology', 'A']] },
  { term: 'Spring 2024', courses: [['COM 2403', 'Photography', 'A-'], ['CSC 2306', 'Object-Oriented Programming', 'A-'], ['EGR 2302', 'Engineering Economics', 'B'], ['PHY 1401', 'Physics I', 'B'], ['MTH 2301', 'Calculus II', 'C']] },
  { term: 'Summer 2024', courses: [['PHY 1402', 'Physics II', 'C+'], ['CSC 3324', 'Software Engineering', 'C']] },
  { term: 'Fall 2024', courses: [['COM 2427', 'Art and Design Production', 'A'], ['CSC 2305', 'Computer Architecture', 'W'], ['CSC 3326', 'Database Systems', 'B+'], ['MTH 2320', 'Linear Algebra', 'C-'], ['PSC 2301', 'Comparative Political Systems', 'C']] },
  { term: 'Spring 2025', courses: [['COM 2301', 'Professional Communication', 'A'], ['MTH 3301', 'Probability and Statistics', 'B'], ['CSC 2305', 'Computer Architecture', 'B+'], ['CSC 3315', 'Languages and Compilers', 'B'], ['CSC 3323', 'Analysis of Algorithms', 'D+'], ['GER 1301', 'Beginning German', 'B']] },
  { term: 'Summer 2025', courses: [] },
  { term: 'Fall 2025', courses: [['ART 1304', 'Culture and Heritage', 'B-'], ['CSC 3351', 'Operating Systems', 'A-'], ['CSC 3358', 'Blockchain Business Applications', 'C'], ['CSC 3371', 'Computer Networks and Communication', 'B'], ['EGR 4300', 'Internship', 'A'], ['HUM 3399', 'Special Topics: Common Sense', 'A']] },
  { term: 'Spring 2026', courses: [['CSC 3323', 'Analysis of Algorithms', 'In progress'], ['CSC 3374', 'Advanced and Distributed Programming Paradigms', 'In progress'], ['CSC 3373', 'Cloud Computing', 'In progress'], ['CSC 3329', 'IoT and Big Data Streaming', 'In progress']] },
  { term: 'Summer 2026', courses: [['MINOR COURSE 5', 'Minor Course 5', 'Upcoming'], ['FREE ELECTIVE 2', 'Free Elective 2', 'Upcoming']] },
  { term: 'Fall 2026', courses: [['CSC 3328', 'Embedded Systems', 'Upcoming'], ['EGR 4402', 'Capstone Design', 'Upcoming']] },
  { term: 'Spring 2027', courses: [] },
  { term: 'Summer 2027', courses: [] },
]

export const toRows = (plan) => plan.map((s, idx) => ({
  ...s,
  index: idx,
  courses: s.courses.map(([code, title, grade]) => ({ code, title, grade })),
}))

export const HOME_FEATURES = [
  {
    id: '01',
    title: 'Degree Planner',
    tab: 'planner',
    blurb: 'Drag your four-year path across semesters with live prerequisite checks.',
    detail: 'DAG validation · AUI catalog rules · specialization tracks',
  },
  {
    id: '02',
    title: 'AI Advisor',
    tab: 'advisor',
    blurb: 'Ask about retakes, CSYS, CGPA, and what still blocks graduation.',
    detail: 'Grounded in your plan · not generic internet advice',
  },
  {
    id: '03',
    title: 'Profile & Transcripts',
    tab: 'profile',
    blurb: 'Keep student identity and PDF transcripts ready for automated parsing.',
    detail: 'Upload now · parser module next',
  },
]

export const MARQUEE_COURSES = [
  'CSC 1401', 'CSC 2302', 'CSC 2306', 'CSC 3323', 'CSC 3351', 'CSC 3371',
  'MTH 1303', 'MTH 1304', 'PHY 1401', 'EGR 4402', 'CSC 3326', 'CSC 3373',
]
