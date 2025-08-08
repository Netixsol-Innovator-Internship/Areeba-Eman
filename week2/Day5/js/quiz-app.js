// Vanilla Quiz App (HTML + Tailwind + JS only)

// ROUTE FILENAMES
const PAGES = {
  select: "myQuizes.html",
  start: "quiz_start.html",
  result: "quiz_result.html",
  review: "review_result.html",
}

// Filters we support on the Select page
const FILTERS = ["all", "html", "css", "javascript", "tailwind", "react"]
let currentFilter = "all"

// Quiz data - will be loaded from JSON file
let QUIZZES = []

// Load quiz data from JSON file
async function loadQuizData() {
  try {
    const response = await fetch('data/quizzes.json')
    const data = await response.json()
    QUIZZES = data.quizzes
    console.log('Quiz data loaded successfully:', QUIZZES.length, 'quizzes')
  } catch (error) {
    console.error('Error loading quiz data:', error)
    // Fallback to empty array if JSON fails to load
    QUIZZES = []
  }
}

// Initialize quiz data when page loads
loadQuizData()

// 2) Helpers
function byId(id) { return document.getElementById(id) }
function getParam(name) { return new URLSearchParams(location.search).get(name) }
function getQuiz(id) { return QUIZZES.find(q => q.id === id) }

// Small helper to escape HTML for safe injection
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

// Helper function to save quiz history
function saveQuizHistory(quizId, quizTitle, score, total) {
  const currentUserEmail = localStorage.getItem('currentUser');
  if (!currentUserEmail) return;
  
  const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
  
  const historyEntry = {
    userEmail: currentUserEmail,
    quizId: quizId,
    quizName: quizTitle,
    score: score,
    total: total,
    date: new Date().toISOString()
  };
  
  quizHistory.push(historyEntry);
  localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
}

// 3) Page routers
document.addEventListener("DOMContentLoaded", () => {
  // Wait for quiz data to load before initializing pages
  const initializePages = () => {
    if (byId("featured-grid") && byId("all-quizzes-list")) {
      renderSelectPage()
      return
    }
    if (byId("options-form") && byId("options-list")) {
      renderStartPage()
      return
    }
    if (byId("score-value") && byId("result-progress-fill")) {
      renderResultPage()
      return
    }
    if (byId("review-list")) {
      renderReviewPage()
      return
    }
  }

  // Check if quiz data is loaded, if not wait a bit
  if (QUIZZES.length === 0) {
    setTimeout(initializePages, 500)
  } else {
    initializePages()
  }
})

