/* ==========================================================================
   SHIKSHA SETU - API CLIENT
   Frontend HTTP Layer
   ========================================================================== */

const ApiClient = {

  // =========================================================
  // CONFIGURATION
  // =========================================================

  BASE_URL: (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http')) ? `${window.location.origin}/api/v1` : 'http://localhost:5000/api/v1',

  TOKEN_KEY: 'shiksha_jwt',


  // =========================================================
  // TOKEN MANAGEMENT
  // =========================================================

  getToken() {

    return localStorage.getItem(
      this.TOKEN_KEY
    );

  },


  setToken(token) {

    if (token) {

      localStorage.setItem(
        this.TOKEN_KEY,
        token
      );

    }

  },


  clearToken() {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

  },


  isAuthenticated() {

    return !!this.getToken();

  },


  // =========================================================
  // CORE API REQUEST
  // =========================================================

  async request(
    method,
    endpoint,
    body = null
  ) {

    const url =
      `${this.BASE_URL}${endpoint}`;

    const token =
      this.getToken();


    const headers = {

      'Content-Type':
        'application/json'

    };


    if (token) {

      headers.Authorization =
        `Bearer ${token}`;

    }


    const options = {

      method:
        method.toUpperCase(),

      headers

    };


    if (
      body !== null &&
      method.toUpperCase() !== 'GET'
    ) {

      options.body =
        JSON.stringify(body);

    }


    try {

      const response =
        await fetch(
          url,
          options
        );


      // -----------------------------------------
      // Parse JSON safely
      // -----------------------------------------

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};

      }


      // -----------------------------------------
      // Unauthorized
      // -----------------------------------------

      if (response.status === 401) {

        // Don't automatically treat login failure
        // as an offline/network error.

        if (
          endpoint !== '/auth/login'
        ) {

          this.clearToken();

        }


        return {

          _error: true,

          status: 401,

          message:
            data?.error ||
            data?.message ||
            'Invalid email or password.'

        };

      }


      // -----------------------------------------
      // Other API errors
      // -----------------------------------------

      if (!response.ok) {

        console.warn(
          `[ApiClient] ${method} ${endpoint} → ${response.status}`,
          data
        );


        return {

          _error: true,

          status:
            response.status,

          message:
            data?.error ||
            data?.message ||
            'Request failed.'

        };

      }


      return data;

    } catch (error) {

      console.error(
        `[ApiClient] Network error on ${method} ${endpoint}:`,
        error
      );


      return {

        _error: true,

        networkError: true,

        status: 0,

        message:
          'Unable to connect to the Shiksha Setu server.'

      };

    }

  },


  // =========================================================
  // AUTHENTICATION
  // =========================================================

  auth: {


    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------

    async login(
      email,
      password,
      role
    ) {

      const result =
        await ApiClient.request(
          'POST',
          '/auth/login',
          {

            email:
              email.trim(),

            password,

            role

          }
        );


      if (
        result &&
        !result._error &&
        result.token
      ) {

        ApiClient.setToken(
          result.token
        );

      }


      return result;

    },


    // ---------------------------------------------------------
    // REGISTER STUDENT
    // ---------------------------------------------------------

    async registerStudent(data) {

      const result =
        await ApiClient.request(
          'POST',
          '/auth/register/student',
          data
        );


      if (
        result &&
        !result._error &&
        result.token
      ) {

        ApiClient.setToken(
          result.token
        );

      }


      return result;

    },


    // ---------------------------------------------------------
    // REGISTER TEACHER
    // ---------------------------------------------------------

    async registerTeacher(data) {

      const result =
        await ApiClient.request(
          'POST',
          '/auth/register/teacher',
          data
        );


      if (
        result &&
        !result._error &&
        result.token
      ) {

        ApiClient.setToken(
          result.token
        );

      }


      return result;

    },


    // ---------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------

    async logout() {

      const result =
        await ApiClient.request(
          'POST',
          '/auth/logout'
        );


      ApiClient.clearToken();


      return result;

    },


    // ---------------------------------------------------------
    // CURRENT USER
    // ---------------------------------------------------------

    async me() {

      return ApiClient.request(
        'GET',
        '/auth/me'
      );

    }

  },


  // =========================================================
  // STUDENTS
  // =========================================================

  students: {


    async getProfile(id) {

      return ApiClient.request(
        'GET',
        `/students/${id}`
      );

    },


    async updateProfile(
      id,
      data
    ) {

      return ApiClient.request(
        'PATCH',
        `/students/${id}`,
        data
      );

    },


    async getProgress(id) {

      return ApiClient.request(
        'GET',
        `/students/${id}/progress`
      );

    },


    async getAchievements(id) {

      return ApiClient.request(
        'GET',
        `/students/${id}/achievements`
      );

    },


    async list(params = {}) {

      const qs =
        new URLSearchParams(
          params
        ).toString();


      return ApiClient.request(
        'GET',
        `/students${qs ? '?' + qs : ''}`
      );

    }

  },


  // =========================================================
  // PROGRESS
  // =========================================================

  progress: {


    async markLessonComplete(
      lessonKey,
      xpEarned = 50
    ) {

      return ApiClient.request(
        'POST',
        '/progress/lesson-complete',
        {

          lesson_key:
            lessonKey,

          xp_earned:
            xpEarned

        }
      );

    },


    async getCompletedLessons() {

      return ApiClient.request(
        'GET',
        '/progress/completed-lessons'
      );

    },


    async addXP(amount) {

      return ApiClient.request(
        'POST',
        '/progress/add-xp',
        {
          amount
        }
      );

    },


    async updateStreak(
      streak,
      lastActiveDate
    ) {

      return ApiClient.request(
        'PATCH',
        '/progress/streak',
        {

          streak,

          last_active_date:
            lastActiveDate

        }
      );

    }

  },


  // =========================================================
  // QUIZZES
  // =========================================================

  quizzes: {


    async getAll() {

      return ApiClient.request(
        'GET',
        '/quizzes'
      );

    },


    async getQuiz(quizKey) {

      return ApiClient.request(
        'GET',
        `/quizzes/${quizKey}`
      );

    },


    async submitAttempt(data) {

      return ApiClient.request(
        'POST',
        '/quizzes/attempt',
        data
      );

    },


    async getAttempts() {

      return ApiClient.request(
        'GET',
        '/quizzes/attempts'
      );

    }

  },


  // =========================================================
  // BADGES
  // =========================================================

  badges: {


    async getAll() {

      return ApiClient.request(
        'GET',
        '/badges'
      );

    },


    async getMine() {

      return ApiClient.request(
        'GET',
        '/badges/mine'
      );

    },


    async unlock(badgeKey) {

      return ApiClient.request(
        'POST',
        '/badges/unlock',
        {

          badge_key:
            badgeKey

        }
      );

    }

  },


  // =========================================================
  // TEACHERS
  // =========================================================

  teachers: {


    async getDashboard() {

      return ApiClient.request(
        'GET',
        '/teachers/dashboard'
      );

    },


    async createClass(data) {

      return ApiClient.request(
        'POST',
        '/teachers/classes',
        data
      );

    },


    async createSubject(data) {

      return ApiClient.request(
        'POST',
        '/teachers/subjects',
        data
      );

    },


    async createLesson(data) {

      return ApiClient.request(
        'POST',
        '/teachers/lessons',
        data
      );

    },


    async updateLesson(
      id,
      data
    ) {

      return ApiClient.request(
        'PATCH',
        `/teachers/lessons/${id}`,
        data
      );

    },


    async createQuiz(data) {

      return ApiClient.request(
        'POST',
        '/teachers/quizzes',
        data
      );

    },


    async updateQuiz(
      id,
      data
    ) {

      return ApiClient.request(
        'PATCH',
        `/teachers/quizzes/${id}`,
        data
      );

    },


    async createAssignment(data) {

      return ApiClient.request(
        'POST',
        '/teachers/assignments',
        data
      );

    }

  },


  // =========================================================
  // LIBRARY
  // =========================================================

  library: {


    async getAll(params = {}) {

      const qs =
        new URLSearchParams(
          params
        ).toString();


      return ApiClient.request(
        'GET',
        `/library${qs ? '?' + qs : ''}`
      );

    },


    async add(data) {

      return ApiClient.request(
        'POST',
        '/library',
        data
      );

    },


    async update(
      id,
      data
    ) {

      return ApiClient.request(
        'PATCH',
        `/library/${id}`,
        data
      );

    },


    async remove(id) {

      return ApiClient.request(
        'DELETE',
        `/library/${id}`
      );

    }

  },


  // =========================================================
  // SYNC
  // =========================================================

  sync: {


    async push(
      operations,
      isMigration = false
    ) {

      return ApiClient.request(
        'POST',
        '/sync/push',
        {

          operations,

          is_migration:
            isMigration

        }
      );

    },


    async pull() {

      return ApiClient.request(
        'GET',
        '/sync/pull'
      );

    }

  },


  // =========================================================
  // HEALTH CHECK
  // =========================================================

};

if (typeof window !== 'undefined') {
  window.ApiClient = ApiClient;
}