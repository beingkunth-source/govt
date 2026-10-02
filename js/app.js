/* ==========================================================================
   SHIKSHA SETU - APPLICATION ROUTER & VIEW CONTROLLER
   ========================================================================== */

const AppRouter = {
  currentRoute: 'home',
  routeParams: {},

  // Authentication Session State
auth: {
 isLoggedIn: false,
  role: null,
  name: '',
  selectedClass: null,
  userId: null,
  email: ''
},

  init() {
    this.loadAuthSession();
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
    window.addEventListener('languageChanged', () => {
      this.updateHeaderAuthUI();
      this.handleRoute();
    });

    this.updateOnlineStatus();
    this.updateHeaderAuthUI();
    this.handleRoute();
  },

  loadAuthSession() {
    const saved = localStorage.getItem('shiksha_auth_session');
    if (saved) {
      try {
        this.auth = JSON.parse(saved);
      } catch(e) {
        console.error('Failed to parse auth session:', e);
      }
    }
  },

  saveAuthSession() {
    localStorage.setItem('shiksha_auth_session', JSON.stringify(this.auth));
    this.updateHeaderAuthUI();
  },

  updateHeaderAuthUI() {
    const container = document.getElementById('header-auth-controls');
    const isLoggedIn = this.auth.isLoggedIn;
    const isTeacher = isLoggedIn && this.auth.role === 'teacher';

    // 1. Toggle Login nav item in sidebar: Hide when logged in, show when logged out
    document.querySelectorAll('.login-nav-item').forEach(el => {
      el.style.display = isLoggedIn ? 'none' : '';
    });

    // 2. Toggle Teacher vs Student nav links strictly based on authenticated role
    document.querySelectorAll('.teacher-nav').forEach(el => {
      el.style.display = isTeacher ? '' : 'none';
    });
    document.querySelectorAll('.student-nav').forEach(el => {
      el.style.display = (isLoggedIn && !isTeacher) ? '' : 'none';
    });

    if (!container) return;

    if (isLoggedIn) {
      const roleBadge = isTeacher ? '👨‍🏫 Teacher' : '👨‍🎓 Student';
      container.innerHTML = `
        <div class="chip chip-primary" style="font-size: 0.85rem; padding: 4px 10px;">
          ${roleBadge}: ${this.auth.name} (${isTeacher ? 'Headmaster' : 'Class ' + this.auth.selectedClass})
        </div>
        <button class="btn btn-outline btn-sm" onclick="AppRouter.logout()" title="Logout">
          🚪 <span data-i18n="nav_logout">${t('nav_logout')}</span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('login')" title="Login">
          🔑 <span data-i18n="nav_login">${t('nav_login')}</span>
        </button>
      `;
    }
  },

  async setRole(newRole) {
  try {
    // Logout from backend only if a JWT token exists
    if (
      typeof ApiClient !== 'undefined' &&
      ApiClient.isAuthenticated()
    ) {
      await ApiClient.auth.logout();
    }
  } catch (error) {
    console.warn('Backend logout failed:', error);
  }

  // Clear JWT
  if (typeof ApiClient !== 'undefined') {
    ApiClient.clearToken();
  }

  // Clear saved authentication
  localStorage.removeItem('shiksha_auth_session');
  localStorage.removeItem('shiksha_jwt');

  // Reset AppRouter authentication
  this.auth = {
    isLoggedIn: false,
    role: null,
    name: '',
    selectedClass: null,
    userId: null,
    email: ''
  };

  // Open login page
  window.location.hash = '#login';

  // Refresh UI
  window.location.reload();
},

  async loginAsStudent(email, password) {
  try {
  async loginAsStudent(email, password) {
    try {
      let result = null;
      try {
        if (typeof ApiClient !== 'undefined') {
          result = await ApiClient.auth.login(email.trim(), password, 'student');
        }
      } catch (err) {
        console.warn('API connection unavailable, engaging client fallback:', err);
      }

      if (result && !result._error && result.token && result.user) {
        ApiClient.setToken(result.token);
        const user = result.user || {};
        if (user.role && user.role !== 'student') {
          ApiClient.clearToken();
          alert('This account is not a student account.');
          return;
        }
        const studentName = user.name || user.full_name || 'Aarav Sharma';
        const selectedClass = parseInt(user.class_id || user.classId || user.class_number || 8) || 8;

        this.auth = {
          isLoggedIn: true,
          role: 'student',
          name: studentName,
          selectedClass,
          userId: user.id || 'student_1',
          email: user.email || email
        };
      } else {
        const namePart = (email || 'aarav').split('@')[0];
        const studentName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Aarav Sharma';
        this.auth = {
          isLoggedIn: true,
          role: 'student',
          name: studentName === 'Aarav' ? 'Aarav Sharma' : studentName,
          selectedClass: 8,
          userId: 'student_demo_1',
          email: email || 'aarav@student.edu'
        };
      }

      ProgressTracker.profile.name = this.auth.name;
      ProgressTracker.profile.selectedClass = this.auth.selectedClass;
      ProgressTracker.saveState();

      this.saveAuthSession();
      this.navigate('dashboard');

    } catch (error) {
      console.error('Student login error:', error);
      this.auth = {
        isLoggedIn: true,
        role: 'student',
        name: 'Aarav Sharma',
        selectedClass: 8,
        userId: 'student_demo_1',
        email: email || 'aarav@student.edu'
      };
      this.saveAuthSession();
      this.navigate('dashboard');
    }
  },

  async quickDemoStudent() {
    this.auth = {
      isLoggedIn: true,
      role: 'student',
      name: 'Aarav Sharma',
      selectedClass: 8,
      userId: 'student_demo_1',
      email: 'aarav@student.edu'
    };
    ProgressTracker.profile.name = 'Aarav Sharma';
    ProgressTracker.profile.selectedClass = 8;
    ProgressTracker.saveState();
    this.saveAuthSession();
    this.navigate('dashboard');
  },

  async loginAsTeacher(email, password) {
    try {
      let result = null;
      try {
        if (typeof ApiClient !== 'undefined') {
          result = await ApiClient.auth.login(email.trim(), password, 'teacher');
        }
      } catch (err) {
        console.warn('API connection unavailable, engaging teacher fallback:', err);
      }

      if (result && !result._error && result.token && result.user) {
        ApiClient.setToken(result.token);
        const user = result.user || {};
        if (user.role && user.role !== 'teacher') {
          ApiClient.clearToken();
          alert('This account is not a teacher account.');
          return;
        }
        const teacherName = user.name || user.full_name || 'Sunita Patil';

        this.auth = {
          isLoggedIn: true,
          role: 'teacher',
          name: teacherName,
          selectedClass: 8,
          userId: user.id || 'teacher_1',
          email: user.email || email
        };
      } else {
        const namePart = (email || 'spatil').split('@')[0];
        const teacherName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Sunita Patil';
        this.auth = {
          isLoggedIn: true,
          role: 'teacher',
          name: teacherName === 'Spatil' ? 'Sunita Patil' : teacherName,
          selectedClass: 8,
          userId: 'teacher_demo_1',
          email: email || 'spatil@school.edu'
        };
      }

      this.saveAuthSession();
      this.navigate('teacher');

    } catch (error) {
      console.error('Teacher login error:', error);
      this.auth = {
        isLoggedIn: true,
        role: 'teacher',
        name: 'Sunita Patil',
        selectedClass: 8,
        userId: 'teacher_demo_1',
        email: email || 'spatil@school.edu'
      };
      this.saveAuthSession();
      this.navigate('teacher');
    }
  },

  async quickDemoTeacher() {
    this.auth = {
      isLoggedIn: true,
      role: 'teacher',
      name: 'Sunita Patil',
      selectedClass: 8,
      userId: 'teacher_demo_1',
      email: 'spatil@school.edu'
    };
    this.saveAuthSession();
    this.navigate('teacher');
  },
      alert('No authentication token received.');
      return;
    }

    const user = result.user;

    this.auth = {
      isLoggedIn: true,
      role: 'teacher',
      name: user.name,
      selectedClass: null,
      userId: user.id,
      email: user.email
    };

    localStorage.setItem(
      'shiksha_auth_session',
      JSON.stringify(this.auth)
    );

    window.location.hash = '#teacher';

  } catch (error) {

    console.error(
      'Quick Demo Teacher Login Error:',
      error
    );

    alert('Quick Demo teacher login failed.');
  }
},

  logout() {
    try {
      if (typeof ApiClient !== 'undefined') {
        ApiClient.clearToken();
        if (navigator.onLine && ApiClient.auth) {
          ApiClient.auth.logout().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Logout API cleanup error:', e);
    }

    this.auth = {
      isLoggedIn: false,
      role: null,
      name: '',
      selectedClass: null,
      userId: null,
      email: ''
    };

    localStorage.removeItem('shiksha_auth_session');
    localStorage.removeItem('shiksha_jwt');

    this.updateHeaderAuthUI();
    window.location.hash = '#login';
    this.handleRoute();
  },

  navigate(routeStr) {
    window.location.hash = routeStr;
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const parts = hash.split('/');
    this.currentRoute = parts[0] || 'home';
    
    // Update active nav link styling
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${this.currentRoute}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Make sure header & sidebar role visibility is up-to-date
    this.updateHeaderAuthUI();

    const main = document.getElementById('view-container');
    if (!main) return;

    // Scroll back to top on view change
    window.scrollTo(0, 0);

    // Dynamic Route Redirection if logged out or role unauthorized
    const teacherOnlyRoutes = ['teacher', 'classes-manage', 'upload-center', 'builder', 'assign', 'preview'];

    if (!this.auth.isLoggedIn && !['home', 'login', 'register'].includes(this.currentRoute)) {
      this.currentRoute = 'login';
    } else if (this.auth.isLoggedIn && this.auth.role === 'student' && teacherOnlyRoutes.includes(this.currentRoute)) {
      alert('Access Denied: Teacher portal is restricted to teachers only.');
      this.currentRoute = 'dashboard';
      window.location.hash = '#dashboard';
    } else if (this.auth.isLoggedIn && this.auth.role === 'teacher' && this.currentRoute === 'dashboard') {
      this.currentRoute = 'teacher';
      window.location.hash = '#teacher';
    }

    switch (this.currentRoute) {
    case 'login':
    this.renderLogin(main);
    break;
    case 'register':
    this.renderRegister(main);
    break;
    case 'teacher':
    this.renderTeacherDashboard(main);
    break;
      case 'classes-manage':
        this.renderClassesManage(main);
        break;
      case 'upload-center':
        this.renderUploadCenter(main);
        break;
      case 'builder':
        this.renderBuilder(main, parts[1]);
        break;
      case 'assign':
        this.renderAssign(main, parts[1]);
        break;
      case 'preview':
        this.renderPreview(main, parts[1]);
        break;
      case 'home':
        this.renderHome(main);
        break;
      case 'dashboard':
        this.renderDashboard(main);
        break;
      case 'classes':
        this.renderClasses(main, parts[1]);
        break;
      case 'subject':
        this.renderSubject(main, parseInt(parts[1] || 6), parts[2] || 'math');
        break;
      case 'lesson':
        this.renderLesson(main, parts[1] || 'math_6_c1_l1');
        break;
      case 'quizzes':
        this.renderQuizzes(main);
        break;
      case 'library':
        this.renderLibrary(main);
        break;
      case 'worksheet':
        this.renderWorksheet(main, parts[1] || 'ws_math_6_1');
        break;
      case 'progress':
        this.renderProgress(main);
        break;
      case 'achievements':
        this.renderAchievements(main);
        break;
      case 'certificate':
        this.renderCertificate(main);
        break;
      case 'leaderboard':
        this.renderLeaderboard(main);
        break;
      case 'doubt-solver':
        this.renderDoubtSolver(main);
        break;
      case 'lab':
        this.renderScienceLab(main);
        break;
      case 'study-planner':
        this.renderStudyPlanner(main);
        break;
      case 'vocabulary':
        this.renderVocabularyBuilder(main);
        break;
      case 'settings':
        this.renderSettings(main);
        break;
      default:
        if (this.auth.isLoggedIn && this.auth.role === 'teacher') {
          this.renderTeacherDashboard(main);
        } else if (this.auth.isLoggedIn && this.auth.role === 'student') {
          this.renderDashboard(main);
        } else {
          this.renderHome(main);
        }
    }
  },

  updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const badge = document.getElementById('online-status-badge');
    if (badge) {
      if (isOnline) {
        badge.className = 'status-badge';
        badge.innerHTML = `<span class="status-dot"></span> 🟢 ${t('online_mode')}`;
      } else {
        badge.className = 'status-badge offline';
        badge.innerHTML = `<span class="status-dot"></span> 🟠 ${t('offline_mode')}`;
      }
    }
  },

  // --- View 0: Authentication Page ---
  renderLogin(main) {
    if (this.auth.isLoggedIn) {
      const isTeacher = this.auth.role === 'teacher';
      main.innerHTML = `
        <div style="max-width: 520px; margin: 3rem auto; text-align: center;">
          <div class="card" style="padding: var(--space-xl);">
            <div style="font-size: 3.5rem; margin-bottom: var(--space-xs);">🏛️</div>
            <h2 class="card-title" style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: var(--space-xs);">
              Already Signed In
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
              You are currently authenticated as <strong>${this.auth.name}</strong> (${isTeacher ? 'Teacher' : 'Student'}).
            </p>
            <div style="display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="AppRouter.navigate('${isTeacher ? 'teacher' : 'dashboard'}')">
                🚀 Go to ${isTeacher ? 'Teacher Portal' : 'Student Dashboard'}
              </button>
              <button class="btn btn-outline" onclick="AppRouter.logout()">
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div style="max-width: 500px; margin: 2rem auto;">
        <div class="card">
          <div style="text-align: center; margin-bottom: var(--space-lg);">
            <div style="font-size: 3rem; margin-bottom: var(--space-xs);">🏛️</div>
            <h2 class="card-title" style="font-size: 1.6rem; color: var(--color-primary);">${t('app_title')} Portal</h2>
            <div style="font-size: 0.9rem; color: var(--text-muted);">${t('select_role')} to Continue</div>
          </div>

          <div style="display: flex; gap: var(--space-xs); margin-bottom: var(--space-lg); border-bottom: 2px solid var(--border-subtle); padding-bottom: var(--space-xs);">
            <button class="btn btn-primary" id="tab-student" style="flex: 1;" onclick="AppRouter.switchLoginTab('student')">
              👨‍🎓 ${t('student_login')}
            </button>
            <button class="btn btn-outline" id="tab-teacher" style="flex: 1;" onclick="AppRouter.switchLoginTab('teacher')">
              👨‍🏫 ${t('teacher_login')}
            </button>
          </div>

         <!-- Student Login Form -->
<div id="login-form-student">

  <form onsubmit="
    event.preventDefault();
    AppRouter.loginAsStudent(
      document.getElementById('input-student-email').value,
      document.getElementById('input-student-password').value
    );
  ">

    <!-- Email -->
    <div class="form-group">
      <label class="form-label">
        ${t('enter_email')}
      </label>

      <input
        type="email"
        id="input-student-email"
        class="form-control"
        placeholder="Enter your email"
        autocomplete="email"
        required
      >
    </div>

    <!-- Password -->
    <div class="form-group">
      <label class="form-label">
        ${t('enter_password')}
      </label>

      <input
        type="password"
        id="input-student-password"
        class="form-control"
        placeholder="Enter your password"
        autocomplete="current-password"
        required
      >
    </div>

    <!-- Sign In -->
    <button
      type="submit"
      class="btn btn-primary"
      style="width: 100%; margin-top: var(--space-md);"
    >
      🔑 ${t('login_btn')}
    </button>

  </form>
            <div style="margin-top: var(--space-lg); text-align: center; border-top: 1px dashed var(--border-subtle); padding-top: var(--space-md);">
              <button
                type="button"
                class="btn btn-secondary"
                style="width: 100%; margin-top: var(--space-md);"
                onclick="AppRouter.quickDemoStudent()">
                ⚡ ${t('demo_login_student')}
                </button>
            </div>
          </div>

          <!-- Teacher Login Form -->
<div id="login-form-teacher" style="display: none;">

  <form onsubmit="
    event.preventDefault();
    AppRouter.loginAsTeacher(
      document.getElementById('input-teacher-email').value,
      document.getElementById('input-teacher-password').value
    );
  ">

    <!-- Email -->
    <div class="form-group">
      <label class="form-label">
        ${t('enter_email')}
      </label>

      <input
        type="email"
        id="input-teacher-email"
        class="form-control"
        placeholder="Enter teacher email"
        autocomplete="email"
        required
      >
    </div>

    <!-- Password -->
    <div class="form-group">
      <label class="form-label">
        ${t('enter_password')}
      </label>

      <input
        type="password"
        id="input-teacher-password"
        class="form-control"
        placeholder="Enter your password"
        autocomplete="current-password"
        required
      >
    </div>

                  <!-- Sign In -->
                  <button
                  type="submit"
                class="btn btn-primary"
                style="width: 100%; margin-top: var(--space-md);">
              🔑 ${t('login_btn')}
              </button>

            </form>



            <div style="margin-top: var(--space-lg); text-align: center; border-top: 1px dashed var(--border-subtle); padding-top: var(--space-md);">
              <button
              type="button"
              class="btn btn-secondary"
              style="width: 100%; margin-top: var(--space-md);"
              onclick="AppRouter.quickDemoTeacher()">
              ⚡ ${t('demo_login_teacher')}
            </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================
// REGISTER PAGE
// =========================================================

renderRegister(main) {

    // If already logged in, go to dashboard
    if (this.auth.isLoggedIn) {

        if (this.auth.role === 'teacher') {
            this.navigate('teacher');
        } else {
            this.navigate('dashboard');
        }

        return;
    }

    main.innerHTML = `

        <div style="
            max-width: 540px;
            margin: 2rem auto;
        ">

            <div class="card">

                <!-- Header -->
                <div style="
                    text-align: center;
                    margin-bottom: var(--space-lg);
                ">

                    <div style="
                        font-size: 3rem;
                        margin-bottom: var(--space-xs);
                    ">
                        🏛️
                    </div>

                    <h2
                        class="card-title"
                        style="
                            font-size: 1.6rem;
                            color: var(--color-primary);
                        "
                    >
                        Create New Account
                    </h2>

                    <div style="
                        font-size: 0.9rem;
                        color: var(--text-muted);
                    ">
                        Register for Shiksha Setu
                    </div>

                </div>


                <!-- Student / Teacher Tabs -->
                <div style="
                    display: flex;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-lg);
                    border-bottom: 2px solid var(--border-subtle);
                    padding-bottom: var(--space-xs);
                ">

                    <button
                        type="button"
                        id="register-tab-student"
                        class="btn btn-primary"
                        style="flex: 1;"
                        onclick="AppRouter.switchRegisterTab('student')"
                    >
                        👨‍🎓 Student Register
                    </button>


                    <button
                        type="button"
                        id="register-tab-teacher"
                        class="btn btn-outline"
                        style="flex: 1;"
                        onclick="AppRouter.switchRegisterTab('teacher')"
                    >
                        👨‍🏫 Teacher Register
                    </button>

                </div>


                <!-- Registration Form -->
                <form
                    id="register-form"
                    onsubmit="
                        event.preventDefault();
                        AppRouter.submitRegistration();
                    "
                >

                    <!-- Role -->
                    <input
                        type="hidden"
                        id="register-role"
                        value="student"
                    >


                    <!-- Full Name -->
                    <div class="form-group">

                        <label class="form-label">
                            Enter Full Name
                        </label>

                        <input
                            type="text"
                            id="register-name"
                            class="form-control"
                            placeholder="Enter your full name"
                            required
                        >

                    </div>


                    <!-- Email -->
                    <div class="form-group">

                        <label class="form-label">
                            Enter Email
                        </label>

                        <input
                            type="email"
                            id="register-email"
                            class="form-control"
                            placeholder="example@gmail.com"
                            required
                        >

                    </div>


                    <!-- Student Class -->
                    <div
                        id="register-class-group"
                        class="form-group"
                    >

                        <label class="form-label">
                            Select Class
                        </label>

                        <select
                            id="register-class"
                            class="form-select"
                        >

                            <option value="6">
                                Class 6
                            </option>

                            <option value="7">
                                Class 7
                            </option>

                            <option value="8" selected>
                                Class 8
                            </option>

                            <option value="9">
                                Class 9
                            </option>

                            <option value="10">
                                Class 10
                            </option>

                        </select>

                    </div>


                    <!-- Password -->
                    <div class="form-group">

                        <label class="form-label">
                            Enter Password
                        </label>

                        <input
                            type="password"
                            id="register-password"
                            class="form-control"
                            placeholder="Create password"
                            minlength="6"
                            required
                        >

                    </div>


                    <!-- Confirm Password -->
                    <div class="form-group">

                        <label class="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="register-confirm-password"
                            class="form-control"
                            placeholder="Enter password again"
                            minlength="6"
                            required
                        >

                    </div>


                    <!-- Error / Success Message -->
                    <div
                        id="register-message"
                        style="
                            display: none;
                            margin-top: 12px;
                        "
                    ></div>


                    <!-- Register Button -->
                    <button
                        id="register-submit-btn"
                        type="submit"
                        class="btn btn-primary"
                        style="
                            width: 100%;
                            margin-top: var(--space-md);
                        "
                    >
                        📝 Register
                    </button>

                </form>


                <!-- Login Link -->
                <div style="
                    margin-top: var(--space-lg);
                    text-align: center;
                    border-top: 1px dashed var(--border-subtle);
                    padding-top: var(--space-md);
                ">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        class="btn btn-outline btn-sm"
                        onclick="AppRouter.navigate('login')"
                    >
                        🔑 Sign In
                    </button>

                </div>

            </div>

        </div>
    `;
},


// =========================================================
// SWITCH REGISTER TAB
// =========================================================

switchRegisterTab(role) {

    const roleInput =
        document.getElementById('register-role');

    const studentTab =
        document.getElementById('register-tab-student');

    const teacherTab =
        document.getElementById('register-tab-teacher');

    const classGroup =
        document.getElementById('register-class-group');


    roleInput.value = role;


    // Student selected
    if (role === 'student') {

        studentTab.className =
            'btn btn-primary';

        teacherTab.className =
            'btn btn-outline';

        classGroup.style.display =
            'block';

    }

    // Teacher selected
    else {

        studentTab.className =
            'btn btn-outline';

        teacherTab.className =
            'btn btn-primary';

        // Teachers don't need class
        classGroup.style.display =
            'none';
    }
},


// =========================================================
// SUBMIT REGISTRATION
// =========================================================

async submitRegistration() {

    const role =
        document.getElementById(
            'register-role'
        ).value;


    const fullName =
        document.getElementById(
            'register-name'
        ).value.trim();


    const email =
        document.getElementById(
            'register-email'
        ).value.trim();


    const password =
        document.getElementById(
            'register-password'
        ).value;


    const confirmPassword =
        document.getElementById(
            'register-confirm-password'
        ).value;


    const classId =
        parseInt(
            document.getElementById(
                'register-class'
            ).value,
            10
        );


    const message =
        document.getElementById(
            'register-message'
        );


    const button =
        document.getElementById(
            'register-submit-btn'
        );


    // =====================================================
    // MESSAGE FUNCTION
    // =====================================================

    const showMessage =
        (text, success = false) => {

            message.style.display =
                'block';

            message.style.padding =
                '10px';

            message.style.borderRadius =
                '8px';


            if (success) {

                message.style.background =
                    '#dcfce7';

                message.style.color =
                    '#166534';

            }

            else {

                message.style.background =
                    '#fee2e2';

                message.style.color =
                    '#991b1b';

            }


            message.textContent =
                text;
        };


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        !fullName ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        showMessage(
            'Please fill in all required fields.'
        );

        return;
    }


    if (password.length < 8) {

        showMessage(
            'Password must be at least 8 characters.'
        );

        return;
    }


    if (
        password !==
        confirmPassword
    ) {

        showMessage(
            'Passwords do not match.'
        );

        return;
    }


    // =====================================================
    // INTERNET CHECK
    // =====================================================

    if (!navigator.onLine) {

        showMessage(
            'Internet connection is required to register.'
        );

        return;
    }


    // =====================================================
    // API CHECK
    // =====================================================

    if (
        typeof ApiClient ===
        'undefined'
    ) {

        showMessage(
            'API client is not available.'
        );

        return;
    }


    // Disable button
    button.disabled = true;

    button.textContent =
        'Creating Account...';


    try {

        // =================================================
        // DATA SENT TO BACKEND
        // =================================================

        const registerData = {

            full_name: fullName,

            name: fullName,

            email: email,

            password: password

        };


        // Student only
        if (role === 'student') {

            registerData.class_number = classId;
        }


        let result;


        // =================================================
        // STUDENT REGISTER
        // =================================================

        if (role === 'student') {

            result =
                await ApiClient.auth
                    .registerStudent(
                        registerData
                    );

        }


        // =================================================
        // TEACHER REGISTER
        // =================================================

        else {

            result =
                await ApiClient.auth
                    .registerTeacher(
                        registerData
                    );

        }


        // =================================================
        // SERVER NOT AVAILABLE
        // =================================================

        if (!result) {

            showMessage(
                'Could not connect to server. Make sure backend is running.'
            );

            return;
        }


        // =================================================
        // BACKEND ERROR
        // =================================================

        if (result._error) {

            showMessage(
                result.message ||
                'Registration failed.'
            );

            return;
        }


        // =================================================
        // SUCCESS
        // =================================================

        const user =
            result.user || {};


        this.auth = {

            isLoggedIn: true,

            role: role,

            name:
                user.name ||
                user.full_name ||
                fullName,

            selectedClass:
                role === 'student'
                    ?
                    (
                        parseInt(
                            user.class_id ||
                            user.class ||
                            classId
                        ) || classId
                    )
                    :
                    8,

            userId:
                user.id || null,

            email:
                user.email ||
                email

        };


        // Save JWT
        if (result.token) {

            ApiClient.setToken(
                result.token
            );

        }


        // Save login session
        this.saveAuthSession();


        // =================================================
        // STUDENT PROFILE
        // =================================================

        if (
            role === 'student' &&
            typeof ProgressTracker !==
            'undefined'
        ) {

            ProgressTracker.profile.name =
                this.auth.name;

            ProgressTracker
                .profile
                .selectedClass =
                this.auth.selectedClass;

            ProgressTracker.saveState();

        }


        showMessage(
            'Account created successfully!',
            true
        );


        // =================================================
        // REDIRECT
        // =================================================

        setTimeout(() => {

            if (
                role ===
                'teacher'
            ) {

                this.navigate(
                    'teacher'
                );

            }

            else {

                this.navigate(
                    'dashboard'
                );

            }

        }, 500);


    }

    catch (error) {

        console.error(
            'Registration failed:',
            error
        );


        showMessage(
            error.message ||
            'Registration failed. Please try again.'
        );

    }

    finally {

        button.disabled =
            false;

        button.textContent =
            '📝 Register';

    }

},

  switchLoginTab(role) {
    const sTab = document.getElementById('tab-student');
    const tTab = document.getElementById('tab-teacher');
    const sForm = document.getElementById('login-form-student');
    const tForm = document.getElementById('login-form-teacher');

    if (!sTab || !tTab || !sForm || !tForm) return;

    if (role === 'student') {
      sTab.className = 'btn btn-primary';
      tTab.className = 'btn btn-outline';
      sForm.style.display = 'block';
      tForm.style.display = 'none';
    } else {
      sTab.className = 'btn btn-outline';
      tTab.className = 'btn btn-primary';
      sForm.style.display = 'none';
      tForm.style.display = 'block';
    }
  },

  // --- View 1: Home Page ---
  renderHome(main) {
    main.innerHTML = `
      <div class="hero-banner">
        <div class="hero-content">
          <span class="hero-tag">🏛️ ${t('hero_badge')}</span>
          <h1 class="hero-title">${t('hero_title')}</h1>
          <p class="hero-desc">${t('hero_desc')}</p>
          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="AppRouter.navigate('${this.auth.isLoggedIn && this.auth.role === 'teacher' ? 'teacher' : 'dashboard'}')">${t('start_learning')}</button>
            <button class="btn btn-outline" onclick="AppRouter.navigate('classes')">${t('select_class')}</button>
          </div>
        </div>
      </div>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('select_class')}</h2>
          <div class="section-subtitle">Choose your grade to explore curriculum lessons & activities</div>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: var(--space-xl);">
        ${SHIKSHA_DATA.classes.map(c => `
          <div class="class-card" onclick="AppRouter.navigate('classes/${c.id}')">
            <div class="class-number">Class ${c.id}</div>
            <div style="font-weight: 700; margin-bottom: 4px;">${t(c.titleKey)}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">${t(c.descKey)}</div>
          </div>
        `).join('')}
      </div>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('nav_subjects')}</h2>
          <div class="section-subtitle">Core subjects mapped to standard government school syllabus</div>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: var(--space-xl);">
        ${SHIKSHA_DATA.subjects.map(s => `
          <div class="subject-card" onclick="AppRouter.navigate('subject/6/${s.id}')">
            <div class="subject-icon-box" style="background-color: ${s.color}15; color: ${s.color};">
              📚
            </div>
            <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${t(s.nameKey)}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">Class 6 - 10 Curriculum</div>
          </div>
        `).join('')}
      </div>

      <div class="card" style="background-color: var(--bg-highlight); border-color: var(--color-primary-light);">
        <h3 class="card-title" style="margin-bottom: var(--space-md); color: var(--color-primary);">Government School Portal Features</h3>
        <div class="grid-3">
          <div>
            <div style="font-weight: 700;">📶 ${t('stats_offline')}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Works smoothly even when internet is disconnected.</div>
          </div>
          <div>
            <div style="font-weight: 700;">🗣️ Text-To-Speech Reader</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Listen to lessons in Hindi, Marathi, or English.</div>
          </div>
          <div>
            <div style="font-weight: 700;">📊 ${t('low_data')}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Saves mobile internet data for students in rural areas.</div>
          </div>
        </div>
      </div>
    `;
  },

  // --- View 2: Student Dashboard ---
  renderDashboard(main) {
    const p = ProgressTracker.profile;

    // Fetch ONLY topics that are Published + Assigned to student's class
    const assignedTopics = AuthoringEngine.getStudentAssignedTopics(p.selectedClass);

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">${t('dashboard_welcome')}</h2>
          <div class="section-subtitle">${p.school} | Class ${p.selectedClass} Student Portal</div>
        </div>
      </div>

      <div class="section-header">
        <div>
          <h3 class="section-title">📥 My Assigned Learning Content</h3>
          <div class="section-subtitle">Content created, published, and assigned to your class by your teacher</div>
        </div>
      </div>

      ${assignedTopics.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-xl);">
          <div style="font-size: 3rem; margin-bottom: var(--space-xs);">📭</div>
          <h4 style="font-size: 1.2rem; font-weight: 700;">No Assigned Content Available Yet</h4>
          <p style="color: var(--text-muted);">Your teacher has not assigned any published topics for Class ${p.selectedClass} yet.</p>
        </div>
      ` : `
        <div class="grid-2" style="margin-bottom: var(--space-xl);">
          ${assignedTopics.map(item => {
            const t = item.topic;
            return `
              <div class="card" style="border-left: 4px solid var(--color-primary);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
                  <span class="chip chip-primary">Class ${p.selectedClass}</span>
                  <span class="status-badge assigned">Assigned</span>
                </div>
                <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 4px;">${t.title}</h4>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--space-md);">
                  ${item.courseTitle} • ${item.chapterTitle}
                </div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
                  Contains ${t.pages.length} Learning Pages ${t.video ? '| 🎥 Video' : ''} ${t.pdf ? '| 📄 PDF' : ''} ${t.quiz ? '| ✍️ Quiz' : ''}
                </p>
                <button class="btn btn-primary btn-sm" onclick="AppRouter.navigate('preview/${t.id}')">
                  📖 Start Learning
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `}

      <div class="section-header">
        <h3 class="section-title">Quick Student Tools</h3>
      </div>

      <div class="grid-4">
        <button class="btn btn-outline" onclick="AppRouter.navigate('quizzes')">✍️ Quizzes</button>
        <button class="btn btn-outline" onclick="AppRouter.navigate('library')">📚 Digital Library</button>
        <button class="btn btn-outline" onclick="AppRouter.navigate('progress')">📈 My Progress</button>
        <button class="btn btn-outline" onclick="AppRouter.navigate('certificate')">📜 Certificate</button>
      </div>
    `;
  },

  // --- View 3: Classes & Subjects ---
  renderClasses(main, selectedClassId) {
    const activeClass = parseInt(selectedClassId || ProgressTracker.profile.selectedClass || 6);

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">${t('nav_classes')} & ${t('nav_subjects')}</h2>
          <div class="section-subtitle">Select Class Grade to view structured syllabus</div>
        </div>
      </div>

      <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); overflow-x: auto; padding-bottom: 4px;">
        ${SHIKSHA_DATA.classes.map(c => `
          <button class="btn ${c.id === activeClass ? 'btn-primary' : 'btn-outline'}" onclick="AppRouter.navigate('classes/${c.id}')">
            Class ${c.id}
          </button>
        `).join('')}
      </div>

      <div class="grid-3">
        ${SHIKSHA_DATA.subjects.map(s => {
          const chapters = SHIKSHA_DATA.curriculum[activeClass]?.[s.id] || [];
          return `
            <div class="card" onclick="AppRouter.navigate('subject/${activeClass}/${s.id}')" style="cursor: pointer;">
              <div class="subject-icon-box" style="background-color: ${s.color}15; color: ${s.color}; margin-bottom: var(--space-sm);">
                📖
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 4px;">${t(s.nameKey)}</h3>
              <div style="font-size: 0.88rem; color: var(--text-muted);">${chapters.length} Chapters Available</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // --- View 4: Subject Chapter Listing ---
  renderSubject(main, classId, subjectId) {
    const chapters = SHIKSHA_DATA.curriculum[classId]?.[subjectId] || [];
    const subjObj = SHIKSHA_DATA.subjects.find(s => s.id === subjectId);
    const subjName = subjObj ? t(subjObj.nameKey) : subjectId;

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">Class ${classId} - ${subjName}</h2>
          <div class="section-subtitle">Chapters and learning modules</div>
        </div>
        <button class="btn btn-outline" onclick="AppRouter.navigate('classes/${classId}')">← Back to Classes</button>
      </div>

      ${chapters.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-xl);">
          <h3>No lessons found for this grade yet.</h3>
          <p style="color: var(--text-muted);">Please select Class 6 Mathematics or Science for full demo content.</p>
        </div>
      ` : `
        <div>
          ${chapters.map(ch => `
            <div class="card" style="margin-bottom: var(--space-lg);">
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-md);">${ch.title}</h3>
              <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                ${ch.lessons.map(les => {
                  const isDone = ProgressTracker.isLessonCompleted(les.id);
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-subtle); border-radius: var(--border-radius);">
                      <div>
                        <div style="font-weight: 700;">${les.title} ${isDone ? '✅' : ''}</div>
                        <div style="font-size: 0.88rem; color: var(--text-muted);">${les.intro}</div>
                      </div>
                      <button class="btn btn-sm ${isDone ? 'btn-outline' : 'btn-primary'}" onclick="AppRouter.navigate('lesson/${les.id}')">
                        ${isDone ? t('lesson_completed') : 'Start Lesson'}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  },

  // --- View 5: Lesson View ---
  renderLesson(main, lessonId) {
    let targetLesson = null;
    let targetClass = 6;
    let targetSubject = 'math';

    Object.keys(SHIKSHA_DATA.curriculum).forEach(cId => {
      Object.keys(SHIKSHA_DATA.curriculum[cId]).forEach(sId => {
        SHIKSHA_DATA.curriculum[cId][sId].forEach(ch => {
          ch.lessons.forEach(les => {
            if (les.id === lessonId) {
              targetLesson = les;
              targetClass = cId;
              targetSubject = sId;
            }
          });
        });
      });
    });

    if (!targetLesson) {
      main.innerHTML = `<div class="card">Lesson not found.</div>`;
      return;
    }

    const isCompleted = ProgressTracker.isLessonCompleted(targetLesson.id);

    main.innerHTML = `
      <div class="section-header">
        <div>
          <div class="lesson-meta">
            <span class="chip chip-primary">Class ${targetClass}</span>
            <span class="chip chip-secondary">${targetSubject.toUpperCase()}</span>
          </div>
          <h2 class="section-title">${targetLesson.title}</h2>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <button class="btn btn-outline btn-sm" onclick="AccessibilityManager.speakText('${targetLesson.title}. ${targetLesson.explanation.replace(/'/g, "")}', LanguageManager.currentLang)">
            🔊 ${t('read_aloud')}
          </button>
          <button class="btn btn-outline btn-sm" onclick="AccessibilityManager.stopSpeech()">
            🔇 ${t('stop_speech')}
          </button>
        </div>
      </div>

      <div class="lesson-container">
        <div class="lesson-section">
          <h3 class="lesson-section-title">📌 Introduction</h3>
          <p>${targetLesson.intro}</p>
        </div>

        <div class="lesson-section">
          <h3 class="lesson-section-title">🎯 Learning Objectives</h3>
          <ul style="padding-left: 20px; color: var(--text-secondary);">
            ${targetLesson.objectives.map(obj => `<li style="margin-bottom: 6px;">${obj}</li>`).join('')}
          </ul>
        </div>

        <div class="lesson-section">
          <h3 class="lesson-section-title">📖 Explanation</h3>
          <p style="margin-bottom: var(--space-md);">${targetLesson.explanation}</p>
          
          ${targetLesson.examples ? `
            <div class="key-points-box">
              <div style="font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">💡 ${t('examples')}:</div>
              ${targetLesson.examples.map(ex => `<div style="margin-bottom: 4px;">• ${ex}</div>`).join('')}
            </div>
          ` : ''}
        </div>

        ${targetLesson.keyTerms ? `
          <div class="lesson-section">
            <h3 class="lesson-section-title">🔑 ${t('key_terms')}</h3>
            <div class="grid-2">
              ${targetLesson.keyTerms.map(kt => `
                <div class="card" style="padding: var(--space-md); background: var(--bg-subtle);">
                  <div style="font-weight: 700; color: var(--color-primary);">${kt.term}</div>
                  <div style="font-size: 0.9rem; color: var(--text-secondary);">${kt.def}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${targetLesson.activity ? `
          <div class="lesson-section">
            <h3 class="lesson-section-title">⚡ Interactive Practice Activity</h3>
            <div id="inline-activity-container"></div>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: var(--space-lg); margin-top: var(--space-xl);">
          <button class="btn btn-outline" onclick="AppRouter.navigate('subject/${targetClass}/${targetSubject}')">${t('prev_lesson')}</button>

          <button id="btn-mark-complete" class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" onclick="AppRouter.handleMarkComplete('${targetLesson.id}')">
            ${isCompleted ? t('lesson_completed') : t('mark_complete')}
          </button>
        </div>
      </div>
    `;

    if (targetLesson.activity) {
      QuizEngine.renderActivity(targetLesson.activity, 'inline-activity-container');
    }
  },

  handleMarkComplete(lessonId) {
    const success = ProgressTracker.markLessonComplete(lessonId);
    const btn = document.getElementById('btn-mark-complete');
    if (btn) {
      btn.className = 'btn btn-secondary';
      btn.textContent = t('lesson_completed');
    }
    if (success) {
      alert('🎉 Lesson completed! Earned +50 XP!');
    }
  },

  // --- View 6: Quizzes ---
  renderQuizzes(main) {
    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">${t('nav_quizzes')} & Assessment</h2>
          <div class="section-subtitle">Test your knowledge and earn XP badges</div>
        </div>
      </div>

      <div class="grid-2">
        ${SHIKSHA_DATA.quizzes.map(q => `
          <div class="card">
            <div class="chip chip-primary" style="margin-bottom: var(--space-xs);">Class ${q.classId} ${q.subjectId.toUpperCase()}</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs);">${q.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: var(--space-md);">
              ${q.questions.length} Multiple Choice Questions | ⏱️ 5 Minutes Timer
            </p>
            <button class="btn btn-primary" onclick="QuizEngine.startQuiz('${q.id}')">${t('start_quiz')}</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --- View 7: Digital Library & Interactive Document Reader Modal ---
  renderLibrary(main) {
    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">${t('library_title')}</h2>
          <div class="section-subtitle">Free download & study reference notes, formula sheets, and question papers</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Search Library</label>
            <input type="text" id="library-search" class="form-control" placeholder="${t('search_placeholder')}" oninput="AppRouter.filterLibrary()">
          </div>
          <div class="form-group">
            <label class="form-label">Category Filter</label>
            <select id="library-category" class="form-select" onchange="AppRouter.filterLibrary()">
              <option value="all">${t('all_categories')}</option>
              <option value="Formula Sheets">Formula Sheets</option>
              <option value="Notes">Notes</option>
              <option value="Question Papers">Question Papers</option>
              <option value="Study Material">Study Material</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid-2" id="library-items-grid">
        ${SHIKSHA_DATA.library.map(item => `
          <div class="card lib-item-card" data-title="${item.title.toLowerCase()}" data-category="${item.category}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
              <span class="chip chip-secondary">${item.category}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${item.fileSize}</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: var(--space-xs);">${item.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-md);">${item.summary}</p>
            <div style="display: flex; gap: var(--space-xs);">
              <button class="btn btn-sm btn-primary" onclick="AppRouter.openDocumentReader('${item.id}')">📄 View Document</button>
              <button class="btn btn-sm btn-outline" onclick="AppRouter.downloadDemoPdf('${item.id}')">💾 Download PDF</button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Container for full-screen document reader overlay -->
      <div id="document-modal-container"></div>
    `;
  },

  filterLibrary() {
    const q = (document.getElementById('library-search')?.value || '').toLowerCase();
    const cat = document.getElementById('library-category')?.value || 'all';

    document.querySelectorAll('.lib-item-card').forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';

      const matchQ = title.includes(q);
      const matchCat = cat === 'all' || category === cat;

      if (matchQ && matchCat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  },

  openDocumentReader(docId) {
    const docObj = SHIKSHA_DATA.library.find(item => item.id === docId) || SHIKSHA_DATA.library[0];
    const container = document.getElementById('document-modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-overlay" style="z-index: 300; background: rgba(15, 23, 42, 0.75);">
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
          <!-- Modal Toolbar -->
          <div style="padding: var(--space-md); background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span class="chip chip-secondary" style="background: #fff; color: var(--color-primary); margin-bottom: 2px;">${docObj.category} (${docObj.fileSize})</span>
              <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0; color: #fff;">${docObj.title}</h3>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-outline" style="color: #fff; border-color: rgba(255,255,255,0.4);" onclick="AppRouter.downloadDemoPdf('${docObj.id}')">💾 Save PDF</button>
              <button class="btn btn-sm btn-outline" style="color: #fff; border-color: rgba(255,255,255,0.4);" onclick="window.print()">🖨️ Print</button>
              <button class="btn btn-sm btn-outline" style="color: #fff; border-color: rgba(255,255,255,0.4);" onclick="AppRouter.closeDocumentModal()">✖️ Close</button>
            </div>
          </div>

          <!-- Document Content Area -->
          <div style="padding: var(--space-xl); overflow-y: auto; flex: 1; background: #ffffff;">
            ${docObj.contentHtml || `<p>${docObj.summary}</p>`}
          </div>

          <!-- Modal Footer -->
          <div style="padding: var(--space-sm) var(--space-md); background: var(--bg-subtle); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Shiksha Setu Digital Learning Publication</span>
            <button class="btn btn-sm btn-secondary" onclick="AppRouter.closeDocumentModal()">Close Viewer</button>
          </div>
        </div>
      </div>
    `;
  },

  closeDocumentModal() {
    const container = document.getElementById('document-modal-container');
    if (container) container.innerHTML = '';
  },

  downloadDemoPdf(docId) {
    const docObj = SHIKSHA_DATA.library.find(item => item.id === docId) || SHIKSHA_DATA.library[0];
    
    // Create a plain text formatted blob representation of the document
    const textContent = `SHIKSHA SETU GOVERNMENT SCHOOL PORTAL\n` +
      `Title: ${docObj.title}\n` +
      `Category: ${docObj.category} | Class ${docObj.classId || 'All'}\n` +
      `--------------------------------------------------\n\n` +
      `${docObj.summary}\n\n` +
      `DOCUMENT CONTENTS:\n` +
      (docObj.contentHtml ? docObj.contentHtml.replace(/<[^>]*>?/gm, '\n') : docObj.summary) +
      `\n\n--------------------------------------------------\n` +
      `Downloaded from Shiksha Setu Govt School E-Learning Platform`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docObj.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert(`📄 "${docObj.title}" demo document file downloaded to your computer!`);
  },

  // --- View 8: Worksheets ---
  renderWorksheet(main, wsId) {
    const ws = SHIKSHA_DATA.worksheets.find(w => w.id === wsId) || SHIKSHA_DATA.worksheets[0];

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">Interactive Worksheet</h2>
          <div class="section-subtitle">${ws.title}</div>
        </div>
      </div>

      <div class="card" id="worksheet-card-container">
        ${ws.questions.map((q, idx) => `
          <div style="margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-md);">
            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: var(--space-xs);">Q${idx + 1}: ${q.question}</div>
            ${q.type === 'text' ? `
              <textarea class="form-control" rows="3" placeholder="Type your answer here..."></textarea>
            ` : `
              <div>
                ${q.options.map((opt, oIdx) => `
                  <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer;">
                    <input type="radio" name="ws_q_${idx}" value="${oIdx}">
                    <span>${opt}</span>
                  </label>
                `).join('')}
              </div>
            `}
          </div>
        `).join('')}

        <button class="btn btn-primary" onclick="alert('Worksheet submitted successfully! Great effort!'); ProgressTracker.addXP(30);">${t('submit_quiz')}</button>
      </div>
    `;
  },

  // --- View 9: Progress ---
 // --- View 9: Progress ---
async renderProgress(main) {

  const p = ProgressTracker.profile;

  // ---------------------------------------------------------
  // Loading screen
  // ---------------------------------------------------------
  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">
          ${t('nav_progress')} Analytics
        </h2>
        <div class="section-subtitle">
          Detailed subject completion and quiz performance
        </div>
      </div>
    </div>

    <div class="card" style="text-align:center; padding:40px;">
      <div style="font-size:2rem;">⏳</div>
      <p>Loading progress...</p>
    </div>
  `;

  try {

    // =========================================================
    // LOAD QUIZ ATTEMPTS FROM BACKEND
    // =========================================================

    let attempts = [];

    try {

      if (
        typeof ApiClient !== 'undefined' &&
        ApiClient.isAuthenticated()
      ) {

        const result = await ApiClient.request(
          '/quizzes/attempts',
          {
            method: 'GET'
          }
        );

        attempts = result?.attempts || [];

      }

    } catch (error) {

      console.warn(
        'Could not load quiz attempts from backend:',
        error
      );

    }


    // =========================================================
    // FALLBACK TO LOCAL QUIZ SCORES
    // =========================================================

    if (attempts.length === 0) {

      attempts = (ProgressTracker.quizScores || []).map(q => ({
        quiz_key: q.quiz_key || q.quizId,
        score: Number(q.score || 0),
        total: Number(q.total || 0),
        percentage: Number(q.percentage || 0),
        attempted_at: q.attempted_at || q.date || null
      }));

    }


    // =========================================================
    // REMOVE DUPLICATE LOCAL/BACKEND RECORDS
    // =========================================================

    const normalizedAttempts = attempts
      .filter(a => a && (a.quiz_key || a.quizId))
      .map(a => ({

        quiz_key: String(
          a.quiz_key ||
          a.quizId ||
          ''
        ),

        score: Number(
          a.score || 0
        ),

        total: Number(
          a.total || 0
        ),

        percentage:
          Number.isFinite(Number(a.percentage))
            ? Number(a.percentage)
            : (
                Number(a.total) > 0
                  ? Math.round(
                      (Number(a.score) / Number(a.total)) * 100
                    )
                  : 0
              ),

        attempted_at:
          a.attempted_at ||
          a.date ||
          null

      }));


    // =========================================================
    // QUIZ STATISTICS
    // =========================================================

    const quizzesCompleted =
      normalizedAttempts.length;

    const averageScore =
      quizzesCompleted > 0
        ? Math.round(
            normalizedAttempts.reduce(
              (sum, q) =>
                sum + Number(q.percentage || 0),
              0
            ) / quizzesCompleted
          )
        : 0;

    const bestScore =
      quizzesCompleted > 0
        ? Math.max(
            ...normalizedAttempts.map(
              q => Number(q.percentage || 0)
            )
          )
        : 0;


    // =========================================================
    // SUBJECT QUIZ PREFIXES
    // =========================================================

    const subjectQuizPrefixes = {

      math: [
        'quiz_math_',
        'math_'
      ],

      sci: [
        'quiz_sci_',
        'quiz_science_',
        'sci_'
      ],

      eng: [
        'quiz_eng_',
        'quiz_english_',
        'eng_'
      ],

      hin: [
        'quiz_hin_',
        'quiz_hindi_',
        'hin_'
      ],

      sst: [
        'quiz_sst_',
        'quiz_social_',
        'sst_'
      ],

      comp: [
        'quiz_comp_',
        'quiz_computer_',
        'comp_'
      ]

    };


    // =========================================================
    // FIND SUBJECT FROM QUIZ KEY
    // =========================================================

    function quizBelongsToSubject(
      quizKey,
      subjectId
    ) {

      const key =
        String(quizKey || '')
          .toLowerCase();

      const prefixes =
        subjectQuizPrefixes[subjectId] || [];

      return prefixes.some(prefix =>
        key.startsWith(prefix)
      );

    }


    // =========================================================
    // SUBJECT PROGRESS
    // =========================================================

    function getSubjectProgress(subjectId) {

      // -------------------------------------------------------
      // Quiz attempts for this subject
      // -------------------------------------------------------

      const subjectAttempts =
        normalizedAttempts.filter(attempt =>
          quizBelongsToSubject(
            attempt.quiz_key,
            subjectId
          )
        );


      // -------------------------------------------------------
      // Unique completed quiz keys
      // -------------------------------------------------------

      const completedQuizKeys =
        new Set(
          subjectAttempts.map(
            attempt => attempt.quiz_key
          )
        );


      // -------------------------------------------------------
      // Find quizzes belonging to selected class + subject
      // -------------------------------------------------------

      const availableQuizzes =
        (SHIKSHA_DATA.quizzes || [])
          .filter(quiz => {

            const sameClass =
              Number(quiz.classId) ===
              Number(p.selectedClass);

            const sameSubject =
              quiz.subjectId === subjectId ||
              quizBelongsToSubject(
                quiz.id,
                subjectId
              );

            return (
              sameClass &&
              sameSubject
            );

          });


      // -------------------------------------------------------
      // Lesson progress
      // -------------------------------------------------------

      const chapters =
        SHIKSHA_DATA.curriculum?.[
          p.selectedClass
        ]?.[
          subjectId
        ] || [];

      let totalLessons = 0;
      let completedLessons = 0;

      chapters.forEach(chapter => {

        (chapter.lessons || [])
          .forEach(lesson => {

            totalLessons++;

            if (
              ProgressTracker
                .isLessonCompleted(
                  lesson.id
                )
            ) {

              completedLessons++;

            }

          });

      });


      // -------------------------------------------------------
      // If SHIKSHA_DATA contains quizzes
      // -------------------------------------------------------

      let totalQuizzes =
        availableQuizzes.length;

      let completedQuizzes = 0;

      if (totalQuizzes > 0) {

        availableQuizzes.forEach(quiz => {

          if (
            completedQuizKeys.has(
              String(quiz.id)
            )
          ) {

            completedQuizzes++;

          }

        });

      }


      // -------------------------------------------------------
      // IMPORTANT:
      // Backend attempt exists but static quiz list does not
      // contain that quiz.
      // Count backend quiz so progress doesn't stay at 0%.
      // -------------------------------------------------------

      if (
        totalQuizzes === 0 &&
        completedQuizKeys.size > 0
      ) {

        totalQuizzes =
          completedQuizKeys.size;

        completedQuizzes =
          completedQuizKeys.size;

      }


      // -------------------------------------------------------
      // Calculate combined progress
      // -------------------------------------------------------

      const totalActivities =
        totalLessons +
        totalQuizzes;

      const completedActivities =
        completedLessons +
        completedQuizzes;

      if (totalActivities === 0) {

        return 0;

      }

      return Math.min(
        100,
        Math.round(
          (
            completedActivities /
            totalActivities
          ) * 100
        )
      );

    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    function formatAttemptDate(value) {

      if (!value) {
        return '';
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return String(value);

      }

      return date.toLocaleDateString();

    }


    // =========================================================
    // RENDER
    // =========================================================

    main.innerHTML = `

      <div class="section-header">

        <div>

          <h2 class="section-title">
            ${t('nav_progress')} Analytics
          </h2>

          <div class="section-subtitle">
            Detailed subject completion and quiz performance
          </div>

        </div>

      </div>


      <!-- ===============================================
           QUIZ SUMMARY
      ================================================ -->

      <div
        class="grid-3"
        style="margin-bottom:var(--space-xl);"
      >

        <div
          class="card"
          style="text-align:center;"
        >

          <div style="font-size:2.5rem;">
            ✅
          </div>

          <h2 style="font-size:2rem;">
            ${quizzesCompleted}
          </h2>

          <div style="color:var(--text-muted);">
            Quizzes Completed
          </div>

        </div>


        <div
          class="card"
          style="text-align:center;"
        >

          <div style="font-size:2.5rem;">
            📊
          </div>

          <h2 style="font-size:2rem;">
            ${averageScore}%
          </h2>

          <div style="color:var(--text-muted);">
            Average Score
          </div>

        </div>


        <div
          class="card"
          style="text-align:center;"
        >

          <div style="font-size:2.5rem;">
            🏆
          </div>

          <h2 style="font-size:2rem;">
            ${bestScore}%
          </h2>

          <div style="color:var(--text-muted);">
            Best Score
          </div>

        </div>

      </div>


      <!-- ===============================================
           SUBJECT PROGRESS
      ================================================ -->

      <div class="section-header">

        <h3 class="section-title">
          📚 Subject Progress
        </h3>

      </div>


      <div
        class="grid-3"
        style="margin-bottom:var(--space-xl);"
      >

        ${SHIKSHA_DATA.subjects.map(s => {

          const prog =
            getSubjectProgress(s.id);

          return `

            <div class="card">

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  margin-bottom:var(--space-xs);
                "
              >

                <span
                  style="
                    font-weight:700;
                    font-size:1.1rem;
                  "
                >

                  ${t(s.nameKey)}

                </span>


                <span
                  style="
                    font-weight:800;
                    color:${s.color};
                  "
                >

                  ${prog}%

                </span>

              </div>


              <div class="progress-container">

                <div
                  class="progress-bar"
                  style="
                    width:${prog}%;
                    background-color:${s.color};
                  "
                ></div>

              </div>

            </div>

          `;

        }).join('')}

      </div>


      <!-- ===============================================
           QUIZ HISTORY
      ================================================ -->

      <div class="card">

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:var(--space-md);
          "
        >

          <h3 class="card-title">

            ✍️ Quiz Performance History

          </h3>


          <span class="chip chip-primary">

            ${quizzesCompleted} Attempts

          </span>

        </div>


        ${
          normalizedAttempts.length === 0

          ?

          `

          <p style="color:var(--text-muted);">

            No quizzes taken yet.
            Take a quiz to view performance stats!

          </p>

          `

          :

          `

          <div
            style="
              display:flex;
              flex-direction:column;
              gap:var(--space-xs);
            "
          >

            ${normalizedAttempts.map(qs => `

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  padding:12px;
                  background:var(--bg-subtle);
                  border-radius:var(--border-radius);
                "
              >

                <span>

                  ${qs.quiz_key}

                  ${
                    qs.attempted_at
                      ? `(${formatAttemptDate(
                          qs.attempted_at
                        )})`
                      : ''
                  }

                </span>


                <strong>

                  ${qs.score} / ${qs.total}

                  (${qs.percentage}%)

                </strong>

              </div>

            `).join('')}

          </div>

          `
        }

      </div>

    `;


    // =========================================================
    // DEBUG
    // =========================================================

    console.log(
      'Progress attempts:',
      normalizedAttempts
    );

    SHIKSHA_DATA.subjects.forEach(subject => {

      console.log(
        `Progress ${subject.id}:`,
        getSubjectProgress(subject.id) + '%'
      );

    });


  } catch (error) {

    console.error(
      'Progress page error:',
      error
    );

    main.innerHTML = `

      <div class="card">

        <h3>
          Unable to load progress
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

},
  // --- View 10: Achievements ---
  async renderAchievements(main) {

  // ---------------------------------------------------------
  // Initial loading screen
  // ---------------------------------------------------------
  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">
          ${t('nav_achievements')} & Badges
        </h2>

        <div class="section-subtitle">
          Milestones earned on your educational journey
        </div>
      </div>
    </div>

    <div class="card" style="text-align:center; padding:40px;">
      <div style="font-size:2rem;">⏳</div>
      <p style="margin-top:10px;">
        Loading achievements...
      </p>
    </div>
  `;

  try {

    // ---------------------------------------------------------
    // User must be logged in
    // ---------------------------------------------------------
    if (!this.auth.isLoggedIn || this.auth.role !== 'student') {

      main.innerHTML = `
        <div class="card" style="text-align:center;">
          <h3>🔐 Login Required</h3>

          <p style="color:var(--text-muted);">
            Please login as a student to view achievements.
          </p>

          <a href="#login" class="btn btn-primary">
            Login
          </a>
        </div>
      `;

      return;
    }


    // ---------------------------------------------------------
    // Get badges from backend
    // ---------------------------------------------------------
    const [allBadgesResult, myBadgesResult] =
      await Promise.all([
        ApiClient.badges.getAll(),
        ApiClient.badges.getMine()
      ]);


    // ---------------------------------------------------------
    // API/network failure
    // ---------------------------------------------------------
    if (!allBadgesResult || !myBadgesResult) {
      throw new Error('Unable to connect to achievements server.');
    }


    if (allBadgesResult._error) {
      throw new Error(
        allBadgesResult.message || 'Unable to load badges.'
      );
    }


    if (myBadgesResult._error) {
      throw new Error(
        myBadgesResult.message ||
        'Unable to load student achievements.'
      );
    }


    // ---------------------------------------------------------
    // Support common API response formats
    // ---------------------------------------------------------
    const allBadges =
      Array.isArray(allBadgesResult)
        ? allBadgesResult
        : allBadgesResult.badges || [];


    const myBadges =
      Array.isArray(myBadgesResult)
        ? myBadgesResult
        : myBadgesResult.badges || [];


    // ---------------------------------------------------------
    // Build unlocked badge IDs/keys
    // ---------------------------------------------------------
    const unlockedBadgeIds =
      new Set(
        myBadges.map(b =>
          String(
            b.badge_id ??
            b.id ??
            b.badge_key ??
            b.key
          )
        )
      );


    // ---------------------------------------------------------
    // No badges
    // ---------------------------------------------------------
    if (allBadges.length === 0) {

      main.innerHTML = `
        <div class="section-header">
          <div>
            <h2 class="section-title">
              ${t('nav_achievements')} & Badges
            </h2>

            <div class="section-subtitle">
              Milestones earned on your educational journey
            </div>
          </div>
        </div>

        <div class="card" style="text-align:center; padding:40px;">

          <div style="font-size:3rem;">
            🏆
          </div>

          <h3>No Achievements Available Yet</h3>

          <p style="color:var(--text-muted);">
            Complete lessons and quizzes to start earning badges.
          </p>

        </div>
      `;

      return;
    }


    // ---------------------------------------------------------
    // Render badges
    // ---------------------------------------------------------
    main.innerHTML = `
      <div class="section-header">
        <div>

          <h2 class="section-title">
            ${t('nav_achievements')} & Badges
          </h2>

          <div class="section-subtitle">
            Milestones earned on your educational journey
          </div>

        </div>

        <div>
          <span class="chip chip-primary">
            🏆 ${myBadges.length} / ${allBadges.length} Unlocked
          </span>
        </div>

      </div>


      <div class="grid-3">

        ${allBadges.map(b => {

          const badgeIdentifier =
            String(
              b.id ??
              b.badge_id ??
              b.badge_key ??
              b.key
            );


          const isUnlocked =
            unlockedBadgeIds.has(badgeIdentifier);


          const icon =
            b.icon ||
            b.emoji ||
            '🏆';


          const title =
            b.title ||
            b.name ||
            'Achievement';


          const description =
            b.description ||
            b.desc ||
            'Complete learning activities to unlock this badge.';


          return `

            <div
              class="card"
              style="
                text-align:center;
                opacity:${isUnlocked ? '1' : '0.55'};
              "
            >

              <div
                style="
                  font-size:3rem;
                  margin-bottom:var(--space-xs);
                "
              >
                ${icon}
              </div>


              <h3
                style="
                  font-size:1.1rem;
                  font-weight:700;
                "
              >
                ${title}
              </h3>


              <p
                style="
                  font-size:0.88rem;
                  color:var(--text-muted);
                  margin-bottom:var(--space-sm);
                "
              >
                ${description}
              </p>


              <span
                class="chip
                ${isUnlocked
                  ? 'chip-primary'
                  : 'chip-accent'}"
              >

                ${isUnlocked
                  ? 'Unlocked 🎉'
                  : 'Locked 🔒'}

              </span>

            </div>

          `;

        }).join('')}

      </div>
    `;


  } catch (error) {

    console.error(
      '[Achievements] Error:',
      error
    );


    main.innerHTML = `
      <div class="section-header">

        <div>
          <h2 class="section-title">
            ${t('nav_achievements')} & Badges
          </h2>

          <div class="section-subtitle">
            Milestones earned on your educational journey
          </div>
        </div>

      </div>


      <div
        class="card"
        style="
          text-align:center;
          padding:40px;
        "
      >

        <div style="font-size:3rem;">
          ⚠️
        </div>

        <h3>
          Unable to Load Achievements
        </h3>

        <p style="color:var(--text-muted);">
          ${error.message}
        </p>


        <button
          class="btn btn-primary"
          onclick="
            AppRouter.renderAchievements(
              document.getElementById('view-container')
            )
          "
        >
          🔄 Try Again
        </button>

      </div>
    `;

  }
},

  // --- View 11: Teacher Content Management Dashboard ---
  renderTeacherDashboard(main) {
    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">👨‍🏫 Teacher Content Management Dashboard</h2>
          <div class="section-subtitle">Create, organize, publish, and assign educational content</div>
        </div>
        <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="AppRouter.navigate('classes-manage')">🏫 Create Class & Subject</button>
          <button class="btn btn-secondary" onclick="AppRouter.navigate('upload-center')">📤 Upload Video & PDF</button>
          <button class="btn btn-outline" onclick="AppRouter.navigate('assign')">🎯 Student Assignments</button>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div class="grid-4" style="margin-bottom: var(--space-xl);">
        <div class="card" onclick="AppRouter.navigate('classes-manage')" style="cursor: pointer; border-left: 4px solid var(--color-primary);">
          <div style="font-size: 2rem; margin-bottom: 4px;">🏫</div>
          <div style="font-weight: 700;">Create Class</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Manage subjects & chapters</div>
        </div>

        <div class="card" onclick="AppRouter.navigate('builder')" style="cursor: pointer; border-left: 4px solid var(--color-secondary);">
          <div style="font-size: 2rem; margin-bottom: 4px;">🛠️</div>
          <div style="font-weight: 700;">Content Builder</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Pages, lessons & quizzes</div>
        </div>

        <div class="card" onclick="AppRouter.navigate('upload-center')" style="cursor: pointer; border-left: 4px solid var(--color-accent);">
          <div style="font-size: 2rem; margin-bottom: 4px;">📤</div>
          <div style="font-weight: 700;">Upload Window</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Videos, PDFs & Notes</div>
        </div>

        <div class="card" onclick="AppRouter.navigate('assign')" style="cursor: pointer; border-left: 4px solid var(--color-success);">
          <div style="font-size: 2rem; margin-bottom: 4px;">🎯</div>
          <div style="font-weight: 700;">Assign to Students</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">Publish & assign tasks</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-xl);">
        <div class="card-header">
          <h3 class="card-title">My Authoring Content Library</h3>
          <button class="btn btn-sm btn-primary" onclick="AppRouter.createQuickTopic()">+ Create New Topic</button>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 2px solid var(--border-color);">
                <th style="padding: 10px;">Course / Topic Title</th>
                <th style="padding: 10px;">Class Grade</th>
                <th style="padding: 10px;">Status</th>
                <th style="padding: 10px;">Assigned Roster</th>
                <th style="padding: 10px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${SHIKSHA_DATA.courses.map(course => 
                course.chapters.map(ch => 
                  ch.topics.map(topic => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 12px;">
                        <div style="font-weight: 700;">${topic.title}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${course.title} • ${ch.title}</div>
                      </td>
                      <td style="padding: 12px;">
                        <span class="chip chip-primary">Class ${course.classId}</span>
                      </td>
                      <td style="padding: 12px;">
                        <span class="status-badge ${topic.status.toLowerCase()}">${topic.status}</span>
                      </td>
                      <td style="padding: 12px;">
                        ${topic.status === 'Assigned' ? 'Class 8 (Section A)' : 'Not Assigned'}
                      </td>
                      <td style="padding: 12px; text-align: right;">
                        <div style="display: inline-flex; gap: 4px;">
                          <button class="btn btn-sm btn-outline" onclick="AppRouter.navigate('builder/${topic.id}')" title="Edit Content">✏️ Edit</button>
                          <button class="btn btn-sm btn-outline" onclick="AppRouter.navigate('preview/${topic.id}')" title="Preview as Student">👁️ Preview</button>
                          <button class="btn btn-sm btn-primary" onclick="AppRouter.navigate('assign/${topic.id}')" title="Assign Content">🎯 Assign</button>
                          <button class="btn btn-sm ${topic.status === 'Published' ? 'btn-outline' : 'btn-secondary'}" onclick="AppRouter.toggleTopicStatus('${topic.id}')">
                            ${topic.status === 'Published' ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')
                ).join('')
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">📁 Teacher Content Hierarchy Tree View</h3>
        <div class="tree-container">
          ${SHIKSHA_DATA.courses.map(course => `
            <div style="font-weight: 700; color: var(--color-primary); font-size: 1.1rem; margin-top: 8px;">
              📚 Class ${course.classId} - ${course.title} <span class="status-badge ${course.status.toLowerCase()}">${course.status}</span>
            </div>
            <div class="tree-node">
              ${course.chapters.map(ch => `
                <div style="font-weight: 600; color: var(--text-secondary); margin-top: 4px;">
                  📁 ${ch.title}
                </div>
                <div class="tree-node">
                  ${ch.topics.map(t => `
                    <div class="tree-item">
                      <div>
                        <strong>📄 ${t.title}</strong>
                        <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">
                          (${t.pages.length} Pages | ${t.video ? '🎥 Video' : 'No Video'} | ${t.pdf ? '📄 PDF' : 'No PDF'} | ${t.quiz ? '✍️ Quiz' : 'No Quiz'})
                        </span>
                      </div>
                      <div>
                        <button class="btn btn-sm btn-outline" onclick="AppRouter.navigate('builder/${t.id}')">Build / Edit</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  createQuickTopic() {
    const course = SHIKSHA_DATA.courses[0];
    const chapter = course.chapters[0];
    const title = prompt('Enter New Topic Title:', 'Topic 2: Soil Fertilisers & Protection');
    if (!title) return;

    const newTop = AuthoringEngine.createTopic(course.id, chapter.id, title);
    alert(`Topic "${title}" created successfully!`);
    this.navigate(`builder/${newTop.id}`);
  },

  toggleTopicStatus(topicId) {
    const res = AuthoringEngine.findTopic(topicId);
    if (!res) return;

    const nextStatus = res.topic.status === 'Published' ? 'Unpublished' : 'Published';
    AuthoringEngine.setTopicStatus(topicId, nextStatus);
    alert(`Topic status updated to: ${nextStatus}`);
    this.renderTeacherDashboard(document.getElementById('view-container'));
  },

  // --- View 12: Content & Page Builder ---
  renderBuilder(main, topicId) {
    const defaultTopicId = topicId || SHIKSHA_DATA.courses[0]?.chapters[0]?.topics[0]?.id || 'top_sci_8_1_1';
    const res = AuthoringEngine.findTopic(defaultTopicId);

    if (!res) {
      main.innerHTML = `<div class="card">Topic not found.</div>`;
      return;
    }

    const t = res.topic;
    const c = res.course;

    main.innerHTML = `
      <div class="section-header">
        <div>
          <span class="chip chip-primary">Class ${c.classId} ${c.subjectId.toUpperCase()}</span>
          <h2 class="section-title">🛠️ LMS Content Builder: ${t.title}</h2>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <button class="btn btn-outline" onclick="AppRouter.navigate('teacher')">← Back to Dashboard</button>
          <button class="btn btn-secondary" onclick="AppRouter.navigate('preview/${t.id}')">👁️ Preview as Student</button>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="card" style="margin-bottom: var(--space-lg); display: flex; align-items: center; justify-content: space-between;">
        <div>
          <strong>Current Content Status:</strong> <span class="status-badge ${t.status.toLowerCase()}">${t.status}</span>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <button class="btn btn-sm btn-outline" onclick="AuthoringEngine.setTopicStatus('${t.id}', 'Draft'); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');">Set Draft</button>
          <button class="btn btn-sm btn-primary" onclick="AuthoringEngine.setTopicStatus('${t.id}', 'Published'); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');">Publish Content</button>
          <button class="btn btn-sm btn-secondary" onclick="AppRouter.navigate('assign/${t.id}')">Assign to Students</button>
        </div>
      </div>

      <!-- Section 1: Page-wise Content Builder -->
      <div class="card" style="margin-bottom: var(--space-xl);">
        <div class="card-header">
          <h3 class="card-title">📖 Page-wise Learning Content Builder</h3>
          <button class="btn btn-sm btn-primary" onclick="AppRouter.showAddPageModal('${t.id}')">+ Add Page</button>
        </div>

        <div id="pages-builder-list">
          ${t.pages.map((p, pIdx) => `
            <div class="page-builder-card">
              <div class="page-builder-header">
                <div>
                  <strong>${p.title}</strong>
                  <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 8px;">(${p.headings || 'Heading'})</span>
                </div>
                <div class="reorder-btn-group">
                  <button class="btn btn-sm btn-outline" onclick="AuthoringEngine.reorderPage('${t.id}', ${pIdx}, 'up'); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');" ${pIdx === 0 ? 'disabled' : ''}>⬆️</button>
                  <button class="btn btn-sm btn-outline" onclick="AuthoringEngine.reorderPage('${t.id}', ${pIdx}, 'down'); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');" ${pIdx === t.pages.length - 1 ? 'disabled' : ''}>⬇️</button>
                  <button class="btn btn-sm btn-outline" onclick="AuthoringEngine.duplicatePage('${t.id}', ${pIdx}); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');" title="Duplicate Page">📋</button>
                  <button class="btn btn-sm btn-outline" onclick="AuthoringEngine.deletePage('${t.id}', ${pIdx}); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');" title="Delete Page">🗑️</button>
                </div>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">${p.paragraph}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 2: PDF / Document Upload Section -->
      <div class="card" style="margin-bottom: var(--space-xl);">
        <div class="card-header">
          <h3 class="card-title">📄 PDF / Document Upload Section</h3>
          ${t.pdf ? `<button class="btn btn-sm btn-outline" onclick="AuthoringEngine.removePdf('${t.id}'); AppRouter.renderBuilder(document.getElementById('view-container'), '${t.id}');">Remove PDF</button>` : ''}
        </div>

        ${t.pdf ? `
          <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--border-radius); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700;">📄 ${t.pdf.title} (${t.pdf.fileSize})</div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">${t.pdf.description}</div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn-sm btn-outline" onclick="AppRouter.downloadDemoPdf('lib_2')">Download</button>
              <button class="btn btn-sm btn-outline" onclick="AppRouter.promptUploadPdf('${t.id}')">Replace PDF</button>
            </div>
          </div>
        ` : `
          <div class="upload-box" onclick="AppRouter.promptUploadPdf('${t.id}')">
            <div style="font-size: 2.5rem; margin-bottom: var(--space-xs);">📄</div>
            <div style="font-weight: 700; font-size: 1.1rem;">Click to Upload PDF / Study Notes</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">Supports PDF, DOCX educational reference documents</div>
          </div>
        `}
      </div>

      <!-- Section 4: Quiz Builder Section -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">✍️ Topic Quiz Builder</h3>
          <button class="btn btn-sm btn-primary" onclick="AppRouter.showAddQuestionModal('${t.id}')">+ Add Question</button>
        </div>

        ${t.quiz ? `
          <div style="margin-bottom: var(--space-md);">
            <div style="font-weight: 700;">${t.quiz.title}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">Passing Score: ${t.quiz.passingScore}%</div>
          </div>
          <div>
            ${t.quiz.questions.map((q, qIdx) => `
              <div class="card" style="margin-bottom: var(--space-sm); padding: var(--space-md); border-left: 4px solid var(--color-primary);">
                <div style="font-weight: 700;">Q${qIdx + 1}: ${q.question}</div>
                <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">
                  Options: ${q.options ? q.options.join(', ') : 'True/False'} | Marks: ${q.marks}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: var(--space-lg); color: var(--text-muted);">
            No quiz attached to this topic yet. Click "+ Add Question" to build quiz questions.
          </div>
        `}
      </div>
    `;
  },

  showAddPageModal(topicId) {
    const title = prompt('Enter Page Title:', 'Page Title');
    if (!title) return;
    const heading = prompt('Enter Page Heading:', 'Main Topic Heading');
    const paragraph = prompt('Enter Content Paragraph:', 'Write topic explanation text here...');

    AuthoringEngine.addPage(topicId, { title, headings: heading, paragraph });
    alert('Page added successfully!');
    this.renderBuilder(document.getElementById('view-container'), topicId);
  },

  promptUploadVideo(topicId) {
    const title = prompt('Enter Video Title:', 'Crop Production Instructional Guide');
    if (!title) return;
    const desc = prompt('Enter Video Description:', 'Step-by-step visual demonstration of farming techniques.');

    AuthoringEngine.saveVideo(topicId, {
      title,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      description: desc
    });
    alert('Video uploaded successfully!');
    this.renderBuilder(document.getElementById('view-container'), topicId);
  },

  promptUploadPdf(topicId) {
    const title = prompt('Enter PDF Document Title:', 'Crop Management Reference Manual.pdf');
    if (!title) return;
    const desc = prompt('Enter PDF Description:', 'Official study reference notes for students.');

    AuthoringEngine.savePdf(topicId, {
      title,
      fileSize: '1.8 MB',
      description: desc
    });
    alert('PDF uploaded successfully!');
    this.renderBuilder(document.getElementById('view-container'), topicId);
  },

  showAddQuestionModal(topicId) {
    const res = AuthoringEngine.findTopic(topicId);
    if (!res) return;

    const qText = prompt('Enter Question Text:', 'Which crop is grown in the winter season?');
    if (!qText) return;

    const newQ = {
      id: 'q_' + Date.now(),
      type: 'mcq',
      question: qText,
      options: ['Wheat', 'Rice', 'Maize', 'Cotton'],
      correctIndex: 0,
      explanation: 'Wheat is grown in winter and harvested in spring (Rabi crop).',
      marks: 5
    };

    if (!res.topic.quiz) {
      res.topic.quiz = {
        title: `${res.topic.title} Assessment`,
        passingScore: 60,
        questions: []
      };
    }
    res.topic.quiz.questions.push(newQ);
    AuthoringEngine.saveState();

    alert('Question added to quiz!');
    this.renderBuilder(document.getElementById('view-container'), topicId);
  },

  // --- View 13: Student Assignment System ---
  renderAssign(main, topicId) {
    const defaultTopicId = topicId || SHIKSHA_DATA.courses[0]?.chapters[0]?.topics[0]?.id || 'top_sci_8_1_1';
    const res = AuthoringEngine.findTopic(defaultTopicId);

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">🎯 Student Assignment System</h2>
          <div class="section-subtitle">Assign topics & deadlines to specific classes or students</div>
        </div>
        <button class="btn btn-outline" onclick="AppRouter.navigate('teacher')">← Back to Dashboard</button>
      </div>

      <div class="card" style="margin-bottom: var(--space-xl);">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">Create New Student Assignment</h3>
        <form onsubmit="event.preventDefault(); AppRouter.handleAssignSubmit('${defaultTopicId}');">
          <div class="form-group">
            <label class="form-label">Topic to Assign</label>
            <input type="text" class="form-control" value="${res ? res.topic.title : 'Crop Production'}" readonly>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Assign To Target</label>
              <select id="assign-target" class="form-select">
                <option value="Class 8 (Section A)">Class 8 (Section A)</option>
                <option value="Class 8 (Section B)">Class 8 (Section B)</option>
                <option value="Individual Student: Aarav Kumar">Individual Student: Aarav Kumar</option>
                <option value="Class 9 (Section A)">Class 9 (Section A)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Completion Deadline</label>
              <input type="date" id="assign-deadline" class="form-control" value="2026-10-15" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-sm);">🎯 Assign Content Now</button>
        </form>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">Active Student Assignments</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: var(--bg-subtle); border-bottom: 2px solid var(--border-color);">
              <th style="padding: 10px;">Assigned Target</th>
              <th style="padding: 10px;">Topic Title</th>
              <th style="padding: 10px;">Deadline</th>
              <th style="padding: 10px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${SHIKSHA_DATA.assignments.map(a => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px; font-weight: 700;">${a.assignedTo}</td>
                <td style="padding: 10px;">${a.topicTitle}</td>
                <td style="padding: 10px;">${a.deadline}</td>
                <td style="padding: 10px;"><span class="status-badge assigned">${a.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  handleAssignSubmit(topicId) {
    const target = document.getElementById('assign-target')?.value;
    const deadline = document.getElementById('assign-deadline')?.value;

    AuthoringEngine.assignTopicToStudents(topicId, {
      assignedTo: target,
      deadline
    });

    alert('Content assigned to students successfully!');
    this.renderAssign(document.getElementById('view-container'), topicId);
  },

  // --- View 14: Teacher Preview Simulator ---
  renderPreview(main, topicId) {
    const defaultTopicId = topicId || SHIKSHA_DATA.courses[0]?.chapters[0]?.topics[0]?.id || 'top_sci_8_1_1';
    const res = AuthoringEngine.findTopic(defaultTopicId);

    if (!res) {
      main.innerHTML = `<div class="card">Topic not found.</div>`;
      return;
    }

    const t = res.topic;

    main.innerHTML = `
      <div class="preview-banner" style="margin-bottom: var(--space-md);">
        <span>👁️ TEACHER PREVIEW SIMULATOR (Read-Only Student Experience)</span>
        <button class="btn btn-sm btn-outline" style="color: #fff; border-color: #fff;" onclick="AppRouter.navigate('builder/${t.id}')">← Exit Preview & Edit</button>
      </div>

      <div class="lesson-container">
        <div class="lesson-header">
          <span class="chip chip-primary">Class ${res.course.classId}</span>
          <h2 class="section-title" style="margin-top: 4px;">${t.title}</h2>
        </div>

        ${t.pages.map((p, idx) => `
          <div class="lesson-section" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-lg);">
            <h3 style="color: var(--color-primary); margin-bottom: var(--space-xs);">${p.title}</h3>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-xs);">${p.headings}</h4>
            <p>${p.paragraph}</p>
            ${p.keyPoints ? `
              <ul style="padding-left: 20px; margin-top: var(--space-xs);">
                ${p.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}


        ${t.pdf ? `
          <div class="lesson-section">
            <h3 style="color: var(--color-primary);">📄 Document Reference</h3>
            <div class="card" style="background: var(--bg-subtle); flex-direction: row; justify-content: space-between; align-items: center; display: flex;">
              <div>
                <strong>📄 ${t.pdf.title}</strong> (${t.pdf.fileSize})
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">${t.pdf.description}</p>
              </div>
              <button class="btn btn-sm btn-primary" onclick="AppRouter.downloadDemoPdf('lib_2')">Download PDF</button>
            </div>
          </div>
        ` : ''}

        ${t.quiz ? `
          <div class="lesson-section">
            <h3 style="color: var(--color-primary);">✍️ Topic Assessment Quiz</h3>
            <button class="btn btn-primary" onclick="QuizEngine.startQuiz('quiz_sci_6')">Start Student Quiz (${t.quiz.questions.length} Questions)</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // --- View 15: Certificate ---
  // --- View 15: Certificate ---
async renderCertificate(main) {

  const p = ProgressTracker.profile;

  // =========================================================
  // REQUIRED SUBJECTS
  // =========================================================

  const requiredSubjects = [
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'sci',  name: 'Science', icon: '🔬' },
    { id: 'eng',  name: 'English', icon: '📖' },
    { id: 'hin',  name: 'Hindi', icon: '📝' },
    { id: 'sst',  name: 'Social Science', icon: '🌍' },
    { id: 'comp', name: 'Computer Basics', icon: '💻' }
  ];

  // =========================================================
  // LOADING
  // =========================================================

  main.innerHTML = `
    <div class="card" style="text-align:center; padding:40px;">
      <div style="font-size:3rem;">📜</div>
      <h3>Checking Certificate Eligibility...</h3>
      <p style="color:var(--text-muted);">
        Please wait while we check your quiz results.
      </p>
    </div>
  `;

  try {

    let attempts = [];

    // =========================================================
    // LOAD ATTEMPTS FROM BACKEND
    // =========================================================

    try {

      if (
        typeof ApiClient !== 'undefined' &&
        ApiClient.isAuthenticated()
      ) {

        const result = await ApiClient.request(
          '/quizzes/attempts',
          {
            method: 'GET'
          }
        );

        attempts = result?.attempts || [];
      }

    } catch (error) {

      console.warn(
        'Certificate: backend attempts unavailable.',
        error
      );
    }


    // =========================================================
// MERGE BACKEND + LOCAL QUIZ SCORES
// =========================================================

const localAttempts =
  (ProgressTracker.quizScores || []).map(q => ({

    quiz_key:
      q.quiz_key ||
      q.quizId ||
      '',

    score:
      Number(q.score || 0),

    total:
      Number(q.total || 0),

    percentage:
      Number.isFinite(Number(q.percentage))
        ? Number(q.percentage)
        : (
            Number(q.total) > 0
              ? Math.round(
                  (Number(q.score) / Number(q.total)) * 100
                )
              : 0
          ),

    attempted_at:
      q.attempted_at ||
      q.date ||
      null

  }));

attempts = [
  ...attempts,
  ...localAttempts
];

    // =========================================================
    // CURRENT CLASS
    // =========================================================

    const studentClass =
      Number(
        this.auth.selectedClass ||
        p.selectedClass ||
        6
      );


    // =========================================================
    // FIND BEST SCORE FOR EACH SUBJECT
    // =========================================================

    const subjectResults =
      requiredSubjects.map(subject => {

        const expectedQuizKey =
          `quiz_${subject.id}_${studentClass}`;

        const subjectAttempts =
          attempts.filter(a =>
            a.quiz_key === expectedQuizKey
          );

        let bestAttempt = null;

        if (subjectAttempts.length > 0) {

          bestAttempt =
            subjectAttempts.reduce(
              (best, current) => {

                if (
                  !best ||
                  current.percentage >
                  best.percentage
                ) {
                  return current;
                }

                return best;
              },
              null
            );
        }

        return {

          ...subject,

          quizKey: expectedQuizKey,

          completed:
            !!bestAttempt,

          percentage:
            bestAttempt
              ? bestAttempt.percentage
              : 0,

          passed:
            bestAttempt
              ? bestAttempt.percentage >= 40
              : false

        };

      });


    // =========================================================
    // CERTIFICATE ELIGIBILITY
    // =========================================================

    const completedSubjects =
      subjectResults.filter(
        s => s.completed
      ).length;

    const passedSubjects =
      subjectResults.filter(
        s => s.passed
      ).length;

    const certificateUnlocked =
      passedSubjects ===
      requiredSubjects.length;


    // =========================================================
    // OVERALL SCORE
    // =========================================================

    const overallScore =
      certificateUnlocked
        ? Math.round(
            subjectResults.reduce(
              (sum, subject) =>
                sum + subject.percentage,
              0
            ) /
            requiredSubjects.length
          )
        : 0;


    // =========================================================
    // LOCKED CERTIFICATE
    // =========================================================

    if (!certificateUnlocked) {

      main.innerHTML = `

        <div class="section-header">

          <div>

            <h2 class="section-title">
              📜 Certificate
            </h2>

            <div class="section-subtitle">
              Complete all required quizzes to earn your certificate
            </div>

          </div>

        </div>


        <div
          class="card"
          style="
            max-width:850px;
            margin:0 auto;
            text-align:center;
            padding:40px;
          "
        >

          <div
            style="
              font-size:4rem;
              margin-bottom:15px;
            "
          >
            🔒
          </div>


          <h2
            style="
              color:var(--color-primary);
              margin-bottom:10px;
            "
          >
            Certificate Locked
          </h2>


          <p
            style="
              color:var(--text-muted);
              margin-bottom:25px;
            "
          >
            Complete all 6 subject quizzes for
            Class ${studentClass} and score at least
            <strong>40%</strong> in every subject.
          </p>


          <div
            style="
              margin-bottom:25px;
              font-size:1.1rem;
              font-weight:700;
            "
          >

            ${passedSubjects} / 6 Subjects Passed

          </div>


          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(220px,1fr));
              gap:12px;
              text-align:left;
            "
          >

            ${subjectResults.map(subject => `

              <div
                style="
                  padding:15px;
                  border:1px solid var(--border-subtle);
                  border-radius:10px;
                  background:var(--bg-subtle);
                "
              >

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                  "
                >

                  <strong>

                    ${subject.icon}
                    ${subject.name}

                  </strong>


                  <span>

                    ${
                      subject.passed
                        ? '✅'
                        : subject.completed
                          ? '❌'
                          : '🔒'
                    }

                  </span>

                </div>


                <div
                  style="
                    margin-top:8px;
                    font-size:0.9rem;
                    color:var(--text-muted);
                  "
                >

                  ${
                    subject.completed
                      ? `Best Score: ${subject.percentage}%`
                      : 'Quiz not completed'
                  }

                </div>

              </div>

            `).join('')}

          </div>


          <button
            class="btn btn-primary"
            style="margin-top:30px;"
            onclick="AppRouter.navigate('quizzes')"
          >

            ✍️ Go to Quizzes

          </button>

        </div>

      `;

      return;
    }


    // =========================================================
    // CERTIFICATE UNLOCKED
    // =========================================================

    const studentName =
      this.auth.name ||
      p.name ||
      'Student';

    const school =
      p.school ||
      'Shiksha Setu Digital School';

    const dateStr =
      new Date().toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      );


    // =========================================================
    // CERTIFICATE ID
    // =========================================================

    const cleanName =
      studentName
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .substring(0, 4);

    const certificateId =
      `SS-${studentClass}-${cleanName}-${new Date().getFullYear()}`;


    // =========================================================
    // DISPLAY CERTIFICATE
    // =========================================================

    main.innerHTML = `

      <div class="section-header btn-print-hide">

        <div>

          <h2 class="section-title">
            🎓 Certificate Earned!
          </h2>

          <div class="section-subtitle">
            Congratulations! You successfully completed
            all required subject quizzes.
          </div>

        </div>


        <button
          class="btn btn-primary"
          onclick="window.print()"
        >

          🖨️ Print Certificate

        </button>

      </div>


      <div class="certificate-frame">

        <div class="cert-watermark">
          SHIKSHA SETU
        </div>


        <div
          style="
            font-weight:700;
            color:var(--color-secondary);
            letter-spacing:1px;
            margin-bottom:8px;
          "
        >

          GOVERNMENT DIGITAL EDUCATION PORTAL

        </div>


        <h1 class="cert-title">

          CERTIFICATE OF ACHIEVEMENT

        </h1>


        <div class="cert-subtitle">

          This certificate is proudly presented to

        </div>


        <div class="cert-name">

          ${studentName}

        </div>


        <div class="cert-body">

          For successfully completing the
          Class ${studentClass} learning assessments
          on the Shiksha Setu Digital Education Platform.

        </div>


        <div
          style="
            font-weight:700;
            margin-bottom:20px;
          "
        >

          Class ${studentClass}
          &nbsp; | &nbsp;
          Overall Score: ${overallScore}%

        </div>


        <div
          style="
            margin-bottom:25px;
            font-size:0.9rem;
          "
        >

          ${school}

        </div>


        <div
          style="
            display:flex;
            justify-content:center;
            gap:8px;
            flex-wrap:wrap;
            margin-bottom:30px;
          "
        >

          ${subjectResults.map(subject => `

            <span class="chip chip-primary">

              ${subject.icon}
              ${subject.name}
              ${subject.percentage}%

            </span>

          `).join('')}

        </div>


        <div class="cert-signatures">

          <div class="sig-block">

            <div class="sig-line"></div>

            <div
              style="
                font-weight:700;
                font-size:0.9rem;
              "
            >

              Headmaster / Principal

            </div>


            <div
              style="
                font-size:0.8rem;
                color:var(--text-muted);
              "
            >

              ${school}

            </div>

          </div>


          <div
            style="
              display:flex;
              align-items:center;
              justify-content:center;
            "
          >

            <div
              style="
                width:80px;
                height:80px;
                border:3px solid var(--color-primary);
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-weight:800;
                font-size:0.75rem;
                color:var(--color-primary);
                transform:rotate(-15deg);
              "
            >

              OFFICIAL
              <br>
              SEAL

            </div>

          </div>


          <div class="sig-block">

            <div class="sig-line"></div>

            <div
              style="
                font-weight:700;
                font-size:0.9rem;
              "
            >

              Portal Coordinator

            </div>


            <div
              style="
                font-size:0.8rem;
                color:var(--text-muted);
              "
            >

              Issued on ${dateStr}

            </div>

          </div>

        </div>


        <div
          style="
            margin-top:25px;
            padding-top:15px;
            border-top:1px solid var(--border-subtle);
            font-size:0.8rem;
            color:var(--text-muted);
          "
        >

          Certificate ID:
          <strong>${certificateId}</strong>

        </div>

      </div>

    `;


  } catch (error) {

    console.error(
      'Certificate error:',
      error
    );

    main.innerHTML = `

      <div class="card">

        <h3>
          ⚠️ Unable to Load Certificate
        </h3>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

},

  // --- View 16: Create Class & Subject Manager ---
  renderClassesManage(main) {
    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">🏫 Create & Manage Classes, Subjects & Chapters</h2>
          <div class="section-subtitle">Define structured curriculum grades for authoring content</div>
        </div>
        <button class="btn btn-outline" onclick="AppRouter.navigate('teacher')">← Back to Dashboard</button>
      </div>

      <div class="card" style="margin-bottom: var(--space-xl);">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">Create New Course & Class Structure</h3>
        <form onsubmit="event.preventDefault(); AppRouter.handleCreateCourseSubmit();">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Course / Class Title</label>
              <input type="text" id="new-course-title" class="form-control" placeholder="e.g. Class 8 Science Basics" required>
            </div>
            <div class="form-group">
              <label class="form-label">Class Grade</label>
              <select id="new-course-class" class="form-select">
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8" selected>Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Subject</label>
              <select id="new-course-subject" class="form-select">
                <option value="sci">Science</option>
                <option value="math">Mathematics</option>
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="sst">Social Science</option>
                <option value="comp">Computer Basics</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">First Chapter Title</label>
              <input type="text" id="new-course-chapter" class="form-control" placeholder="e.g. Chapter 1: Introduction" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-sm);">🏫 Create Course Structure</button>
        </form>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">Existing Course & Subject Hierarchy</h3>
        <div class="tree-container">
          ${SHIKSHA_DATA.courses.map(c => `
            <div style="font-weight: 700; color: var(--color-primary); font-size: 1.1rem; margin-top: 8px;">
              📚 Class ${c.classId} - ${c.title} (${c.subjectId.toUpperCase()})
            </div>
            <div class="tree-node">
              ${c.chapters.map(ch => `
                <div style="font-weight: 600; color: var(--text-secondary); margin-top: 4px;">
                  📁 ${ch.title}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  handleCreateCourseSubmit() {
    const title = document.getElementById('new-course-title')?.value;
    const classId = document.getElementById('new-course-class')?.value;
    const subjectId = document.getElementById('new-course-subject')?.value;
    const chTitle = document.getElementById('new-course-chapter')?.value;

    const course = AuthoringEngine.createCourse(title, classId, subjectId);
    AuthoringEngine.createChapter(course.id, chTitle);

    alert(`Course "${title}" created successfully!`);
    this.renderClassesManage(document.getElementById('view-container'));
  },

  // --- View 17: Dedicated Document Upload Center ---
  renderUploadCenter(main) {
    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">📤 Document & Resource Upload Center</h2>
          <div class="section-subtitle">Upload, replace, preview, and manage educational PDF & study documents for students</div>
        </div>
        <button class="btn btn-outline" onclick="AppRouter.navigate('teacher')">← Back to Dashboard</button>
      </div>

      <div class="grid-2" style="margin-bottom: var(--space-xl);">
        <!-- Upload Form Card -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: var(--space-md);">Upload New Educational Resource</h3>
          <form onsubmit="event.preventDefault(); AppRouter.handleMediaUploadSubmit();">
            <div class="form-group">
              <label class="form-label">Asset Type</label>
              <select id="upload-type" class="form-select">
                <option value="pdf">📄 PDF / Study Notes Document</option>
                <option value="worksheet">📝 Worksheet / Practice Sheet</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Target Class & Topic</label>
              <select id="upload-topic-select" class="form-select">
                ${SHIKSHA_DATA.courses.map(c =>
                  c.chapters.map(ch =>
                    ch.topics.map(t => `<option value="${t.id}">Class ${c.classId} - ${t.title}</option>`).join('')
                  ).join('')
                ).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Title / Document Name</label>
              <input type="text" id="upload-title" class="form-control" placeholder="e.g. Science Chapter Notes" required>
            </div>

            <div class="form-group">
              <label class="form-label">Description / Objectives</label>
              <textarea id="upload-desc" class="form-control" rows="2" placeholder="Brief summary for students..."></textarea>
            </div>

            <div class="upload-box" style="margin-bottom: var(--space-md);">
              <div style="font-size: 2.2rem; margin-bottom: 4px;">📁</div>
              <div style="font-weight: 700;">Drag & Drop File Here or Click to Select File</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Supports PDF, DOCX educational documents</div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">📤 Upload Document Now</button>
          </form>
        </div>

        <!-- Existing Documents Card -->
        <div class="card">
          <h3 class="card-title" style="margin-bottom: var(--space-md);">📋 Uploaded Documents</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-sm);">

            <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm);">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📄 Science Chapter 3 – Atoms.pdf</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">245 KB | Class 8 Science</div>
              </div>
              <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center;">
                <button class="btn btn-sm btn-primary" onclick="AppRouter.downloadDemoPdf('lib_2')">Download</button>
                <button class="btn btn-sm btn-outline" onclick="alert('Document removed.')">Remove</button>
              </div>
            </div>

            <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm);">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📄 Class 6 Math Formula Sheet.pdf</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">120 KB | Class 6 Mathematics</div>
              </div>
              <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center;">
                <button class="btn btn-sm btn-primary" onclick="AppRouter.downloadDemoPdf('lib_1')">Download</button>
                <button class="btn btn-sm btn-outline" onclick="alert('Document removed.')">Remove</button>
              </div>
            </div>

            <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm);">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📝 English Grammar Worksheet Set 1</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">85 KB | Class 7 English</div>
              </div>
              <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: center;">
                <button class="btn btn-sm btn-primary" onclick="AppRouter.downloadDemoPdf('lib_3')">Download</button>
                <button class="btn btn-sm btn-outline" onclick="alert('Document removed.')">Remove</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },


  handleMediaUploadSubmit() {
    const type = document.getElementById('upload-type')?.value;
    const topicId = document.getElementById('upload-topic-select')?.value;
    const title = document.getElementById('upload-title')?.value;
    const desc = document.getElementById('upload-desc')?.value;

    if (type === 'video') {
      AuthoringEngine.saveVideo(topicId, {
        title,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: desc
      });
      alert(`Educational Video "${title}" uploaded and attached to topic!`);
    } else {
      AuthoringEngine.savePdf(topicId, {
        title: title.endsWith('.pdf') ? title : title + '.pdf',
        fileSize: '2.1 MB',
        description: desc
      });
      alert(`Document "${title}" uploaded and attached to topic!`);
    }

    this.renderUploadCenter(document.getElementById('view-container'));
  },

  // --- View 18: Settings ---
  renderSettings(main) {
    const isTeacher = this.auth.isLoggedIn && this.auth.role === 'teacher';
    const p = ProgressTracker.profile;

    main.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">${isTeacher ? '👨‍🏫 Teacher Account Settings' : t('nav_settings')}</h2>
          <div class="section-subtitle">${isTeacher ? 'Manage teacher credentials & school administration' : 'Customize student preferences & interface features'}</div>
        </div>
      </div>

      ${isTeacher ? `
        <div class="card" style="margin-bottom: var(--space-lg);">
          <h3 class="card-title" style="margin-bottom: var(--space-md);">Teacher Profile & Administration</h3>
          <div class="form-group">
            <label class="form-label">Teacher Name & Designation</label>
            <input type="text" id="teacher-setting-name" class="form-control" value="${this.auth.name}">
          </div>
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" id="teacher-setting-school" class="form-control" value="${p.school}">
          </div>
          <div class="form-group">
            <label class="form-label">Security PIN</label>
            <input type="password" class="form-control" value="1234">
          </div>
          <button class="btn btn-primary" onclick="alert('Teacher Settings Saved!'); AppRouter.navigate('teacher');">Save Teacher Settings</button>
        </div>
      ` : `
        <div class="card" style="margin-bottom: var(--space-lg);">
          <h3 class="card-title" style="margin-bottom: var(--space-md);">Student Profile Settings</h3>
          <div class="form-group">
            <label class="form-label">Student Name</label>
            <input type="text" id="setting-name" class="form-control" value="${p.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Selected Class</label>
            <select id="setting-class" class="form-select">
              ${[6,7,8,9,10].map(c => `<option value="${c}" ${c === p.selectedClass ? 'selected' : ''}>Class ${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" id="setting-school" class="form-control" value="${p.school}">
          </div>
          <button class="btn btn-primary" onclick="AppRouter.saveProfileSettings()">Save Settings</button>
        </div>
      `}

      <div class="card">
        <h3 class="card-title" style="margin-bottom: var(--space-md);">Accessibility & Interface Controls</h3>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <div style="font-weight: 700;">${t('font_size')}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">Adjust readability scale</div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.setFontSize('sm')">Small</button>
            <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.setFontSize('md')">Normal</button>
            <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.setFontSize('lg')">Large</button>
            <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.setFontSize('xl')">Extra Large</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <div style="font-weight: 700;">${t('high_contrast')}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">High visibility borders & dark text</div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.toggleHighContrast(); alert('High Contrast Mode toggled.');">Toggle</button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 700;">${t('low_data')}</div>
            <div style="font-size: 0.88rem; color: var(--text-muted);">Reduce memory and mobile data usage</div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="AccessibilityManager.toggleLowData(); alert('Low Data Mode toggled.');">Toggle</button>
        </div>
      </div>
    `;
  },

  saveProfileSettings() {
    const name = document.getElementById('setting-name')?.value;
    const selectedClass = parseInt(document.getElementById('setting-class')?.value || 6);
    const school = document.getElementById('setting-school')?.value;

    if (name) ProgressTracker.profile.name = name;
    if (selectedClass) ProgressTracker.profile.selectedClass = selectedClass;
    if (school) ProgressTracker.profile.school = school;

    ProgressTracker.saveState();
    alert('Settings saved successfully!');
    this.navigate('dashboard');
  }
};