// 4) Select Quiz page (with filters)
function renderSelectPage() {
  const filtersEl = byId("quiz-filters")
  const featuredGrid = byId("featured-grid")
  const allList = byId("all-quizzes-list")

  function getFilteredQuizzes() {
    if (currentFilter === "all") return QUIZZES
    return QUIZZES.filter((q) => q.id === currentFilter)
  }

  function paintActiveFilter() {
    if (!filtersEl) return
    const buttons = filtersEl.querySelectorAll("[data-filter]")
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-filter") === currentFilter
      if (isActive) {
        btn.setAttribute("aria-current", "page")
        btn.className =
          "rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs sm:text-[13px] font-medium text-neutral-900"
      } else {
        btn.removeAttribute("aria-current")
        btn.className =
          "rounded-full border border-transparent bg-neutral-100 px-3 py-1 text-xs sm:text-[13px] text-neutral-700 hover:bg-neutral-200"
      }
    })
  }

  function renderLists() {
    const data = getFilteredQuizzes()
    // Featured (top 3 of filtered)
    featuredGrid.innerHTML = ""
    const featured = data.slice(0, 3)
    if (featured.length === 0) {
      featuredGrid.innerHTML =
        '<p class="text-sm text-neutral-600">No featured quizzes in this category.</p>'
    } else {
      featured.forEach((quiz) => {
        const article = document.createElement("article")
        article.className = "group cursor-pointer"
        article.innerHTML = `
          <div class="overflow-hidden rounded-lg">
            <img src="${quiz.image}" alt="${quiz.title} thumbnail"
              class="h-[143px] w-full object-cover transition-transform group-hover:scale-[1.02]" />
          </div>
          <h3 class="mt-2 text-sm font-medium">${quiz.title}</h3>
          <p class="mt-1 text-xs text-neutral-600">${quiz.description}</p>
        `
        article.addEventListener("click", () => {
          location.href = `${PAGES.start}?id=${encodeURIComponent(quiz.id)}`
        })
        featuredGrid.appendChild(article)
      })
    }

    // All
    allList.innerHTML = ""
    if (data.length === 0) {
      allList.innerHTML =
        '<li class="text-sm text-neutral-600">No quizzes found for this category.</li>'
      return
    }
    data.forEach((quiz) => {
      const li = document.createElement("li")
      li.className = "grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3 md:gap-6"
      li.innerHTML = `
        <div>
          <h3 class="text-xl font-medium">
            <a href="${PAGES.start}?id=${encodeURIComponent(quiz.id)}" class="hover:underline">${quiz.title}</a>
          </h3>
          <p class="mt-1 text-xs text-neutral-600">${quiz.description}</p>
        </div>
        <a href="${PAGES.start}?id=${encodeURIComponent(quiz.id)}" class="block">
          <img src="${quiz.image}" alt="${quiz.title} thumbnail"
            class="h-[171px] w-full md:w-[280px] rounded-md object-cover" />
        </a>
      `
      allList.appendChild(li)
    })
  }

  // Wire filter clicks (event delegation)
  if (filtersEl) {
    filtersEl.addEventListener("click", (e) => {
      const target = e.target.closest("[data-filter]")
      if (!target) return
      const next = target.getAttribute("data-filter")
      if (!next || !FILTERS.includes(next)) return
      currentFilter = next
      paintActiveFilter()
      renderLists()
    })
  }

  // Initial
  paintActiveFilter()
  renderLists()
}

// 5) Start Quiz page
function renderStartPage() {
  const id = getParam("id")
  const quiz = getQuiz(id || "")
  if (!quiz) {
    location.href = PAGES.select
    return
  }

  const titleEl = byId("question-text")
  const progressFill = byId("progress-fill")
  const progressText = byId("progress-text")
  const hoursEl = byId("hours")
  const minutesEl = byId("minutes")
  const secondsEl = byId("seconds")
  const form = byId("options-form")
  const optionsList = byId("options-list")
  const prevBtn = byId("prev-btn")
  const nextBtn = byId("next-btn")

  let index = 0
  const total = quiz.questions.length
  const answers = new Array(total).fill(null)

  // Timer
  let elapsed = 0
  setInterval(() => {
    elapsed += 1
    const h = Math.floor(elapsed / 3600)
    const m = Math.floor((elapsed % 3600) / 60)
    const s = elapsed % 60
    hoursEl.textContent = String(h).padStart(2, "0")
    minutesEl.textContent = String(m).padStart(2, "0")
    secondsEl.textContent = String(s).padStart(2, "0")
  }, 1000)

  function renderQuestion() {
    const q = quiz.questions[index]
    titleEl.textContent = q.question

    // Progress
    const pct = Math.round(((index + 1) / total) * 100)
    progressFill.style.width = pct + "%"
    progressText.textContent = `Question ${index + 1} of ${total}`

    // Options
    optionsList.innerHTML = ""
    q.options.forEach((opt, optIdx) => {
      const label = document.createElement("label")
      label.className = "flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 cursor-pointer"

      const input = document.createElement("input")
      input.type = "radio"
      input.name = "answer"
      input.value = String(optIdx)
      input.className = "h-4 w-4 rounded-full border-neutral-300 text-neutral-900 focus:ring-neutral-900"
      input.checked = answers[index] === optIdx
      input.addEventListener("change", () => {
        answers[index] = optIdx
      })

      const span = document.createElement("span")
      span.className = "text-sm"
      span.textContent = opt

      label.appendChild(input)
      label.appendChild(span)
      optionsList.appendChild(label)
    })

    // Buttons
    prevBtn.disabled = index === 0
    nextBtn.textContent = index < total - 1 ? "Next" : "Finish"
  }

  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1)
    renderQuestion()
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (index < total - 1) {
      index += 1
      renderQuestion()
    } else {
      const score = answers.reduce((acc, ans, i) => {
        return acc + (ans === quiz.questions[i].answer ? 1 : 0)
      }, 0)

      // Save quiz history
      saveQuizHistory(quiz.id, quiz.title, score, total)

      // Save attempt for review
      try {
        sessionStorage.setItem(`quizAttempt:${quiz.id}`, JSON.stringify({ answers, ts: Date.now() }))
      } catch {}

      // Navigate to result
      location.href = `${PAGES.result}?id=${encodeURIComponent(quiz.id)}&score=${score}&total=${total}`
    }
  })

  // Initial render
  renderQuestion()
}

