import type { Student, Question, AnswerScript, Mark, DashboardStats, StudentReportItem } from '../types'

// ── Students ──────────────────────────────────────────────────────────────────
export const students: Student[] = [
  { id: 1, index_number: 'DFK50083001', name: 'Ahmad Faris bin Zulkifli',    seat_number: 'A01', email: 'ahmad.faris@student.edu.my',    created_at: '2026-11-01T08:00:00Z' },
  { id: 2, index_number: 'DFK50083002', name: 'Nurul Ain binti Hamdan',       seat_number: 'A02', email: 'nurul.ain@student.edu.my',       created_at: '2026-11-01T08:00:00Z' },
  { id: 3, index_number: 'DFK50083003', name: 'Muhammad Hafiz bin Osman',     seat_number: 'A03', email: 'hafiz.osman@student.edu.my',     created_at: '2026-11-01T08:00:00Z' },
  { id: 4, index_number: 'DFK50083004', name: 'Siti Nabilah binti Razali',    seat_number: 'A04', email: 'siti.nabilah@student.edu.my',    created_at: '2026-11-01T08:00:00Z' },
  { id: 5, index_number: 'DFK50083005', name: 'Khairul Anwar bin Ismail',     seat_number: 'A05', email: 'khairul.anwar@student.edu.my',   created_at: '2026-11-01T08:00:00Z' },
  { id: 6, index_number: 'DFK50083006', name: 'Farah Nadia binti Kamarudin',  seat_number: 'B01', email: 'farah.nadia@student.edu.my',     created_at: '2026-11-01T08:00:00Z' },
  { id: 7, index_number: 'DFK50083007', name: 'Zulhilmi bin Abd Ghani',       seat_number: 'B02', email: 'zulhilmi@student.edu.my',        created_at: '2026-11-01T08:00:00Z' },
  { id: 8, index_number: 'DFK50083008', name: 'Liyana Syafiqah binti Yusof',  seat_number: 'B03', email: 'liyana.syafiqah@student.edu.my', created_at: '2026-11-01T08:00:00Z' },
  { id: 9, index_number: 'DFK50083009', name: 'Izzatul Husna binti Mohd Nor', seat_number: 'B04', email: 'izzatul.husna@student.edu.my',   created_at: '2026-11-01T08:00:00Z' },
  { id:10, index_number: 'DFK50083010', name: 'Amirul Hakim bin Baharudin',   seat_number: 'B05', email: 'amirul.hakim@student.edu.my',    created_at: '2026-11-01T08:00:00Z' },
  { id:11, index_number: 'DFK50083011', name: 'Wan Nor Asyikin binti Wan Ali',seat_number: 'C01', email: 'wan.asyikin@student.edu.my',     created_at: '2026-11-01T08:00:00Z' },
  { id:12, index_number: 'DFK50083012', name: 'Mohd Syafiq bin Zainal',       seat_number: 'C02', email: 'mohd.syafiq@student.edu.my',     created_at: '2026-11-01T08:00:00Z' },
]

// ── Questions ─────────────────────────────────────────────────────────────────
export const questions: Question[] = [
  {
    id: 1, number: 1,
    description: 'Write a Python function called `factorial(n)` that returns the factorial of a non-negative integer n using recursion.',
    max_marks: 20, topic: 'Functions & Recursion',
    marking_scheme: 'Award 5 marks for correct function definition, 10 marks for correct recursive logic, 5 marks for handling base case (n=0 or n=1).',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 2, number: 2,
    description: 'Create a class `BankAccount` with attributes `owner` and `balance`. Implement methods `deposit(amount)`, `withdraw(amount)`, and `get_balance()`. Ensure withdrawal does not allow negative balance.',
    max_marks: 25, topic: 'Object-Oriented Programming',
    marking_scheme: 'Award 5 marks for class definition, 5 marks each for deposit/withdraw/get_balance methods, 5 marks for negative balance guard.',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 3, number: 3,
    description: 'Write a Python program that reads a list of integers from the user and writes only the even numbers to a file called `even_numbers.txt`, one number per line.',
    max_marks: 20, topic: 'File I/O',
    marking_scheme: 'Award 5 marks for input handling, 5 marks for even number filtering, 10 marks for correct file writing with proper open/close.',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 4, number: 4,
    description: 'Given a list of student names and scores, write a Python program using list comprehension to return a list of names of students who scored above 50.',
    max_marks: 15, topic: 'List Comprehension',
    marking_scheme: 'Award 5 marks for correct data structure, 10 marks for correct list comprehension syntax and filtering logic.',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 5, number: 5,
    description: 'Write a Python program that handles a `ZeroDivisionError` and a `ValueError` using try-except blocks. Demonstrate with an example.',
    max_marks: 20, topic: 'Exception Handling',
    marking_scheme: 'Award 10 marks for correct try-except for ZeroDivisionError, 10 marks for ValueError handling with meaningful error messages.',
    created_at: '2026-11-01T08:00:00Z',
  },
]

