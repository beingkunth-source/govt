/* ==========================================================================
   SHIKSHA SETU - STUDENT PROGRESS & GAMIFICATION TRACKER
   ========================================================================== */

const ProgressTracker = {

  // =========================================================================
  // STUDENT PROFILE
  // =========================================================================

  profile: {
    name: 'Aarav Kumar',
    selectedClass: 6,
    avatar: '👨‍🎓',
    school: 'Zilla Parishad Govt High School'
  },

  xp: 150,
  streak: 3,
  lastActiveDate: null,

  // Completed lesson IDs
  completedLessons: [],

  // Quiz records:
  // { quizId, score, total, percentage, date }
  quizScores: [],

  // Unlocked badge IDs
  unlockedBadges: [],


  // =========================================================================
  // INITIALIZE
  // =========================================================================

  init() {

    this.loadState();

    this.checkStreak();

  },


  // =========================================================================
  // LOAD SAVED STATE
  // =========================================================================

  loadState() {

    const saved =
      localStorage.getItem(
        'shiksha_student_state'
      );


    if (saved) {

      try {

        const data =
          JSON.parse(saved);


        this.profile =
          data.profile ||
          this.profile;


        this.xp =
          data.xp ?? 0;


        this.streak =
          data.streak ?? 1;


        this.lastActiveDate =
          data.lastActiveDate ||
          null;


        this.completedLessons =
          Array.isArray(data.completedLessons)
            ? data.completedLessons
            : [];


        this.quizScores =
          Array.isArray(data.quizScores)
            ? data.quizScores
            : [];


        this.unlockedBadges =
          Array.isArray(data.unlockedBadges)
            ? data.unlockedBadges
            : [];


      } catch (error) {

        console.error(
          'Error loading progress state:',
          error
        );

      }

    } else {

      // Initial demo/default progress
      this.completedLessons = [
        'math_6_c1_l1'
      ];

      this.unlockedBadges = [
        'b_first'
      ];

      this.saveState();

    }

  },


  // =========================================================================
  // SAVE STATE
  // =========================================================================

  saveState() {

    const data = {

      profile:
        this.profile,

      xp:
        this.xp,

      streak:
        this.streak,

      lastActiveDate:
        this.lastActiveDate,

      completedLessons:
        this.completedLessons,

      quizScores:
        this.quizScores,

      unlockedBadges:
        this.unlockedBadges

    };


    localStorage.setItem(
      'shiksha_student_state',
      JSON.stringify(data)
    );

  },


  // =========================================================================
  // STREAK
  // =========================================================================

  checkStreak() {

    const today =
      new Date()
        .toISOString()
        .split('T')[0];


    if (!this.lastActiveDate) {

      this.lastActiveDate =
        today;

      this.streak = 1;

    }

    else if (
      this.lastActiveDate !== today
    ) {

      const last =
        new Date(
          this.lastActiveDate
        );


      const current =
        new Date(today);


      const difference =
        Math.round(
          (current - last) /
          (1000 * 60 * 60 * 24)
        );


      if (difference === 1) {

        this.streak += 1;

      }

      else if (difference > 1) {

        this.streak = 1;

      }


      this.lastActiveDate =
        today;

    }


    // Unlock streak badge
    if (
      this.streak >= 3 &&
      !this.unlockedBadges.includes(
        'b_streak_3'
      )
    ) {

      this.unlockBadge(
        'b_streak_3'
      );

    }


    this.saveState();

  },


  // =========================================================================
  // MARK LESSON COMPLETE
  // =========================================================================

  markLessonComplete(lessonId) {

    if (
      !this.completedLessons.includes(
        lessonId
      )
    ) {

      this.completedLessons.push(
        lessonId
      );


      // 50 XP per lesson
      this.addXP(50);


      // First lesson badge
      if (
        this.completedLessons.length === 1 &&
        !this.unlockedBadges.includes(
          'b_first'
        )
      ) {

        this.unlockBadge(
          'b_first'
        );

      }


      // Count completed Math lessons
      const mathCompleted =
        this.completedLessons.filter(
          id =>
            String(id).startsWith(
              'math'
            )
        ).length;


      // Math achievement
      if (
        mathCompleted >= 3 &&
        !this.unlockedBadges.includes(
          'b_math_star'
        )
      ) {

        this.unlockBadge(
          'b_math_star'
        );

      }


      this.saveState();


      // Offline sync
      if (
        typeof SyncManager !==
        'undefined'
      ) {

        SyncManager.enqueue({

          type:
            'LESSON_COMPLETE',

          payload: {

            lesson_key:
              lessonId,

            xp_earned:
              50

          }

        });

      }


      return true;

    }


    return false;

  },


  // =========================================================================
  // CHECK LESSON COMPLETION
  // =========================================================================

  isLessonCompleted(lessonId) {

    return this.completedLessons.includes(
      lessonId
    );

  },


  // =========================================================================
  // RECORD QUIZ SCORE
  // =========================================================================

  recordQuizScore(
    quizId,
    score,
    total
  ) {

    const percentage =
      total > 0
        ? Math.round(
            (score / total) * 100
          )
        : 0;


    const record = {

      quizId:
        quizId,

      score:
        score,

      total:
        total,

      percentage:
        percentage,

      date:
        new Date()
          .toLocaleDateString()

    };


    // Save attempt locally
    this.quizScores.push(
      record
    );


    // 20 XP for each correct answer
    this.addXP(
      score * 20
    );


    // Perfect quiz badge
    if (
      percentage === 100 &&
      !this.unlockedBadges.includes(
        'b_quiz_master'
      )
    ) {

      this.unlockBadge(
        'b_quiz_master'
      );

    }


    this.saveState();


    // Offline synchronization
    if (
      typeof SyncManager !==
      'undefined'
    ) {

      SyncManager.enqueue({

        type:
          'QUIZ_ATTEMPT',

        payload: {

          quiz_key:
            quizId,

          score:
            score,

          total:
            total,

          percentage:
            percentage,

          date:
            record.date

        }

      });

    }

  },


  // =========================================================================
  // ADD XP
  // =========================================================================

  addXP(amount) {

    const xpAmount =
      Number(amount) || 0;


    this.xp +=
      xpAmount;


    this.saveState();


    if (
      typeof SyncManager !==
      'undefined'
    ) {

      SyncManager.enqueue({

        type:
          'XP_ADD',

        payload: {

          amount:
            xpAmount

        }

      });

    }

  },


  // =========================================================================
  // UNLOCK BADGE
  // =========================================================================

  unlockBadge(badgeId) {

    if (
      !this.unlockedBadges.includes(
        badgeId
      )
    ) {

      this.unlockedBadges.push(
        badgeId
      );


      this.saveState();


      if (
        typeof SyncManager !==
        'undefined'
      ) {

        SyncManager.enqueue({

          type:
            'BADGE_UNLOCK',

          payload: {

            badge_key:
              badgeId

          }

        });

      }

    }

  },


  // =========================================================================
  // GET UNIQUE COMPLETED QUIZ IDS
  // =========================================================================

  getCompletedQuizIds() {

    return new Set(

      this.quizScores

        .map(
          score =>
            score.quizId ||
            score.quiz_key
        )

        .filter(Boolean)

        .map(String)

    );

  },


  // =========================================================================
  // GET CLASS / SUBJECT PROGRESS
  //
  // Progress now includes:
  //
  // 1. Completed lessons
  // 2. Completed quizzes
  //
  // Example:
  //
  // 2 lessons + 1 quiz = 3 total activities
  //
  // Student completes:
  // 1 lesson + 1 quiz
  //
  // Progress = 2 / 3 = 67%
  // =========================================================================

  getClassProgress(
    classId,
    subjectId = null
  ) {

    const selectedClass =
      Number(classId);


    const completedQuizIds =
      this.getCompletedQuizIds();


    // -----------------------------------------------------------------------
    // ONE SUBJECT
    // -----------------------------------------------------------------------

    if (subjectId) {

      let totalLessons = 0;

      let completedLessonCount = 0;


      const chapters =
        SHIKSHA_DATA
          .curriculum?.[selectedClass]
          ?.[subjectId] || [];


      // Count lessons
      chapters.forEach(
        chapter => {

          const lessons =
            chapter.lessons || [];


          lessons.forEach(
            lesson => {

              totalLessons++;


              if (
                this.isLessonCompleted(
                  lesson.id
                )
              ) {

                completedLessonCount++;

              }

            }
          );

        }
      );


      // Find quizzes for selected class + subject
      const subjectQuizzes =
        (
          SHIKSHA_DATA.quizzes ||
          []
        ).filter(
          quiz =>

            Number(
              quiz.classId
            ) === selectedClass &&

            quiz.subjectId ===
              subjectId
        );


      // Count completed quizzes
      const completedQuizCount =
        subjectQuizzes.filter(
          quiz =>
            completedQuizIds.has(
              String(quiz.id)
            )
        ).length;


      // Total activities
      const totalActivities =
        totalLessons +
        subjectQuizzes.length;


      // Completed activities
      const completedActivities =
        completedLessonCount +
        completedQuizCount;


      if (
        totalActivities === 0
      ) {

        return 0;

      }


      return Math.round(

        (
          completedActivities /
          totalActivities
        ) * 100

      );

    }


    // -----------------------------------------------------------------------
    // WHOLE CLASS
    // -----------------------------------------------------------------------

    let totalActivities = 0;

    let completedActivities = 0;


    const subjects =
      SHIKSHA_DATA.subjects ||
      [];


    subjects.forEach(
      subject => {

        // -------------------------------------------------------
        // Lessons
        // -------------------------------------------------------

        const chapters =
          SHIKSHA_DATA
            .curriculum?.[selectedClass]
            ?.[subject.id] || [];


        chapters.forEach(
          chapter => {

            const lessons =
              chapter.lessons || [];


            lessons.forEach(
              lesson => {

                totalActivities++;


                if (
                  this.isLessonCompleted(
                    lesson.id
                  )
                ) {

                  completedActivities++;

                }

              }
            );

          }
        );


        // -------------------------------------------------------
        // Quizzes
        // -------------------------------------------------------

        const quizzes =
          (
            SHIKSHA_DATA.quizzes ||
            []
          ).filter(
            quiz =>

              Number(
                quiz.classId
              ) === selectedClass &&

              quiz.subjectId ===
                subject.id
          );


        totalActivities +=
          quizzes.length;


        quizzes.forEach(
          quiz => {

            if (
              completedQuizIds.has(
                String(quiz.id)
              )
            ) {

              completedActivities++;

            }

          }
        );

      }
    );


    if (
      totalActivities === 0
    ) {

      return 0;

    }


    return Math.round(

      (
        completedActivities /
        totalActivities
      ) * 100

    );

  }

};

if (typeof window !== 'undefined') {
  window.ProgressTracker = ProgressTracker;
}