// 6) Result page
function renderResultPage() {
  const id = getParam("id")
  const score = Number(getParam("score") || 0)
  const total = Number(getParam("total") || 0)
  const quiz = getQuiz(id || "")
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  // Elements
  const title = document.querySelector("h1")
  const completionText = byId("completion-text")
  const fill = byId("result-progress-fill")
  const scoreEl = byId("score-value")
  const primary = byId("primary-action")
  const secondary = byId("secondary-action")

  if (quiz && title) {
    title.textContent = quiz.title + " Quiz Results"
  }
  if (completionText) completionText.textContent = pct + "%"
  if (fill) fill.style.width = pct + "%"
  if (scoreEl) scoreEl.textContent = `${score}/${total}`

  // Primary => Review Answers
  if (primary) {
    primary.textContent = "Review Answers"
    primary.addEventListener("click", () => {
      if (quiz) location.href = `${PAGES.review}?id=${encodeURIComponent(quiz.id)}`
      else location.href = PAGES.select
    })
  }

  // Secondary => Take another quiz
  if (secondary) {
    secondary.textContent = "Take Another Quiz"
    secondary.addEventListener("click", () => {
      location.href = PAGES.select
    })
  }
}

// 7) Review page
function renderReviewPage() {
  const id = getParam("id")
  const quiz = getQuiz(id || "")
  const title = byId("review-title")
  const list = byId("review-list")
  const backBtn = byId("back-to-quizzes")

  if (backBtn) {
    backBtn.addEventListener("click", () => (location.href = PAGES.select))
  }

  if (!quiz) {
    if (title) title.textContent = "Quiz not found"
    if (list) {
      list.innerHTML =
        '<li class="text-sm text-neutral-600">We could not find that quiz. Please go back and try again.</li>'
    }
    return
  }

  if (title) title.textContent = "Review Incorrect Answers"

  let attempt = null
  try {
    const raw = sessionStorage.getItem(`quizAttempt:${quiz.id}`)
    attempt = raw ? JSON.parse(raw) : null
  } catch {}

  if (!attempt || !Array.isArray(attempt.answers)) {
    list.innerHTML =
      '<li class="text-sm text-neutral-600">No recent attempt found. Finish the quiz to see review details.</li>'
    return
  }

  const answers = attempt.answers
  const incorrect = quiz.questions
    .map((q, i) => ({ q, idx: i, chosen: answers[i] }))
    .filter(({ q, chosen }) => chosen !== q.answer)

  // If all correct
  if (incorrect.length === 0) {
    list.innerHTML =
      '<li class="text-sm text-neutral-700">Great job! All your answers were correct.</li>'
    return
  }

  // Render incorrect items
  list.innerHTML = ""
  incorrect.forEach(({ q, idx, chosen }) => {
    const li = document.createElement("li")
    li.className = "space-y-2"

    const yourAnswer =
      chosen == null ? "Not answered" : q.options[chosen] ?? "Not answered"
    const correctAnswer = q.options[q.answer]

    li.innerHTML = `
      <h2 class="text-sm font-semibold">Question ${idx + 1}</h2>
      <p class="text-sm text-neutral-900">${escapeHtml(q.question)}</p>
      <p class="text-sm text-neutral-600 mt-2"><span class="font-medium">Your answer:</span> ${escapeHtml(yourAnswer)}</p>
      <p class="text-sm text-neutral-600"><span class="font-medium">Correct answer:</span> ${escapeHtml(correctAnswer)}</p>
    `
    list.appendChild(li)
  })
}
