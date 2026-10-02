-- ==========================================================================
-- SHIKSHA SETU - INITIAL DATABASE SCHEMA
-- PostgreSQL 14+
-- ==========================================================================

-- Enable updated_at auto-trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================================
-- SCHOOLS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS schools (
  id            SERIAL PRIMARY KEY,
  school_name   VARCHAR(200) NOT NULL,
  school_code   VARCHAR(50)  NOT NULL UNIQUE,
  district      VARCHAR(100),
  state         VARCHAR(100) DEFAULT 'Maharashtra',
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_schools_updated_at ON schools;
CREATE TRIGGER trg_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================================================
-- TEACHERS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS teachers (
  id            SERIAL PRIMARY KEY,
  school_id     INT REFERENCES schools(id) ON DELETE SET NULL,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_teachers_updated_at ON teachers;
CREATE TRIGGER trg_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id);

-- ==========================================================================
-- STUDENTS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS students (
  id                  SERIAL PRIMARY KEY,
  school_id           INT REFERENCES schools(id) ON DELETE SET NULL,
  name                VARCHAR(150) NOT NULL,
  class_number        SMALLINT NOT NULL CHECK (class_number BETWEEN 6 AND 10),
  email               VARCHAR(200) UNIQUE,
  password_hash       VARCHAR(255),
  avatar              VARCHAR(20)  DEFAULT '👨‍🎓',
  preferred_language  CHAR(2)      DEFAULT 'en' CHECK (preferred_language IN ('en','hi','mr')),
  xp                  INT          DEFAULT 0 CHECK (xp >= 0),
  streak              SMALLINT     DEFAULT 1 CHECK (streak >= 0),
  last_active_date    DATE,
  created_at          TIMESTAMPTZ  DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_number);

-- ==========================================================================
-- CLASSES (school-level class records)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS classes (
  id           SERIAL PRIMARY KEY,
  school_id    INT REFERENCES schools(id) ON DELETE CASCADE,
  class_number SMALLINT NOT NULL CHECK (class_number BETWEEN 6 AND 10),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (school_id, class_number)
);

DROP TRIGGER IF EXISTS trg_classes_updated_at ON classes;
CREATE TRIGGER trg_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================================================
-- SUBJECTS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS subjects (
  id           SERIAL PRIMARY KEY,
  class_id     INT REFERENCES classes(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  subject_key  VARCHAR(20) CHECK (subject_key IN ('math','sci','eng','hin','sst','comp')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_subjects_updated_at ON subjects;
CREATE TRIGGER trg_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_subjects_class ON subjects(class_id);

-- ==========================================================================
-- CHAPTERS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS chapters (
  id            SERIAL PRIMARY KEY,
  subject_id    INT REFERENCES subjects(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  display_order SMALLINT DEFAULT 1,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_chapters_updated_at ON chapters;
CREATE TRIGGER trg_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_chapters_subject ON chapters(subject_id);

-- ==========================================================================
-- LESSONS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS lessons (
  id            SERIAL PRIMARY KEY,
  chapter_id    INT REFERENCES chapters(id) ON DELETE CASCADE,
  lesson_key    VARCHAR(100) UNIQUE,
  title         VARCHAR(300) NOT NULL,
  content       TEXT,
  display_order SMALLINT DEFAULT 1,
  published     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_lessons_updated_at ON lessons;
CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_key ON lessons(lesson_key);

-- ==========================================================================
-- QUIZZES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id             SERIAL PRIMARY KEY,
  quiz_key       VARCHAR(100) UNIQUE,
  title          VARCHAR(300) NOT NULL,
  subject_id     INT REFERENCES subjects(id) ON DELETE SET NULL,
  lesson_id      INT REFERENCES lessons(id) ON DELETE SET NULL,
  timer_seconds  INT DEFAULT 300 CHECK (timer_seconds > 0),
  published      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_quizzes_updated_at ON quizzes;
CREATE TRIGGER trg_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject_id);

-- ==========================================================================
-- QUIZ QUESTIONS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id            SERIAL PRIMARY KEY,
  quiz_id       INT REFERENCES quizzes(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  options       JSONB NOT NULL,
  correct_index SMALLINT NOT NULL CHECK (correct_index >= 0),
  explanation   TEXT,
  display_order SMALLINT DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);

-- ==========================================================================
-- QUIZ ATTEMPTS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id                  SERIAL PRIMARY KEY,
  student_id          INT REFERENCES students(id) ON DELETE CASCADE,
  quiz_key            VARCHAR(100) NOT NULL,
  score               SMALLINT NOT NULL CHECK (score >= 0),
  total               SMALLINT NOT NULL CHECK (total > 0),
  percentage          SMALLINT NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  time_taken_seconds  INT CHECK (time_taken_seconds >= 0),
  attempted_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_key ON quiz_attempts(quiz_key);

-- ==========================================================================
-- STUDENT PROGRESS (per-lesson completion)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS student_progress (
  id           SERIAL PRIMARY KEY,
  student_id   INT REFERENCES students(id) ON DELETE CASCADE,
  lesson_key   VARCHAR(100) NOT NULL,
  completed    BOOLEAN DEFAULT FALSE,
  xp_earned    SMALLINT DEFAULT 0 CHECK (xp_earned >= 0),
  completed_at TIMESTAMPTZ,
  UNIQUE (student_id, lesson_key)
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_key ON student_progress(lesson_key);

-- ==========================================================================
-- BADGES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS badges (
  id          SERIAL PRIMARY KEY,
  badge_key   VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon        VARCHAR(20),
  requirement TEXT
);

-- ==========================================================================
-- STUDENT BADGES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS student_badges (
  id          SERIAL PRIMARY KEY,
  student_id  INT REFERENCES students(id) ON DELETE CASCADE,
  badge_key   VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_student_badges_student ON student_badges(student_id);

-- ==========================================================================
-- ASSIGNMENTS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS assignments (
  id          SERIAL PRIMARY KEY,
  teacher_id  INT REFERENCES teachers(id) ON DELETE SET NULL,
  class_id    INT REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id   INT REFERENCES lessons(id) ON DELETE SET NULL,
  quiz_id     INT REFERENCES quizzes(id) ON DELETE SET NULL,
  due_date    DATE,
  status      VARCHAR(30) DEFAULT 'Assigned' CHECK (status IN ('Assigned','In Progress','Completed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);

-- ==========================================================================
-- DIGITAL LIBRARY
-- ==========================================================================
CREATE TABLE IF NOT EXISTS library_resources (
  id            SERIAL PRIMARY KEY,
  resource_key  VARCHAR(50),
  title         VARCHAR(300) NOT NULL,
  description   TEXT,
  resource_type VARCHAR(50),
  resource_url  TEXT,
  class_number  SMALLINT CHECK (class_number BETWEEN 6 AND 10),
  subject_key   VARCHAR(20),
  uploaded_by   INT REFERENCES teachers(id) ON DELETE SET NULL,
  published     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_library_class ON library_resources(class_number);
CREATE INDEX IF NOT EXISTS idx_library_subject ON library_resources(subject_key);
