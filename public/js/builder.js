/* ==========================================================================
   SHIKSHA SETU - TEACHER AUTHORING & LMS CONTENT ENGINE
   ========================================================================== */

const AuthoringEngine = {
  // Load saved custom courses from localStorage or default
  init() {
    const savedCourses = localStorage.getItem('shiksha_lms_courses');
    if (savedCourses) {
      try {
        SHIKSHA_DATA.courses = JSON.parse(savedCourses);
      } catch (e) {
        console.error('Failed to parse saved courses:', e);
      }
    }

    const savedAssignments = localStorage.getItem('shiksha_lms_assignments');
    if (savedAssignments) {
      try {
        SHIKSHA_DATA.assignments = JSON.parse(savedAssignments);
      } catch (e) {
        console.error('Failed to parse saved assignments:', e);
      }
    }
  },

  saveState() {
    localStorage.setItem('shiksha_lms_courses', JSON.stringify(SHIKSHA_DATA.courses));
    localStorage.setItem('shiksha_lms_assignments', JSON.stringify(SHIKSHA_DATA.assignments));
  },

  // --- Hierarchy Creation ---
  createCourse(title, classId, subjectId) {
    const newCourse = {
      id: 'course_' + Date.now(),
      title,
      classId: parseInt(classId),
      subjectId,
      status: 'Draft',
      assignedCount: 0,
      chapters: []
    };
    SHIKSHA_DATA.courses.unshift(newCourse);
    this.saveState();
    return newCourse;
  },

  createChapter(courseId, chapterTitle) {
    const course = SHIKSHA_DATA.courses.find(c => c.id === courseId);
    if (!course) return null;

    const newChapter = {
      id: 'ch_' + Date.now(),
      title: chapterTitle,
      topics: []
    };
    course.chapters.push(newChapter);
    this.saveState();
    return newChapter;
  },

  createTopic(courseId, chapterId, topicTitle) {
    const course = SHIKSHA_DATA.courses.find(c => c.id === courseId);
    if (!course) return null;

    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return null;

    const newTopic = {
      id: 'top_' + Date.now(),
      title: topicTitle,
      status: 'Draft',
      pages: [
        {
          id: 'p_' + Date.now(),
          title: 'Page 1: Overview',
          headings: 'Introduction to Topic',
          paragraph: 'Enter learning content paragraph here...',
          keyPoints: ['Key takeaway point 1'],
          importantNote: 'Important learning note for students.'
        }
      ],
      video: null,
      pdf: null,
      quiz: null
    };
    chapter.topics.push(newTopic);
    this.saveState();
    return newTopic;
  },

  // --- Page Builder Actions ---
  findTopic(topicId) {
    for (const course of SHIKSHA_DATA.courses) {
      for (const chapter of course.chapters) {
        for (const topic of chapter.topics) {
          if (topic.id === topicId) return { course, chapter, topic };
        }
      }
    }
    return null;
  },

  addPage(topicId, pageObj) {
    const res = this.findTopic(topicId);
    if (!res) return;

    const newPage = {
      id: 'p_' + Date.now(),
      title: pageObj.title || `Page ${res.topic.pages.length + 1}`,
      headings: pageObj.headings || 'New Heading',
      paragraph: pageObj.paragraph || '',
      keyPoints: pageObj.keyPoints || [],
      importantNote: pageObj.importantNote || '',
      examples: pageObj.examples || []
    };

    res.topic.pages.push(newPage);
    this.saveState();
  },

  editPage(topicId, pageIndex, pageObj) {
    const res = this.findTopic(topicId);
    if (!res || !res.topic.pages[pageIndex]) return;

    res.topic.pages[pageIndex] = {
      ...res.topic.pages[pageIndex],
      ...pageObj
    };
    this.saveState();
  },

  deletePage(topicId, pageIndex) {
    const res = this.findTopic(topicId);
    if (!res || res.topic.pages.length <= 1) {
      alert('Topics must contain at least one page.');
      return;
    }

    res.topic.pages.splice(pageIndex, 1);
    this.saveState();
  },

  duplicatePage(topicId, pageIndex) {
    const res = this.findTopic(topicId);
    if (!res || !res.topic.pages[pageIndex]) return;

    const sourcePage = res.topic.pages[pageIndex];
    const dupPage = JSON.parse(JSON.stringify(sourcePage));
    dupPage.id = 'p_' + Date.now();
    dupPage.title = `${sourcePage.title} (Copy)`;

    res.topic.pages.splice(pageIndex + 1, 0, dupPage);
    this.saveState();
  },

  reorderPage(topicId, pageIndex, direction) {
    const res = this.findTopic(topicId);
    if (!res) return;

    const pages = res.topic.pages;
    if (direction === 'up' && pageIndex > 0) {
      const temp = pages[pageIndex];
      pages[pageIndex] = pages[pageIndex - 1];
      pages[pageIndex - 1] = temp;
    } else if (direction === 'down' && pageIndex < pages.length - 1) {
      const temp = pages[pageIndex];
      pages[pageIndex] = pages[pageIndex + 1];
      pages[pageIndex + 1] = temp;
    }
    this.saveState();
  },

  // --- Media Upload Manager ---
  saveVideo(topicId, videoObj) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.video = videoObj;
    this.saveState();
  },

  removeVideo(topicId) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.video = null;
    this.saveState();
  },

  savePdf(topicId, pdfObj) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.pdf = pdfObj;
    this.saveState();
  },

  removePdf(topicId) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.pdf = null;
    this.saveState();
  },

  // --- Quiz Builder Manager ---
  saveQuiz(topicId, quizObj) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.quiz = quizObj;
    this.saveState();
  },

  // --- Content Status & Student Assignment ---
  setTopicStatus(topicId, newStatus) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.status = newStatus;
    this.saveState();
  },

  assignTopicToStudents(topicId, assignObj) {
    const res = this.findTopic(topicId);
    if (!res) return;

    res.topic.status = 'Assigned';
    res.course.status = 'Assigned';
    res.course.assignedCount += 1;

    const newAssignment = {
      id: 'asg_' + Date.now(),
      courseId: res.course.id,
      topicId: res.topic.id,
      topicTitle: res.topic.title,
      classId: res.course.classId,
      section: assignObj.section || 'All',
      assignedTo: assignObj.assignedTo || `Class ${res.course.classId}`,
      deadline: assignObj.deadline || '2026-10-15',
      status: 'Assigned'
    };

    SHIKSHA_DATA.assignments.unshift(newAssignment);
    this.saveState();
    return newAssignment;
  },

  // --- Strict Student Permission Filter ---
  // Students ONLY see topics that are Published or Assigned!
  getStudentAssignedTopics(studentClassId = 8) {
    const allowed = [];
    SHIKSHA_DATA.courses.forEach(course => {
      if (course.classId === parseInt(studentClassId)) {
        course.chapters.forEach(chapter => {
          chapter.topics.forEach(topic => {
            // Strict check: Status MUST be Published or Assigned
            if (topic.status === 'Published' || topic.status === 'Assigned') {
              allowed.push({
                courseTitle: course.title,
                chapterTitle: chapter.title,
                topic
              });
            }
          });
        });
      }
    });
    return allowed;
  }
};

// Initialize Authoring Engine
AuthoringEngine.init();
