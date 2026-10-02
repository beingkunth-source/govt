/* ==========================================================================
   SHIKSHA SETU - DEVELOPMENT SEED DATA
   Run only in development. Does NOT overwrite existing records.
   ========================================================================== */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const isSupabase = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase');
const poolConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : false
} : {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shiksha_setu_db',
  user: process.env.DB_USER || 'shiksha_user',
  password: process.env.DB_PASSWORD
};

const pool = new Pool(poolConfig);

const SALT_ROUNDS = 12;

async function seed() {
  console.log('🌱 Seeding Shiksha Setu development data...');

  try {
    // --- SCHOOL ---
    const schoolRes = await pool.query(`
      INSERT INTO schools (school_name, school_code, district, state)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (school_code) DO UPDATE SET school_name = EXCLUDED.school_name
      RETURNING id
    `, ['Zilla Parishad Govt High School, Pune', 'ZP-PUNE-001', 'Pune', 'Maharashtra']);
    const schoolId = schoolRes.rows[0].id;
    console.log(`✅ School seeded (id: ${schoolId})`);

    // --- TEACHER ---
    const teacherPasswordHash = await bcrypt.hash('Teacher@1234', SALT_ROUNDS);
    const teacherRes = await pool.query(`
      INSERT INTO teachers (school_id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [schoolId, 'Mr. S. Patil', 'spatil@school.edu', teacherPasswordHash]);
    const teacherId = teacherRes.rows[0].id;
    await pool.query(`
      INSERT INTO teachers (school_id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `, [schoolId, 'Headmaster Teacher', 'teacher@shikshasetu.edu', teacherPasswordHash]);
    console.log(`✅ Teachers seeded (id: ${teacherId})`);

    // --- STUDENTS ---
    const studentPassword = await bcrypt.hash('Student@1234', SALT_ROUNDS);
    const studentsData = [
      { name: 'Aarav Kumar',  email: 'aarav@student.edu',  class: 8  },
      { name: 'Priya Sharma', email: 'priya@student.edu',  class: 9  },
      { name: 'Rohan Patil',  email: 'rohan@student.edu',  class: 6  },
      { name: 'Anjali More',  email: 'anjali@student.edu', class: 10 },
      { name: 'Vikas Desai',  email: 'vikas@student.edu',  class: 7  }
    ];

    const studentIds = {};
    for (const s of studentsData) {
      const res = await pool.query(`
        INSERT INTO students (school_id, name, email, password_hash, class_number)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `, [schoolId, s.name, s.email, studentPassword, s.class]);
      studentIds[s.email] = res.rows[0].id;
      console.log(`✅ Student seeded: ${s.name} (class ${s.class})`);
    }

    // --- CLASSES 6-10 ---
    const classIds = {};
    for (let cn = 6; cn <= 10; cn++) {
      const res = await pool.query(`
        INSERT INTO classes (school_id, class_number)
        VALUES ($1, $2)
        ON CONFLICT (school_id, class_number) DO UPDATE SET class_number = EXCLUDED.class_number
        RETURNING id
      `, [schoolId, cn]);
      classIds[cn] = res.rows[0].id;
    }
    console.log('✅ Classes 6-10 seeded');

    // --- SUBJECTS ---
    const subjectKeys = ['math', 'sci', 'eng', 'hin', 'sst', 'comp'];
    const subjectNames = {
      math: 'Mathematics', sci: 'Science', eng: 'English',
      hin: 'Hindi', sst: 'Social Science', comp: 'Computer Basics'
    };
    const subjectIds = {};
    for (let cn = 6; cn <= 10; cn++) {
      subjectIds[cn] = {};
      for (const key of subjectKeys) {
        const res = await pool.query(`
          INSERT INTO subjects (class_id, name, subject_key)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          RETURNING id
        `, [classIds[cn], subjectNames[key], key]);
        if (res.rows.length > 0) {
          subjectIds[cn][key] = res.rows[0].id;
        } else {
          const existing = await pool.query(
            'SELECT id FROM subjects WHERE class_id = $1 AND subject_key = $2',
            [classIds[cn], key]
          );
          subjectIds[cn][key] = existing.rows[0]?.id;
        }
      }
    }
    console.log('✅ Subjects seeded (6 subjects × 5 classes)');

    // --- CHAPTERS & LESSONS (mirroring SHIKSHA_DATA lesson_keys) ---
    const lessonData = [
      { classNum: 6, subjectKey: 'math', chapterName: 'Chapter 1: Knowing Our Numbers', lessons: [
        { key: 'math_6_c1_l1', title: 'Lesson 1: Comparing Large Numbers' },
        { key: 'math_6_c1_l2', title: 'Lesson 2: Estimation & Rounding Off' }
      ]},
      { classNum: 6, subjectKey: 'sci', chapterName: 'Chapter 1: Food - Where Does It Come From?', lessons: [
        { key: 'sci_6_c1_l1', title: 'Lesson 1: Food Variety & Sources' }
      ]},
      { classNum: 6, subjectKey: 'comp', chapterName: 'Chapter 1: Introduction to Computers', lessons: [
        { key: 'comp_6_c1_l1', title: 'Lesson 1: Hardware & Software Basics' }
      ]},
      { classNum: 7, subjectKey: 'math', chapterName: 'Chapter 1: Integers', lessons: [
        { key: 'math_7_c1_l1', title: 'Lesson 1: Addition & Subtraction of Integers' }
      ]},
      { classNum: 8, subjectKey: 'sci', chapterName: 'Chapter 1: Crop Production & Management', lessons: [
        { key: 'sci_8_c1_l1', title: 'Lesson 1: Agricultural Practices' }
      ]},
      { classNum: 9, subjectKey: 'math', chapterName: 'Chapter 1: Number Systems', lessons: [
        { key: 'math_9_c1_l1', title: 'Lesson 1: Irrational Numbers & Real Numbers' }
      ]},
      { classNum: 10, subjectKey: 'sci', chapterName: 'Chapter 1: Light - Reflection & Refraction', lessons: [
        { key: 'sci_10_c1_l1', title: 'Lesson 1: Laws of Reflection & Spherical Mirrors' }
      ]}
    ];

    for (const ld of lessonData) {
      const subjectId = subjectIds[ld.classNum]?.[ld.subjectKey];
      if (!subjectId) continue;

      const chRes = await pool.query(`
        INSERT INTO chapters (subject_id, name, display_order)
        VALUES ($1, $2, 1)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [subjectId, ld.chapterName]);

      let chapterId;
      if (chRes.rows.length > 0) {
        chapterId = chRes.rows[0].id;
      } else {
        const existing = await pool.query(
          'SELECT id FROM chapters WHERE subject_id = $1 AND name = $2',
          [subjectId, ld.chapterName]
        );
        chapterId = existing.rows[0]?.id;
      }

      for (let i = 0; i < ld.lessons.length; i++) {
        const les = ld.lessons[i];
        await pool.query(`
          INSERT INTO lessons (chapter_id, lesson_key, title, display_order, published)
          VALUES ($1, $2, $3, $4, TRUE)
          ON CONFLICT (lesson_key) DO UPDATE SET title = EXCLUDED.title
        `, [chapterId, les.key, les.title, i + 1]);
      }
    }
    console.log('✅ Chapters and lessons seeded');

    // --- QUIZZES (mirroring SHIKSHA_DATA quiz ids) ---
    const quizzesData = [
      {
        key: 'quiz_math_6', title: 'Class 6 Math Foundations Quiz',
        classNum: 6, subjectKey: 'math', timer: 300,
        questions: [
          { question: 'What is the place value of 7 in 5,74,321?', options: ['70','7,000','70,000','700'], correct: 2, explanation: '7 is at the ten-thousands place.' },
          { question: 'Which number is smallest?', options: ['12,450','12,045','12,504','12,405'], correct: 1, explanation: '12,045 has 0 in the hundreds place.' },
          { question: 'Round off 489 to nearest hundreds.', options: ['400','490','500','450'], correct: 2, explanation: '8 >= 5, so 489 rounds up to 500.' }
        ]
      },
      {
        key: 'quiz_sci_6', title: 'Class 6 Science Food Quiz',
        classNum: 6, subjectKey: 'sci', timer: 300,
        questions: [
          { question: 'Which part of the carrot plant do we eat?', options: ['Stem','Leaf','Root','Flower'], correct: 2, explanation: 'Carrot is a modified taproot.' },
          { question: 'Animals that eat only plants are called:', options: ['Carnivores','Herbivores','Omnivores','Decomposers'], correct: 1, explanation: 'Herbivores feed directly on plant materials.' }
        ]
      }
    ];

    for (const qd of quizzesData) {
      const subjectId = subjectIds[qd.classNum]?.[qd.subjectKey];
      const qRes = await pool.query(`
        INSERT INTO quizzes (quiz_key, title, subject_id, timer_seconds, published)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (quiz_key) DO UPDATE SET title = EXCLUDED.title
        RETURNING id
      `, [qd.key, qd.title, subjectId, qd.timer]);
      const quizId = qRes.rows[0].id;

      // Delete and re-insert questions (idempotent)
      await pool.query('DELETE FROM quiz_questions WHERE quiz_id = $1', [quizId]);
      for (let i = 0; i < qd.questions.length; i++) {
        const q = qd.questions[i];
        await pool.query(`
          INSERT INTO quiz_questions (quiz_id, question, options, correct_index, explanation, display_order)
          VALUES ($1, $2, $3::jsonb, $4, $5, $6)
        `, [quizId, q.question, JSON.stringify(q.options), q.correct, q.explanation, i + 1]);
      }
    }
    console.log('✅ Quizzes and questions seeded');

    // --- BADGES (mirroring SHIKSHA_DATA.badges) ---
    const badgesData = [
      { key: 'b_first',       name: 'First Lesson',     icon: '🌟', description: 'Completed your very first lesson!',           requirement: 'Complete 1 lesson' },
      { key: 'b_quiz_master', name: 'Quiz Master',       icon: '🏆', description: 'Scored 100% on any chapter quiz.',            requirement: 'Score 100% on a quiz' },
      { key: 'b_streak_3',   name: '3-Day Streak',      icon: '🔥', description: 'Logged in and learned 3 days in a row.',      requirement: 'Maintain 3-day streak' },
      { key: 'b_math_star',  name: 'Math Genius',        icon: '📐', description: 'Completed 3 Mathematics lessons.',            requirement: 'Complete 3 math lessons' },
      { key: 'b_sci_explorer',name: 'Science Explorer',  icon: '🔬', description: 'Completed 3 Science lessons.',                requirement: 'Complete 3 science lessons' }
    ];

    for (const b of badgesData) {
      await pool.query(`
        INSERT INTO badges (badge_key, name, description, icon, requirement)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (badge_key) DO UPDATE SET name = EXCLUDED.name
      `, [b.key, b.name, b.description, b.icon, b.requirement]);
    }
    console.log('✅ Badges seeded (5 badges)');

    // --- LIBRARY RESOURCES (mirroring SHIKSHA_DATA.library) ---
    const libraryData = [
      { key: 'lib_1', title: 'Class 6 Math Formula Sheet',       type: 'Formula Sheets', classNum: 6, subjectKey: 'math', description: 'Quick reference sheet for Perimeter, Area, and Number System rules.' },
      { key: 'lib_2', title: 'Class 8 Science Summary Notes',    type: 'Notes',          classNum: 8, subjectKey: 'sci',  description: 'Chapter 1 to 5 consolidated key points for quick revision.' },
      { key: 'lib_3', title: 'Class 10 Model Question Paper 2026', type: 'Question Papers', classNum: 10, subjectKey: 'sci', description: 'Official sample board paper with answer key and marking scheme.' },
      { key: 'lib_4', title: 'Computer Basics Shortcut Key Chart', type: 'Study Material', classNum: 6, subjectKey: 'comp', description: 'Handy keyboard shortcuts table for CTRL+C, CTRL+V, CTRL+Z, and more.' }
    ];

    for (const lr of libraryData) {
      await pool.query(`
        INSERT INTO library_resources (resource_key, title, description, resource_type, class_number, subject_key, uploaded_by, published)
        VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
        ON CONFLICT DO NOTHING
      `, [lr.key, lr.title, lr.description, lr.type, lr.classNum, lr.subjectKey, teacherId]);
    }
    console.log('✅ Library resources seeded (4 resources)');

    console.log('\n🎉 Shiksha Setu seed data complete!');
    console.log('\n📋 Login credentials:');
    console.log('   Teacher:  spatil@school.edu  / Teacher@1234');
    console.log('   Students: aarav@student.edu  / Student@1234');
    console.log('            priya@student.edu  / Student@1234');
    console.log('            rohan@student.edu  / Student@1234');
    console.log('            anjali@student.edu / Student@1234');
    console.log('            vikas@student.edu  / Student@1234');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