// ── Marks per student (question_id → score, ai_score, feedback) ───────────────
type RawMark = { question_id: number; score: number; ai_score: number; feedback: string; ai_feedback: string }

const marksData: Record<number, RawMark[]> = {
  1: [
    { question_id:1, score:18, ai_score:17, feedback:'Good recursion. Base case clearly handled.', ai_feedback:'Correct recursive structure. Base case handled for n=0 and n=1. Minor: could add input validation for negative n.' },
    { question_id:2, score:22, ai_score:22, feedback:'Excellent OOP design.', ai_feedback:'BankAccount class is well-structured. All three methods implemented correctly. Negative balance guard works properly.' },
    { question_id:3, score:16, ai_score:15, feedback:'File writing correct but missing close().', ai_feedback:'Even filtering logic is correct. File opened correctly but `file.close()` not explicitly called — recommend using context manager.' },
    { question_id:4, score:14, ai_score:14, feedback:'Clean list comprehension.', ai_feedback:'List comprehension is syntactically correct and filters above 50 properly. Good use of Pythonic style.' },
    { question_id:5, score:17, ai_score:16, feedback:'Both exceptions handled well.', ai_feedback:'Both ZeroDivisionError and ValueError caught correctly. Error messages are meaningful. Could improve by using finally block.' },
  ],
  2: [
    { question_id:1, score:12, ai_score:11, feedback:'Base case missing for n=1.', ai_feedback:'Recursive logic partially correct but base case only handles n=0, missing n=1 case causing infinite recursion in some inputs.' },
    { question_id:2, score:18, ai_score:18, feedback:'Good OOP, minor balance issue.', ai_feedback:'Class structure correct. Deposit and get_balance work. Withdraw has a logic issue: allows exact zero balance (acceptable) but error message is missing.' },
    { question_id:3, score:14, ai_score:13, feedback:'Good overall.', ai_feedback:'Even filtering and file writing correct. Used `with open()` properly. Minor: input parsing does not handle non-integer input gracefully.' },
    { question_id:4, score:12, ai_score:12, feedback:'Correct but could be more Pythonic.', ai_feedback:'List comprehension works correctly. Filtering condition is right. Could use `zip()` or dictionary for cleaner pairing of names and scores.' },
    { question_id:5, score:14, ai_score:14, feedback:'Both exceptions handled.', ai_feedback:'Both exceptions correctly caught. Example demonstrates both error types clearly. Good use of descriptive error messages.' },
  ],
  3: [
    { question_id:1, score:20, ai_score:20, feedback:'Perfect.', ai_feedback:'Perfect recursive implementation. Handles all edge cases including 0! = 1. Clean and readable code.' },
    { question_id:2, score:25, ai_score:24, feedback:'Outstanding OOP.', ai_feedback:'Excellent BankAccount implementation. All methods correct. Negative balance guard is robust. Well-documented code.' },
    { question_id:3, score:19, ai_score:19, feedback:'Excellent file handling.', ai_feedback:'Perfect use of context manager. Even filtering flawless. Good input validation for non-integer inputs.' },
    { question_id:4, score:15, ai_score:15, feedback:'Perfect list comprehension.', ai_feedback:'Optimal list comprehension. Clean, Pythonic, and handles edge cases.' },
    { question_id:5, score:19, ai_score:18, feedback:'Excellent exception handling.', ai_feedback:'Both exceptions handled with meaningful messages. Used finally block appropriately. Well-structured try-except-finally chain.' },
  ],
  4: [
    { question_id:1, score:8, ai_score:7,  feedback:'No base case, infinite recursion.', ai_feedback:'Missing base case entirely. The function will cause infinite recursion for any input. Function definition is correct but logic incomplete.' },
    { question_id:2, score:10, ai_score:9, feedback:'Missing withdraw method.', ai_feedback:'Class defined with owner and balance. Deposit method works. Withdraw method is missing. get_balance returns correct value.' },
    { question_id:3, score:9, ai_score:8,  feedback:'File not written correctly.', ai_feedback:'Even filtering logic partially correct. File opened in read mode instead of write mode. Even numbers list computed but not written to file.' },
    { question_id:4, score:10, ai_score:10, feedback:'Correct basic implementation.', ai_feedback:'List comprehension is functionally correct. Filtering threshold applied properly. Basic implementation meets requirements.' },
    { question_id:5, score:8, ai_score:7,  feedback:'Only one exception handled.', ai_feedback:'Only ZeroDivisionError handled. ValueError block is missing. The existing handler works correctly.' },
  ],
  5: [
    { question_id:1, score:15, ai_score:14, feedback:'Good but no input validation.', ai_feedback:'Recursive logic correct. Base case correct. Missing input validation for negative integers which would cause infinite recursion.' },
    { question_id:2, score:20, ai_score:20, feedback:'Complete and correct.', ai_feedback:'All methods correctly implemented. Negative balance guard works. Good code organisation and readability.' },
    { question_id:3, score:15, ai_score:15, feedback:'Good file I/O.', ai_feedback:'Even filtering correct. File written with one number per line. Used context manager properly.' },
    { question_id:4, score:12, ai_score:11, feedback:'Good attempt.', ai_feedback:'List comprehension logic is correct but uses a regular for loop instead of list comprehension syntax. Loses marks for not meeting the question requirement.' },
    { question_id:5, score:16, ai_score:15, feedback:'Both exceptions handled.', ai_feedback:'Both exception types handled. Error messages present. Minor inconsistency in ValueError example.' },
  ],
  6: [
    { question_id:1, score:16, ai_score:16, feedback:'Good recursion.', ai_feedback:'Recursive factorial is correct. Base cases n=0 and n=1 handled. Clean implementation.' },
    { question_id:2, score:21, ai_score:20, feedback:'Very good OOP.', ai_feedback:'BankAccount well implemented. All three methods work correctly. Negative balance guard present.' },
    { question_id:3, score:17, ai_score:17, feedback:'Correct file I/O.', ai_feedback:'File writing with context manager. Even filtering correct. Good input handling.' },
    { question_id:4, score:13, ai_score:13, feedback:'Good list comprehension.', ai_feedback:'List comprehension correct and Pythonic. Filtering logic works for all test cases.' },
    { question_id:5, score:15, ai_score:14, feedback:'Good exception handling.', ai_feedback:'Both exceptions handled. Examples are clear. Minor: no finally block used.' },
  ],
  7: [
    { question_id:1, score:5,  ai_score:4,  feedback:'Iteration used instead of recursion.', ai_feedback:'Student used iterative approach (for loop) instead of recursion as required. Loses majority of marks for not meeting recursion requirement.' },
    { question_id:2, score:12, ai_score:11, feedback:'Missing get_balance.', ai_feedback:'Class defined. Deposit and withdraw partially implemented. get_balance method missing. No negative balance guard.' },
    { question_id:3, score:7,  ai_score:6,  feedback:'File not closed properly.', ai_feedback:'Even filtering attempted but logic has off-by-one error. File opened correctly but not closed. Numbers partially written.' },
    { question_id:4, score:8,  ai_score:8,  feedback:'Incorrect filtering threshold.', ai_feedback:'List comprehension syntax correct. However, filtering condition uses >= 50 instead of > 50 as required.' },
    { question_id:5, score:10, ai_score:9,  feedback:'Only ZeroDivisionError handled.', ai_feedback:'ZeroDivisionError correctly handled. ValueError block present but catches wrong exception type (TypeError instead of ValueError).' },
  ],
  8: [
    { question_id:1, score:19, ai_score:18, feedback:'Excellent recursion.', ai_feedback:'Near-perfect implementation. Both base cases handled. Clean code with good variable naming. Minor: missing docstring.' },
    { question_id:2, score:23, ai_score:23, feedback:'Outstanding.', ai_feedback:'Excellent BankAccount class. All methods work flawlessly. Negative balance guard with informative error message. Good use of __str__.' },
    { question_id:3, score:18, ai_score:18, feedback:'Excellent file I/O.', ai_feedback:'Perfect use of context manager. Even filtering correct. Input validation present. File written correctly.' },
    { question_id:4, score:14, ai_score:14, feedback:'Very good.', ai_feedback:'List comprehension is correct, Pythonic and efficient. Good use of tuple unpacking in comprehension.' },
    { question_id:5, score:18, ai_score:17, feedback:'Very good exception handling.', ai_feedback:'Both exceptions handled with meaningful messages. Used finally block. Well-structured and readable.' },
  ],
  9: [
    { question_id:1, score:14, ai_score:13, feedback:'Good attempt, minor logic error.', ai_feedback:'Recursive logic mostly correct. Base case handles n=0 but not n=1 explicitly. Works correctly but not fully robust.' },
    { question_id:2, score:16, ai_score:15, feedback:'Good OOP.', ai_feedback:'BankAccount class correct. Withdraw guard works. get_balance returns correct value. Minor: balance not formatted properly in output.' },
    { question_id:3, score:12, ai_score:11, feedback:'Even filter has bug.', ai_feedback:'File I/O correct. Even filtering has a bug: uses `n % 2 == 1` instead of `n % 2 == 0`, writing odd numbers instead of even.' },
    { question_id:4, score:11, ai_score:11, feedback:'Correct list comprehension.', ai_feedback:'List comprehension is correct. Filtering threshold applied correctly.' },
    { question_id:5, score:14, ai_score:13, feedback:'Good exception handling.', ai_feedback:'Both exceptions handled. ValueError example is a bit contrived but correct. Good error messages.' },
  ],
  10: [
    { question_id:1, score:17, ai_score:17, feedback:'Good recursion.', ai_feedback:'Correct recursive factorial. Both base cases handled. Good readability.' },
    { question_id:2, score:19, ai_score:18, feedback:'Good OOP.', ai_feedback:'All three methods implemented. Negative balance guard works. Minor: no error message in withdraw when insufficient funds.' },
    { question_id:3, score:16, ai_score:16, feedback:'Good file I/O.', ai_feedback:'Correct even filtering and file writing. Context manager used. Good input handling.' },
    { question_id:4, score:13, ai_score:13, feedback:'Good comprehension.', ai_feedback:'List comprehension is syntactically correct and logically sound.' },
    { question_id:5, score:15, ai_score:14, feedback:'Good exception handling.', ai_feedback:'Both exceptions handled. Good examples and error messages.' },
  ],
  11: [
    { question_id:1, score:11, ai_score:10, feedback:'Partial recursion.', ai_feedback:'Partial recursion implementation. Base case present. Recursive call returns wrong type (string instead of int).' },
    { question_id:2, score:14, ai_score:13, feedback:'Missing deposit method.', ai_feedback:'Class structure correct. Withdraw and get_balance work. Deposit method is missing. Balance initialises correctly.' },
    { question_id:3, score:11, ai_score:10, feedback:'File written but not all even numbers.', ai_feedback:'Even filtering partially correct. Misses even numbers at index 0. File writing works. Context manager not used.' },
    { question_id:4, score:9,  ai_score:9,  feedback:'Correct basic list comprehension.', ai_feedback:'List comprehension correct. Filtering works. Minor: variable names are not descriptive.' },
    { question_id:5, score:11, ai_score:10, feedback:'One exception handled well.', ai_feedback:'ZeroDivisionError handled well. ValueError block present but example does not actually raise ValueError.' },
  ],
  12: [
    { question_id:1, score:3,  ai_score:2,  feedback:'No recursion, incomplete code.', ai_feedback:'No recursion used. Code is a stub with no implementation. Only the function signature is present.' },
    { question_id:2, score:5,  ai_score:4,  feedback:'Only class defined, no methods.', ai_feedback:'Class BankAccount defined with owner and balance attributes. No methods implemented.' },
    { question_id:3, score:4,  ai_score:3,  feedback:'No file I/O attempted.', ai_feedback:'Even filtering attempted with errors. No file I/O code present at all.' },
    { question_id:4, score:5,  ai_score:5,  feedback:'Regular loop used, not comprehension.', ai_feedback:'Student used a regular for loop instead of list comprehension. Output is correct but does not meet the requirement.' },
    { question_id:5, score:3,  ai_score:2,  feedback:'Only try block, no except.', ai_feedback:'Try block present but except block is empty (pass only). No actual exception handling logic.' },
  ],
}

