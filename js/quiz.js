/* ==========================================================================
   SHIKSHA SETU - ASSESSMENT & INTERACTIVE ACTIVITY ENGINE
   ========================================================================== */

const QuizEngine = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  timerInterval: null,
  timeRemaining: 0,
  startTime: 0,

  startQuiz(quizId) {
    const quiz = SHIKSHA_DATA.quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    this.currentQuiz = quiz;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.timeRemaining = quiz.timerSeconds || 300;
    this.startTime = Date.now();

    this.startTimer();
    this.renderQuizContainer();
  },

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      const timerEl = document.getElementById('quiz-timer-display');
      if (timerEl) {
        const mins = Math.floor(this.timeRemaining / 60);
        const secs = this.timeRemaining % 60;
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        alert('Time is up! Submitting quiz automatically.');
        this.submitQuiz();
      }
    }, 1000);
  },

  selectOption(qIndex, optionIndex) {
    this.userAnswers[qIndex] = optionIndex;
    this.renderQuestion(qIndex);
    this.renderQuestionNavGrid();
  },

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestion(this.currentQuestionIndex);
      this.renderQuestionNavGrid();
    }
  },

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuestion(this.currentQuestionIndex);
      this.renderQuestionNavGrid();
    }
  },

  async submitQuiz() {

  // Stop timer
  clearInterval(this.timerInterval);

  if (!this.currentQuiz) {
    console.error('[Quiz] No active quiz.');
    return;
  }

  const total = this.currentQuiz.questions.length;

  let correct = 0;

  // Calculate correct answers
  this.currentQuiz.questions.forEach((q, idx) => {

    if (this.userAnswers[idx] === q.correctIndex) {
      correct++;
    }

  });

  // Calculate percentage
  const percentage =
    total > 0
      ? Math.round((correct / total) * 100)
      : 0;

  // Calculate time taken
  const timeSpentSeconds =
    Math.max(
      0,
      Math.round(
        (Date.now() - this.startTime) / 1000
      )
    );

  const mins =
    Math.floor(timeSpentSeconds / 60);

  const secs =
    timeSpentSeconds % 60;

  const timeTakenStr =
    `${mins}m ${secs}s`;


  // =========================================================
  // SAVE LOCALLY
  // =========================================================

  try {

    ProgressTracker.recordQuizScore(
      this.currentQuiz.id,
      correct,
      total
    );

  } catch (error) {

    console.warn(
      '[Quiz] Local progress save failed:',
      error
    );

  }


  // =========================================================
  // SAVE TO POSTGRESQL / SUPABASE
  // =========================================================

  try {

    if (
      typeof ApiClient !== 'undefined' &&
      ApiClient.isAuthenticated()
    ) {

      const result =
        await ApiClient.quizzes.submitAttempt({

          quiz_key:
            this.currentQuiz.quiz_key ||
            this.currentQuiz.quizKey ||
            this.currentQuiz.id,

          score: correct,

          total: total,

          percentage: percentage,

          time_taken_seconds:
            timeSpentSeconds

        });


      if (!result) {

        console.warn(
          '[Quiz] Server unavailable. ' +
          'Quiz saved locally only.'
        );

      } else if (result._error) {

        console.error(
          '[Quiz] Backend save failed:',
          result.message
        );

      } else {

        console.log(
          '[Quiz] Attempt saved successfully:',
          result
        );


        // Backend awards XP automatically.
        if (result.xp_earned !== undefined) {

          console.log(
            `[Quiz] ${result.xp_earned} XP earned`
          );

        }

      }

    } else {

      console.warn(
        '[Quiz] Student is not authenticated. ' +
        'Attempt saved locally only.'
      );

    }

  } catch (error) {

    console.error(
      '[Quiz] Failed to save attempt:',
      error
    );

  }


  // =========================================================
  // DISPLAY RESULT
  // =========================================================

  this.renderResults(
    correct,
    total,
    timeTakenStr
  );

},

  renderQuizContainer() {
    const main = document.getElementById('view-container');
    if (!main) return;

    const quiz = this.currentQuiz;

    main.innerHTML = `
      <div class="card">
        <div class="quiz-header">
          <div>
            <h2 class="card-title">${quiz.title}</h2>
            <span class="chip chip-primary">${t('nav_quizzes')}</span>
          </div>
          <div class="timer-box">
            ⏱️ <span id="quiz-timer-display">05:00</span>
          </div>
        </div>

        <div id="question-card-body"></div>

        <div class="section-header" style="margin-top: var(--space-lg);">
          <div>
            <button class="btn btn-outline" id="btn-quiz-prev" onclick="QuizEngine.prevQuestion()">${t('prev_lesson')}</button>
            <button class="btn btn-primary" id="btn-quiz-next" onclick="QuizEngine.nextQuestion()">${t('next_lesson')}</button>
          </div>
          <button class="btn btn-secondary" onclick="QuizEngine.submitQuiz()">${t('submit_quiz')}</button>
        </div>

        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-subtle); padding-top: var(--space-md);">
          <div class="form-label">Question Navigator:</div>
          <div class="question-nav-grid" id="question-nav-grid"></div>
        </div>
      </div>
    `;

    this.renderQuestion(0);
    this.renderQuestionNavGrid();
  },

  renderQuestion(index) {
    const qBody = document.getElementById('question-card-body');
    if (!qBody || !this.currentQuiz) return;

    this.currentQuestionIndex = index;
    const q = this.currentQuiz.questions[index];
    const selected = this.userAnswers[index];

    let optionsHtml = '';
    q.options.forEach((opt, oIdx) => {
      const isSelected = selected === oIdx;
      optionsHtml += `
        <div class="quiz-option ${isSelected ? 'selected' : ''}" onclick="QuizEngine.selectOption(${index}, ${oIdx})">
          <span class="q-nav-btn ${isSelected ? 'answered' : ''}">${String.fromCharCode(65 + oIdx)}</span>
          <span>${opt}</span>
        </div>
      `;
    });

    qBody.innerHTML = `
      <div style="margin-bottom: var(--space-md);">
        <span class="chip chip-secondary">Question ${index + 1} of ${this.currentQuiz.questions.length}</span>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-top: var(--space-xs);">${q.question}</h3>
      </div>
      <div>${optionsHtml}</div>
    `;

    // Button states
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) btnNext.disabled = index === this.currentQuiz.questions.length - 1;
  },

  renderQuestionNavGrid() {
    const grid = document.getElementById('question-nav-grid');
    if (!grid || !this.currentQuiz) return;

    grid.innerHTML = this.currentQuiz.questions.map((_, idx) => {
      const isAnswered = this.userAnswers[idx] !== undefined;
      const isCurrent = this.currentQuestionIndex === idx;
      return `
        <button class="q-nav-btn ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}" onclick="QuizEngine.renderQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    }).join('');
  },

  renderResults(correct, total, timeTakenStr) {
    const main = document.getElementById('view-container');
    if (!main) return;

    const percentage = Math.round((correct / total) * 100);
    const wrong = total - correct;

    let reviewHtml = '';
    this.currentQuiz.questions.forEach((q, idx) => {
      const userAns = this.userAnswers[idx];
      const isCorrect = userAns === q.correctIndex;
      reviewHtml += `
        <div class="card" style="margin-bottom: var(--space-md); border-left: 4px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
          <div style="font-weight: 700;">Q${idx + 1}: ${q.question}</div>
          <div style="margin-top: var(--space-xs); font-size: 0.95rem;">
            Your Answer: <strong>${userAns !== undefined ? q.options[userAns] : 'Not Answered'}</strong> ${isCorrect ? '✅' : '❌'}
          </div>
          ${!isCorrect ? `<div style="color: var(--color-success); font-size: 0.95rem;">Correct Answer: <strong>${q.options[q.correctIndex]}</strong></div>` : ''}
          <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px; background: var(--bg-subtle); padding: 6px 10px; border-radius: 4px;">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    main.innerHTML = `
      <div class="card" style="text-align: center; margin-bottom: var(--space-lg);">
        <h2 class="card-title" style="font-size: 1.8rem; margin-bottom: var(--space-sm);">${t('quiz_results')}</h2>
        <div style="font-size: 3rem; font-weight: 800; color: ${percentage >= 60 ? 'var(--color-success)' : 'var(--color-danger)'};">
          ${percentage}%
        </div>
        <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: var(--space-lg);">
          ${percentage >= 60 ? '🎉 Outstanding Performance! Keep it up!' : '📚 Good attempt! Review the concepts and try again.'}
        </p>

        <div class="grid-4" style="margin-bottom: var(--space-lg);">
          <div class="card" style="padding: var(--space-md);">
            <div style="font-size: 0.85rem; color: var(--text-muted);">${t('score')}</div>
            <div style="font-size: 1.5rem; font-weight: 700;">${correct} / ${total}</div>
          </div>
          <div class="card" style="padding: var(--space-md);">
            <div style="font-size: 0.85rem; color: var(--text-muted);">${t('correct_answers')}</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-success);">${correct}</div>
          </div>
          <div class="card" style="padding: var(--space-md);">
            <div style="font-size: 0.85rem; color: var(--text-muted);">${t('wrong_answers')}</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-danger);">${wrong}</div>
          </div>
          <div class="card" style="padding: var(--space-md);">
            <div style="font-size: 0.85rem; color: var(--text-muted);">${t('time_taken')}</div>
            <div style="font-size: 1.5rem; font-weight: 700;">${timeTakenStr}</div>
          </div>
        </div>

        <div>
          <button class="btn btn-primary" onclick="QuizEngine.startQuiz('${this.currentQuiz.id}')">${t('retry_quiz')}</button>
          <button class="btn btn-outline" onclick="AppRouter.navigate('quizzes')">Back to Quizzes</button>
        </div>
      </div>

      <h3 class="section-title" style="margin-bottom: var(--space-md);">Detailed Question Review</h3>
      ${reviewHtml}
    `;
  },

  // --- Embedded Lesson Activity Renderers ---
  renderActivity(act, containerId) {
    const el = document.getElementById(containerId);
    if (!el || !act) return;

    if (act.type === 'mcq') {
      el.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--color-primary);">
          <div class="chip chip-primary" style="margin-bottom: var(--space-xs);">Interactive Activity (MCQ)</div>
          <div style="font-weight: 700; margin-bottom: var(--space-md);">${act.question}</div>
          <div id="act-options">
            ${act.options.map((opt, idx) => `
              <div class="quiz-option" onclick="QuizEngine.checkActivityMcq(${idx}, ${act.correctIndex}, '${act.explanation.replace(/'/g, "\\'")}')">
                ${opt}
              </div>
            `).join('')}
          </div>
          <div id="act-feedback" style="margin-top: var(--space-md);"></div>
        </div>
      `;
    } else if (act.type === 'true_false') {
      el.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--color-secondary);">
          <div class="chip chip-secondary" style="margin-bottom: var(--space-xs);">True or False</div>
          <div style="font-weight: 700; margin-bottom: var(--space-md);">${act.question}</div>
          <div style="display: flex; gap: var(--space-md);">
            <button class="btn btn-outline" onclick="QuizEngine.checkActivityTF(true, ${act.correct}, '${act.explanation.replace(/'/g, "\\'")}')">True</button>
            <button class="btn btn-outline" onclick="QuizEngine.checkActivityTF(false, ${act.correct}, '${act.explanation.replace(/'/g, "\\'")}')">False</button>
          </div>
          <div id="act-feedback" style="margin-top: var(--space-md);"></div>
        </div>
      `;
    } else if (act.type === 'flashcards') {
      let cardsHtml = act.cards.map((card, idx) => `
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <div class="chip chip-accent">Click to Flip</div>
              <div style="font-size: 1.1rem; font-weight: 700; margin-top: var(--space-sm);">${card.front}</div>
            </div>
            <div class="flashcard-back">
              <div style="font-size: 1.1rem; font-weight: 700;">${card.back}</div>
            </div>
          </div>
        </div>
      `).join('');

      el.innerHTML = `
        <div class="card">
          <div class="chip chip-accent" style="margin-bottom: var(--space-sm);">Interactive Flashcards</div>
          <div class="grid-2">${cardsHtml}</div>
        </div>
      `;
    }
  },

  checkActivityMcq(selectedIdx, correctIdx, explanation) {
    const feedback = document.getElementById('act-feedback');
    if (!feedback) return;

    if (selectedIdx === correctIdx) {
      feedback.innerHTML = `<div style="color: var(--color-success); font-weight: 700;">✅ Correct! ${explanation}</div>`;
      ProgressTracker.addXP(10);
    } else {
      feedback.innerHTML = `<div style="color: var(--color-danger); font-weight: 700;">❌ Incorrect. Try again! ${explanation}</div>`;
    }
  },

  checkActivityTF(userVal, correctVal, explanation) {
    const feedback = document.getElementById('act-feedback');
    if (!feedback) return;

    if (userVal === correctVal) {
      feedback.innerHTML = `<div style="color: var(--color-success); font-weight: 700;">✅ Correct! ${explanation}</div>`;
      ProgressTracker.addXP(10);
    } else {
      feedback.innerHTML = `<div style="color: var(--color-danger); font-weight: 700;">❌ Incorrect. Try again! ${explanation}</div>`;
    }
  }
};