// ── Build AnswerScripts with computed totals ───────────────────────────────────
function computeGrade(score: number, max: number): string {
  const pct = max > 0 ? (score / max) * 100 : 0
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  if (pct >= 40) return 'E'
  return 'F'
}

const totalMax = questions.reduce((s, q) => s + q.max_marks, 0) // 100

let markIdCounter = 1
export const scripts: AnswerScript[] = students.map((student) => {
  const rawMarks = marksData[student.id] ?? []
  const marks: Mark[] = rawMarks.map((rm) => {
    const q = questions.find((q) => q.id === rm.question_id)!
    return {
      id: markIdCounter++,
      script_id: student.id,
      question_id: rm.question_id,
      score: rm.score,
      max_score: q.max_marks,
      ai_score: rm.ai_score,
      ai_feedback: rm.ai_feedback,
      lecturer_override: rm.score !== rm.ai_score,
      feedback: rm.feedback,
      created_at: '2026-11-20T09:00:00Z',
    }
  })
  const total = marks.reduce((s, m) => s + m.score, 0)
  return {
    id: student.id,
    student_id: student.id,
    file_name: `${student.index_number}_answer_script.pdf`,
    is_marked: marks.length === questions.length,
    total_score: marks.length > 0 ? total : null,
    grade: marks.length === questions.length ? computeGrade(total, totalMax) : null,
    remarks: null,
    uploaded_at: '2026-11-18T08:30:00Z',
    marked_at: marks.length === questions.length ? '2026-11-20T16:00:00Z' : null,
    marks,
  }
})

// ── Dashboard stats ───────────────────────────────────────────────────────────
const markedScripts = scripts.filter((s) => s.is_marked && s.total_score !== null)
const scores = markedScripts.map((s) => s.total_score as number)

const gradeCounts: Record<string, number> = {}
markedScripts.forEach((s) => {
  if (s.grade) gradeCounts[s.grade] = (gradeCounts[s.grade] ?? 0) + 1
})

export const dashboardStats: DashboardStats = {
  total_students: students.length,
  total_marked: markedScripts.length,
  total_pending: scripts.length - markedScripts.length,
  average_score: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
  highest_score: scores.length ? Math.max(...scores) : null,
  lowest_score: scores.length ? Math.min(...scores) : null,
  grade_distribution: Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count })),
}

// ── Grade report ──────────────────────────────────────────────────────────────
export const gradeReport: StudentReportItem[] = students.map((s) => {
  const script = scripts.find((sc) => sc.student_id === s.id)
  return {
    student_id: s.id,
    index_number: s.index_number,
    name: s.name,
    total_score: script?.total_score ?? null,
    grade: script?.grade ?? null,
    is_marked: script?.is_marked ?? false,
  }
})
