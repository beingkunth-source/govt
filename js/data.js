/* ==========================================================================
   SHIKSHA SETU - EDUCATIONAL DATA & 3-LANGUAGE TRANSLATIONS DICTIONARY
   ========================================================================== */

const SHIKSHA_DATA = {
  // --- Supported Languages ---
  languages: [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ],

  // --- Classes Supported ---
  classes: [
    { id: 6, titleKey: 'class_6_title', descKey: 'class_6_desc' },
    { id: 7, titleKey: 'class_7_title', descKey: 'class_7_desc' },
    { id: 8, titleKey: 'class_8_title', descKey: 'class_8_desc' },
    { id: 9, titleKey: 'class_9_title', descKey: 'class_9_desc' },
    { id: 10, titleKey: 'class_10_title', descKey: 'class_10_desc' }
  ],

  // --- Subjects List ---
  subjects: [
    { id: 'math', nameKey: 'subj_math', icon: 'calculator', color: '#059669' },
    { id: 'sci', nameKey: 'subj_sci', icon: 'flask', color: '#0d9488' },
    { id: 'eng', nameKey: 'subj_eng', icon: 'book', color: '#d97706' },
    { id: 'hin', nameKey: 'subj_hin', icon: 'pen', color: '#b91c1c' },
    { id: 'sst', nameKey: 'subj_sst', icon: 'globe', color: '#4f46e5' },
    { id: 'comp', nameKey: 'subj_comp', icon: 'cpu', color: '#0284c7' }
  ],

  // --- Teacher LMS Authoring Courses & Topics Schema ---
  courses: [
    {
      id: 'course_sci_8',
      title: 'Class 8 Science Basics',
      classId: 8,
      subjectId: 'sci',
      status: 'Published',
      assignedCount: 32,
      chapters: [
        {
          id: 'ch_sci_8_1',
          title: 'Chapter 1: Crop Production & Management',
          topics: [
            {
              id: 'top_sci_8_1_1',
              title: 'Topic 1: Agricultural Fundamentals',
              status: 'Published',
              pages: [
                {
                  id: 'p1',
                  title: 'Page 1: Introduction to Crops',
                  headings: 'Overview of Agriculture in India',
                  paragraph: 'Crops are plants grown on a large scale for food, clothing, and other human needs.',
                  keyPoints: ['Kharif crops grow in rainy season (June to September)', 'Rabi crops grow in winter season (October to March)'],
                  importantNote: 'Soil preparation and testing is the very first step before sowing any seeds.',
                  examples: ['Kharif: Paddy, Maize, Soyabean', 'Rabi: Wheat, Gram, Mustard']
                },
                {
                  id: 'p2',
                  title: 'Page 2: Types of Crops & Irrigation',
                  headings: 'Modern Irrigation Methods',
                  paragraph: 'Modern irrigation techniques include Sprinkler systems and Drip systems which conserve water efficiently.',
                  keyPoints: ['Drip irrigation delivers water drop by drop directly to roots.', 'Sprinkler system is ideal for uneven land where water availability is poor.']
                },
                {
                  id: 'p3',
                  title: 'Page 3: Summary & Key Takeaways',
                  headings: 'Chapter Recap',
                  paragraph: 'Proper harvesting, weeding, and storage in silos prevent crop loss from pests and moisture.',
                  keyPoints: ['Weedicides like 2,4-D kill unwanted weeds without harming crops.', 'Granaries and silos store grains safely.']
                }
              ],
              video: {
                title: 'Crop Production & Modern Farming Video Guide',
                url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                description: 'Visual demonstration showing soil tilling, seed sowing, and drip irrigation.'
              },
              pdf: {
                title: 'Agricultural Practice Handbook 2026.pdf',
                fileSize: '1.4 MB',
                description: 'Government publication on organic fertilizers and pest management.'
              },
              quiz: {
                title: 'Crop Production Fundamentals Assessment',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1',
                    type: 'mcq',
                    question: 'Which crop is mainly grown during the rainy season?',
                    options: ['Wheat', 'Rice', 'Gram', 'Mustard'],
                    correctIndex: 1,
                    explanation: 'Rice (paddy) requires abundant rainfall and is a Kharif crop.',
                    marks: 5
                  },
                  {
                    id: 'q2',
                    type: 'tf',
                    question: 'Drip irrigation delivers water directly near plant roots.',
                    correct: true,
                    explanation: 'Drip irrigation minimizes evaporation and water wastage by targeting roots.',
                    marks: 5
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'course_math_9',
      title: 'Class 9 High School Algebra & Geometry',
      classId: 9,
      subjectId: 'math',
      status: 'Draft',
      assignedCount: 0,
      chapters: [
        {
          id: 'ch_math_9_1',
          title: 'Chapter 1: Real Numbers & Irrationals',
          topics: []
        }
      ]
    }
  ],

  // --- Student Assignment Schema ---
  assignments: [
    {
      id: 'asg_1',
      courseId: 'course_sci_8',
      topicId: 'top_sci_8_1_1',
      topicTitle: 'Topic 1: Agricultural Fundamentals',
      classId: 8,
      section: 'A',
      assignedTo: 'Class 8 (Section A)',
      deadline: '2026-10-05',
      status: 'Assigned' // Assigned, In Progress, Completed
    }
  ],
  curriculum: {
    6: {
      math: [
        {
          chapterId: 'math_6_c1',
          title: 'Chapter 1: Knowing Our Numbers',
          lessons: [
            {
              id: 'math_6_c1_l1',
              title: 'Lesson 1: Comparing Large Numbers',
              intro: 'In this lesson, we learn how to read, write, and compare large numbers up to lakhs and crores.',
              objectives: [
                'Identify place value up to 7 digits.',
                'Use standard Indian place value system.',
                'Compare numbers using greater than (>) and less than (<) symbols.'
              ],
              explanation: 'Numbers help us count objects and express quantities. When comparing two numbers, the number with more digits is greater. If digits are equal, compare the leftmost place values first.',
              examples: [
                'Example 1: Compare 45,678 and 45,892. Since 8 > 6 in hundreds place, 45,892 is greater.',
                'Example 2: 1 Lakh = 100 thousands = 1,00,000.'
              ],
              keyTerms: [
                { term: 'Place Value', def: 'The value of a digit based on its position in a number.' },
                { term: 'Numeral', def: 'A symbol or group of symbols representing a number.' }
              ],
              activity: {
                type: 'mcq',
                question: 'Which is greater: 98,765 or 98,675?',
                options: ['98,765', '98,675', 'Both are equal'],
                correctIndex: 0,
                explanation: '7 in hundreds place is greater than 6 in 98,675.'
              }
            },
            {
              id: 'math_6_c1_l2',
              title: 'Lesson 2: Estimation & Rounding Off',
              intro: 'Estimation gives us a rough idea of quantities without exact calculations.',
              objectives: ['Round off numbers to nearest tens, hundreds, and thousands.'],
              explanation: 'If the digit to the right of target place is 5 or more, round up. Otherwise, round down.',
              examples: ['Rounding 28 to nearest tens gives 30.', 'Rounding 412 to nearest hundreds gives 400.'],
              keyTerms: [{ term: 'Estimation', def: 'Finding a value that is close enough to the right answer.' }],
              activity: {
                type: 'true_false',
                question: 'Rounding 67 to nearest tens gives 60.',
                correct: false,
                explanation: 'Since 7 >= 5, 67 rounds UP to 70.'
              }
            }
          ]
        }
      ],
      sci: [
        {
          chapterId: 'sci_6_c1',
          title: 'Chapter 1: Food - Where Does It Come From?',
          lessons: [
            {
              id: 'sci_6_c1_l1',
              title: 'Lesson 1: Food Variety & Sources',
              intro: 'Food gives us energy to grow, work, and stay healthy. Plants and animals are our main food sources.',
              objectives: [
                'Understand plant sources (grains, pulses, vegetables).',
                'Understand animal sources (milk, eggs, meat, honey).'
              ],
              explanation: 'Different parts of plants like roots, stems, leaves, flowers, fruits, and seeds are consumed as food. Herbivores eat plants, Carnivores eat animals, and Omnivores eat both.',
              examples: [
                'Edible plant stems: Potato, Ginger.',
                'Edible plant roots: Carrot, Radish.'
              ],
              keyTerms: [
                { term: 'Herbivore', def: 'Animals that eat only plants.' },
                { term: 'Carnivore', def: 'Animals that eat only other animals.' }
              ],
              activity: {
                type: 'match',
                pairs: [
                  { item: 'Cow', match: 'Herbivore' },
                  { item: 'Lion', match: 'Carnivore' },
                  { item: 'Human', match: 'Omnivore' }
                ]
              }
            }
          ]
        }
      ],
      comp: [
        {
          chapterId: 'comp_6_c1',
          title: 'Chapter 1: Introduction to Computers',
          lessons: [
            {
              id: 'comp_6_c1_l1',
              title: 'Lesson 1: Hardware & Software Basics',
              intro: 'Learn how input devices, CPU, output devices, and storage work together in a computer system.',
              objectives: ['Identify Input Devices (Keyboard, Mouse)', 'Identify Output Devices (Monitor, Printer)'],
              explanation: 'A computer takes raw Input, processes it in the Central Processing Unit (CPU), and generates Output.',
              examples: ['Keyboard = Input', 'Monitor = Output', 'Hard Disk = Storage'],
              keyTerms: [{ term: 'CPU', def: 'Brain of the computer that executes instructions.' }],
              activity: {
                type: 'flashcards',
                cards: [
                  { front: 'What is CPU?', back: 'Central Processing Unit - Brain of the computer' },
                  { front: 'Is Mouse input or output?', back: 'Input Device' }
                ]
              }
            }
          ]
        }
      ]
    },
    7: {
      math: [
        {
          chapterId: 'math_7_c1',
          title: 'Chapter 1: Integers',
          lessons: [
            {
              id: 'math_7_c1_l1',
              title: 'Lesson 1: Addition & Subtraction of Integers',
              intro: 'Integers consist of positive numbers, negative numbers, and zero.',
              objectives: ['Understand number line representation of negative numbers.'],
              explanation: 'When adding two positive integers, result is positive. When adding two negative integers, result is negative. Opposite signs subtract.',
              examples: ['(-5) + (-3) = -8', '(-7) + 10 = +3'],
              keyTerms: [{ term: 'Integer', def: 'Whole numbers including positive, negative, and zero.' }],
              activity: {
                type: 'mcq',
                question: 'What is (-12) + 15?',
                options: ['3', '-3', '27'],
                correctIndex: 0,
                explanation: '15 - 12 = 3.'
              }
            }
          ]
        }
      ]
    },
    8: {
      sci: [
        {
          chapterId: 'sci_8_c1',
          title: 'Chapter 1: Crop Production & Management',
          lessons: [
            {
              id: 'sci_8_c1_l1',
              title: 'Lesson 1: Agricultural Practices',
              intro: 'Steps involved in crop farming from soil preparation to harvesting.',
              objectives: ['Understand irrigation, sowing, and harvesting.'],
              explanation: 'Crops are grown on a large scale. Kharif crops grow in rainy season; Rabi crops grow in winter season.',
              examples: ['Kharif: Paddy, Maize', 'Rabi: Wheat, Gram'],
              keyTerms: [{ term: 'Irrigation', def: 'Supply of water to crops at regular intervals.' }],
              activity: {
                type: 'true_false',
                question: 'Wheat is a Kharif crop.',
                correct: false,
                explanation: 'Wheat is grown in winter, so it is a Rabi crop.'
              }
            }
          ]
        }
      ]
    },
    9: {
      math: [
        {
          chapterId: 'math_9_c1',
          title: 'Chapter 1: Number Systems',
          lessons: [
            {
              id: 'math_9_c1_l1',
              title: 'Lesson 1: Irrational Numbers & Real Numbers',
              intro: 'Real numbers include all rational and irrational numbers.',
              objectives: ['Identify irrational numbers like √2, √3, and π.'],
              explanation: 'Irrational numbers cannot be written in p/q form where p and q are integers and q != 0.',
              examples: ['π = 3.14159...', '√2 = 1.414...'],
              keyTerms: [{ term: 'Irrational Number', def: 'Non-terminating and non-recurring decimal.' }],
              activity: {
                type: 'mcq',
                question: 'Which of the following is an irrational number?',
                options: ['√4', '3/5', '√5'],
                correctIndex: 2,
                explanation: '√5 cannot be simplified into a ratio of integers.'
              }
            }
          ]
        }
      ]
    },
    10: {
      sci: [
        {
          chapterId: 'sci_10_c1',
          title: 'Chapter 1: Light - Reflection & Refraction',
          lessons: [
            {
              id: 'sci_10_c1_l1',
              title: 'Lesson 1: Laws of Reflection & Spherical Mirrors',
              intro: 'Light rays bounce off smooth polished surfaces according to the laws of reflection.',
              objectives: [
                'State Laws of Reflection: Angle of incidence = Angle of reflection.',
                'Distinguish between Concave and Convex mirrors.'
              ],
              explanation: 'Concave mirrors converge light rays; Convex mirrors diverge light rays.',
              examples: ['Car headlights use Concave mirrors.', 'Rear-view mirrors use Convex mirrors.'],
              keyTerms: [{ term: 'Focal Length', def: 'Distance from the pole to the principal focus of mirror.' }],
              activity: {
                type: 'mcq',
                question: 'Which mirror is used as a rear-view mirror in vehicles?',
                options: ['Plane Mirror', 'Convex Mirror', 'Concave Mirror'],
                correctIndex: 1,
                explanation: 'Convex mirrors give a wider field of view and erect image.'
              }
            }
          ]
        }
      ]
    }
  },

  // --- Sample Quizzes ---
  quizzes: [
    {
      id: 'quiz_math_6',
      classId: 6,
      subjectId: 'math',
      title: 'Class 6 Math Foundations Quiz',
      timerSeconds: 300, // 5 minutes
      questions: [
        {
          question: 'What is the place value of 7 in 5,74,321?',
          options: ['70', '7,000', '70,000', '700'],
          correctIndex: 2,
          explanation: '7 is at the ten-thousands place.'
        },
        {
          question: 'Which number is smallest?',
          options: ['12,450', '12,045', '12,504', '12,405'],
          correctIndex: 1,
          explanation: '12,045 has 0 in the hundreds place.'
        },
        {
          question: 'Round off 489 to nearest hundreds.',
          options: ['400', '490', '500', '450'],
          correctIndex: 2,
          explanation: '8 >= 5, so 489 rounds up to 500.'
        },
        {
          question: 'What is the place value of 5 in 5,74,321?',
          options: ['50', '5,000', '50,000', '500'],
          correctIndex: 2,
          explanation: '5 is at the ten-thousands place.'
        },
        {
          question: 'which of the following is an even number?',
          options: ['13', '22', '37', '49'],
          correctIndex: 1,
          explanation: '22 ends with 2, which is even.'
        },
        {
          question: 'What is 1 Lakh in standard form?',
          options: ['100,000', '10,000', '1,000,000', '1,00,000'],
          correctIndex: 0,
          explanation: '1 Lakh = 100,000 in standard international form.'
        }
      ]
    },
    {
      id: 'quiz_sci_6',
      classId: 6,
      subjectId: 'sci',
      title: 'Class 6 Science Food Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which part of the carrot plant do we eat?',
          options: ['Stem', 'Leaf', 'Root', 'Flower'],
          correctIndex: 2,
          explanation: 'Carrot is a modified taproot.'
        },
        {
          question: 'Animals that eat only plants are called:',
          options: ['Carnivores', 'Herbivores', 'Omnivores', 'Decomposers'],
          correctIndex: 1,
          explanation: 'Herbivores feed directly on plant materials.'
        },
        {
          question: 'Which gas do plants release during photosynthesis?',
          options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
          correctIndex: 1,
          explanation: 'Plants take in CO2 and release O2 during photosynthesis.'
        },
        {
          question: 'Which of the following is a source of protein?',
          options: ['Rice', 'Milk', 'Sugar', 'Oil'],
          correctIndex: 1,
          explanation: 'Milk contains casein, which is a protein.'
        },
        {
          question: 'Which of the following is a Kharif crop?',
          options: ['Wheat', 'Rice', 'Gram', 'Mustard'],
          correctIndex: 1,
          explanation: 'Rice is sown in the rainy season (Kharif).'
        },
        {
          question: 'Which of the following is a Rabi crop?',
          options: ['Paddy', 'Maize', 'Wheat', 'Soyabean'],
          correctIndex: 2,
          explanation: 'Wheat is sown in winter season (Rabi).'
        }
      ]
    },
    {
      id: 'quiz_comp_6',
      classId: 6,
      subjectId: 'comp',
      title: 'Class 6 Computer Basics Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'What is the full form of CPU?',
          options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Processor Unit', 'Control Processing Unit'],
          correctIndex: 0,
          explanation: 'CPU stands for Central Processing Unit.'
        },
        {
          question: 'Which of the following is an input device?',
          options: ['Monitor', 'Keyboard', 'Printer', 'Speaker'],
          correctIndex: 1,
          explanation: 'Keyboard is used to input data into the computer.'
        },
        {
          question: 'Which of the following is an output device?',
          options: ['Mouse', 'Scanner', 'Printer', 'Keyboard'],
          correctIndex: 2,
          explanation: 'Printer produces output on paper.'
        },
        {
          question: 'Which device is used to store data permanently?',
          options: ['RAM', 'ROM', 'Hard Disk', 'Monitor'],
          correctIndex: 2,
          explanation: 'Hard Disk is a permanent storage device.'
        },
        {
          question: 'Which of the following is a software?',
          options: ['Windows OS', 'Keyboard', 'Mouse', 'Monitor'],
          correctIndex: 0,
          explanation: 'Windows OS is an operating system software.'
        },
        {
          question: 'Which of the following is used to display output on screen?',
          options: ['Monitor', 'Printer', 'Keyboard', 'Mouse'],
          correctIndex: 0,
          explanation: 'Monitor displays visual output from the computer.'
        }
      ]
    },
    {
      id: 'quiz_eng_6',
      classId: 6,
      subjectId: 'eng',
      title: 'Class 6 English Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Identify the noun in the following sentence: "The cat sat on the mat."',
          options: ['cat', 'sat', 'on', 'mat'],
          correctIndex: 0,
          explanation: 'The noun in the sentence is "cat."'
        },
        {
          question: 'Choose the correct form of the verb: "She ___ to school every day."',
          options: ['go', 'goes', 'going', 'gone'],
          correctIndex: 1,
          explanation: 'The correct form is "goes" for third person singular.'
        },
        {
          question: 'Select the adjective in the sentence: "The quick brown fox jumps over the lazy dog."',
          options: ['quick', 'jumps', 'over', 'dog'],
          correctIndex: 0,
          explanation: 'The adjective in the sentence is "quick."'
        },
        {
          question: 'Identify the pronoun in the sentence: "He is my best friend."',
          options: ['He', 'is', 'my', 'friend'],
          correctIndex: 0,
          explanation: 'The pronoun in the sentence is "He."'
        },
        {
          question: 'Choose the correct preposition: "The book is ___ the table."',
          options: ['on', 'in', 'at', 'by'],
          correctIndex: 0,
          explanation: 'The correct preposition is "on" as the book is placed on the table.'
        },
        {
          question: 'Select the correct conjunction: "I wanted to go, ___ it was raining."',
          options: ['but', 'and', 'or', 'so'],  
        correctIndex: 0,
          explanation: 'The correct conjunction is "but" as it shows contrast between wanting to go and the rain.'
        }
      ]
    },
    {
      id: 'quiz_hin_6',
      classId: 6,
      subjectId: 'hin',
      title: 'Class 6 Hindi Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'प्रश्न 1: "मैं आज स्कूल जा रहा हूँ" में कौन सा शब्द क्रिया है?',
          options: ['मैं', 'आज', 'स्कूल', 'जा रहा हूँ'],
          correctIndex: 3,
          explanation: 'क्रिया "जा रहा हूँ" है।'
        },
        {
          question: 'प्रश्न 2: "राम और श्याम खेल रहे हैं" में कौन सा शब्द संयोजक है?',
          options: ['राम', 'और', 'खेल', 'हैं'],
          correctIndex: 1,
          explanation: 'संयोजक "और" है।'
        },
        {
          question: 'प्रश्न 3: "यह किताब मेरी है" में कौन सा शब्द सर्वनाम है?',
          options: ['यह', 'किताब', 'मेरी', 'है'],
          correctIndex: 0,
          explanation: 'सर्वनाम "यह" है।'
        },
        {
          question: 'प्रश्न 4: "सूरज पूर्व से उगता है" में कौन सा शब्द विशेषण है?',
          options: ['सूरज', 'पूर्व', 'उगता', 'है'],
          correctIndex: 1,
          explanation: 'विशेषण "पूर्व" है।'
        },
        {
          question: 'प्रश्न 5: "मैंने उसे देखा" में कौन सा शब्द क्रिया है?',
          options: ['मैंने', 'उसे', 'देखा', 'है'],
          correctIndex: 2,
          explanation: 'क्रिया "देखा" है।'
        },
        {
          question: 'प्रश्न 6: "वह बहुत अच्छा गाता है" में कौन सा शब्द विशेषण है?',
          options: ['वह', 'बहुत', 'अच्छा', 'गाता'],
          correctIndex: 2,
          explanation: 'विशेषण "अच्छा" है।'
        }
      ]
    },
    {
      id: 'quiz_sst_6',
      classId: 6,
      subjectId: 'sst',
      title: 'Class 6 Social Science Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctIndex: 2,
          explanation: 'The capital of France is Paris.'
        },
        {
          question: 'Which river is known as the longest river in the world?',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          correctIndex: 1,
          explanation: 'The Nile River is the longest river in the world, flowing through northeastern Africa.'
        },
        {
          question: 'Who was the first President of the United States?',
          options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
          correctIndex: 1,
          explanation: 'George Washington served as the first President of the United States from 1789 to 1797.'
        },
        {
          question: 'Which continent is known as the "Dark Continent"?',
          options: ['Asia', 'Africa', 'Europe', 'Australia'],
          correctIndex: 1,
          explanation: 'Africa is often referred to as the "Dark Continent" due to its historical isolation and mystery.'
        },
        {
          question: 'Which ancient civilization built the pyramids?',
          options: ['Mesopotamia', 'Egypt', 'Indus Valley', 'Maya'],
          correctIndex: 1,
          explanation: 'The ancient Egyptians built the pyramids as monumental tombs for their pharaohs.'
        },
        {
          question: 'What is the primary language spoken in Brazil?',
          options: ['Spanish', 'Portuguese', 'French', 'English'],
          correctIndex: 1,
          explanation: 'Portuguese is the official and primary language spoken in Brazil.'
        }
      ]
    },
    {
      id: 'quiz_comp_7',
      classId: 7,
      subjectId: 'comp',
      title: 'Class 7 Computer Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is a type of computer memory?',
          options: ['RAM', 'CPU', 'Monitor', 'Keyboard'],
          correctIndex: 0,
          explanation: 'RAM (Random Access Memory) is a type of computer memory used for temporary data storage.'
        },
        {
          question: 'Which device is used to input data into a computer?',
          options: ['Printer', 'Mouse', 'Monitor', 'Speaker'],
          correctIndex: 1,
          explanation: 'A mouse is an input device that allows users to interact with the computer.'
        },
        {
          question: 'Which of the following is an example of application software?',
          options: ['Microsoft Word', 'Windows OS', 'BIOS', 'CPU'],
          correctIndex: 0,
          explanation: 'Microsoft Word is an application software used for word processing.'
        },
        {
          question: 'What does URL stand for?',
          options: ['Uniform Resource Locator', 'Universal Resource Link', 'Unique Reference Location', 'Uniform Reference Link'],
          correctIndex: 0,
          explanation: 'URL stands for Uniform Resource Locator, which is the address of a web page on the internet.'
        },
        {
          question: 'Which of the following is a web browser?',
          options: ['Google Chrome', 'Microsoft Word', 'Adobe Photoshop', 'Windows Explorer'],
          correctIndex: 0,
          explanation: 'Google Chrome is a web browser used to access websites on the internet.'
        },
        {
          question: 'Which of the following is used to store data permanently?',
          options: ['RAM', 'ROM', 'Hard Disk', 'Cache Memory'],
          correctIndex: 2,
          explanation: 'Hard Disk is a permanent storage device used to store data and files.'
        }
      ]
    },
    {
      id: 'quiz_sci_7',
      classId: 7,
      subjectId: 'sci',
      title: 'Class 7 Science Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is a renewable source of energy?',
          options: ['Coal', 'Natural Gas', 'Solar Energy', 'Petroleum'],
          correctIndex: 2,
          explanation: 'Solar energy is a renewable source of energy as it is derived from the sun and can be replenished naturally.'
        },
        {
          question: 'What is the process by which plants make their own food?',
          options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'],
          correctIndex: 1,
          explanation: 'Photosynthesis is the process by which plants use sunlight, carbon dioxide, and water to produce food (glucose) and oxygen.'
        },
        {
          question: 'Which organ in the human body is responsible for pumping blood?',
          options: ['Lungs', 'Liver', 'Heart', 'Kidneys'],
          correctIndex: 2,
          explanation: 'The heart is responsible for pumping blood throughout the body, supplying oxygen and nutrients to tissues.'
        },
        {
          question: 'What is the chemical symbol for water?',
          options: ['H2O', 'O2', 'CO2', 'NaCl'],
          correctIndex: 0,
          explanation: 'The chemical symbol for water is H2O, indicating two hydrogen atoms bonded to one oxygen atom.'
        },
        {
          question: 'Which of the following is a non-renewable source of energy?',
          options: ['Wind Energy', 'Solar Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable source of energy as it takes millions of years to form and cannot be replenished on a human timescale.'
        },
        {
          question: 'What is the main function of the respiratory system?',
          options: ['To circulate blood', 'To digest food', 'To exchange gases (oxygen and carbon dioxide)', 'To produce hormones'],
          correctIndex: 2,
          explanation: 'The main function of the respiratory system is to facilitate the exchange of gases, allowing oxygen to enter the body and carbon dioxide to be expelled.'
        }
      ]
    },
    {
      id: 'quiz_math_7',
      classId: 7,
      subjectId: 'math',
      title: 'Class 7 Mathematics Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'What is the value of 3² + 4²?',
          options: ['12', '25', '16', '20'],
          correctIndex: 1,
          explanation: '3² = 9 and 4² = 16, so 9 + 16 = 25.'
        },
        {
          question: 'Which of the following is a prime number?',
          options: ['15', '21', '29', '35'],
          correctIndex: 2,
          explanation: '29 is a prime number as it has only two factors: 1 and itself.'
        },
        {
          question: 'What is the perimeter of a rectangle with length 8 cm and breadth 5 cm?',
          options: ['26 cm', '40 cm', '13 cm', '20 cm'],
          correctIndex: 0,
          explanation: 'Perimeter = 2 × (Length + Breadth) = 2 × (8 + 5) = 26 cm.'
        },
        {
          question: 'What is the value of π (pi) approximately?',
          options: ['3.14', '2.71', '1.62', '4.00'],
          correctIndex: 0,
          explanation: 'The value of π (pi) is approximately 3.14.'
        },
        {
          question: 'Which of the following is a composite number?',
          options: ['7', '11', '15', '13'],
          correctIndex: 2,
          explanation: '15 is a composite number as it has more than two factors (1, 3, 5, 15).'
        },
        {
          question: 'What is the sum of the angles in a triangle?',
          options: ['90°', '180°', '360°', '270°'],
          correctIndex: 1,
          explanation: 'The sum of the angles in a triangle is always 180 degrees.'
        }
      ]
    },
    {
      id: 'quiz_sst_7',
      classId: 7,
      subjectId: 'sst',
      title: 'Class 7 Social Science Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is the largest continent by area?',
          options: ['Africa', 'Asia', 'Europe', 'North America'],
          correctIndex: 1,
          explanation: 'Asia is the largest continent by area, covering approximately 44.58 million square kilometers.'
        },
        {
          question: 'Who was the first President of India?',
          options: ['Jawaharlal Nehru', 'Rajendra Prasad', 'Indira Gandhi', 'Sardar Patel'],
          correctIndex: 1,
          explanation: 'Dr. Rajendra Prasad served as the first President of India from 1950 to 1962.'
        },
        {
          question: 'Which river is known as the "Ganga of the South"?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Narmada'],
          correctIndex: 0,
          explanation: 'The Godavari River is often referred to as the "Ganga of the South" due to its cultural and religious significance.'
        },
        {
          question: 'Which ancient civilization is known for building ziggurats?',
          options: ['Mesopotamia', 'Egypt', 'Indus Valley', 'Maya'],
          correctIndex: 0,
          explanation: 'The Mesopotamian civilization built ziggurats, which were massive temple complexes.'
        },
        {
          question: 'What is the primary language spoken in Canada?',
          options: ['English', 'French', 'Spanish', 'Both English and French'],
          correctIndex: 3,
          explanation: 'Canada has two official languages: English and French.'
        },
        {
          question: 'Which of the following is a non-renewable resource?',
          options: ['Solar Energy', 'Wind Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable resourcee as it takes millions of years to form and cannot be replenished on a human timescale.'
        }
      ]
    },
    {
      id: 'quiz_eng_7',
      classId: 7,
      subjectId: 'eng',
      title: 'Class 7 English Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Identify the verb in the following sentence: "She runs every morning."',
          options: ['She', 'runs', 'every', 'morning'],
          correctIndex: 1,
          explanation: 'The verb in the sentence is "runs."'
        },
        {
          question: 'Choose the correct form of the verb: "They ___ to the park yesterday."',
          options: ['go', 'went', 'going', 'gone'],
          correctIndex: 1,
          explanation: 'The correct form is "went" for past tense.'
        },
        {
          question: 'Select the adverb in the sentence: "He quickly finished his homework."',
          options: ['He', 'quickly', 'finished', 'homework'],
          correctIndex: 1,
          explanation: 'The adverb in the sentence is "quickly."'
        },
        {
          question: 'Identify the pronoun in the sentence: "They are going to the market."',
          options: ['They', 'are', 'going', 'market'],
          correctIndex: 0,
          explanation: 'The pronoun in the sentence is "They."'
        },
        {
          question: 'Choose the correct preposition: "The cat is hiding ___ the table."',
          options: ['under', 'on', 'in', 'by'],
          correctIndex: 0,
          explanation: 'The correct preposition is "under" as the cat is below the table.'
        },
        {
          question: 'Select the correct conjunction: "I wanted to play, ___ it started raining."',
          options: ['but', 'and', 'or', 'so'],
          correctIndex: 0,
          explanation: 'The correct conjunction is "but" as it shows contrast between wanting to play and the rain.'
        }
      ]
    },
    {
      id: 'quiz_hin_7',
      classId: 7,
      subjectId: 'hin',
      title: 'Class 7 Hindi Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'प्रश्न 1: "वह स्कूल जा रहा है" में कौन सा शब्द क्रिया है?',
          options: ['वह', 'स्कूल', 'जा रहा है', 'है'],
          correctIndex: 2,
          explanation: 'क्रिया "जा रहा है" है।'
        },
        {
          question: 'प्रश्न 2: "राम और श्याम दोस्त हैं" में कौन सा शब्द संयोजक है?',
          options: ['राम', 'और', 'दोस्त', 'हैं'],
          correctIndex: 1,
          explanation: 'संयोजक "और" है।'
        },
        {
          question: 'प्रश्न 3: "यह मेरी किताब है" में कौन सा शब्द सर्वनाम है?',
          options: ['यह', 'मेरी', 'किताब', 'है'],
          correctIndex: 0,
          explanation: 'सर्वनाम "यह" है।'
        },
        {
          question: 'प्रश्न 4: "सूरज पूर्व से उगता है" में कौन सा शब्द विशेषण है?',
          options: ['सूरज', 'पूर्व', 'उगता', 'है'],
          correctIndex: 1,
          explanation: 'विशेषण "पूर्व" है।'
        },
        {
          question: 'प्रश्न 5: "मैंने उसे देखा" में कौन सा शब्द क्रिया है?',
          options: ['मैंने', 'उसे', 'देखा', 'है'],
          correctIndex: 2,
          explanation: 'क्रिया "देखा" है।'
        },
        {
          question: 'प्रश्न 6: "वह बहुत अच्छा गाता है" में कौन सा शब्द विशेषण है?',
          options: ['वह', 'बहुत', 'अच्छा', 'गाता'],
          correctIndex: 2,
          explanation: 'विशेषण "अच्छा" है।'
        }
      ]
    },
    {
      id: 'quiz_sst_7',
      classId: 7,
      subjectId: 'sst',
      title: 'Class 7 Social Science Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is the largest continent by area?',
          options: ['Africa', 'Asia', 'Europe', 'North America'],
          correctIndex: 1,
          explanation: 'Asia is the largest continent by area, covering approximately 44.58 million square kilometers.'
        },
        {
          question: 'Who was the first President of India?',
          options: ['Jawaharlal Nehru', 'Rajendra Prasad', 'Indira Gandhi', 'Sardar Patel'],
          correctIndex: 1,
          explanation: 'Dr. Rajendra Prasad served as the first President of India from 1950 to 1962.'
        },
        {
          question: 'Which river is known as the "Ganga of the South"?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Narmada'],
          correctIndex: 0,
          explanation: 'The Godavari River is often referred to as the "Ganga of the South" due to its cultural and religious significance.'
        },
        {
          question: 'Which ancient civilization is known for building ziggurats?',
          options: ['Mesopotamia', 'Egypt', 'Indus Valley', 'Maya'],
          correctIndex: 0,
          explanation: 'The Mesopotamian civilization built ziggurats, which were massive temple complexes.'
        },
        {
          question: 'What is the primary language spoken in Canada?',
          options: ['English', 'French', 'Spanish', 'Both English and French'],
          correctIndex: 3,
          explanation: 'Canada has two official languages: English and French.'
        },
        {
          question: 'Which of the following is a non-renewable resource?',
          options: ['Solar Energy', 'Wind Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable resource as it takes millions of years to form and cannot be replenished on a human timescale.'
        }
      ]
    },
    {
      id: 'quiz_comp_8',
      classId: 8,
      subjectId: 'comp',
      title: 'Class 8 Computer Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is a type of computer memory?',
          options: ['RAM', 'CPU', 'Monitor', 'Keyboard'],
          correctIndex: 0,
          explanation: 'RAM (Random Access Memory) is a type of computer memory used for temporary data storage.'
        },
        {
          question: 'Which device is used to input data into a computer?',
          options: ['Printer', 'Mouse', 'Monitor', 'Speaker'],
          correctIndex: 1,
          explanation: 'A mouse is an input device that allows users to interact with the computer.'
        },
        {
          question: 'Which of the following is an example of application software?',
          options: ['Microsoft Word', 'Windows OS', 'BIOS', 'CPU'],
          correctIndex: 0,
          explanation: 'Microsoft Word is an application software used for word processing.'
        },
        {
          question: 'What does URL stand for?',
          options: ['Uniform Resource Locator', 'Universal Resource Link', 'Unique Reference Location', 'Uniform Reference Link'],
          correctIndex: 0,
          explanation: 'URL stands for Uniform Resource Locator, which is the address of a web page on the internet.'
        },
        {
          question: 'Which of the following is a web browser?',
          options: ['Google Chrome', 'Microsoft Word', 'Adobe Photoshop', 'Windows Explorer'],
          correctIndex: 0,
          explanation: 'Google Chrome is a web browser used to access websites on the internet.'
        },
        {
          question: 'Which of the following is used to store data permanently?',
          options: ['RAM', 'ROM', 'Hard Disk', 'Cache Memory'],
          correctIndex: 2,
          explanation: 'Hard Disk is a permanent storage device used to store data and files.'
        }
      ]
    },
    {
      id: 'quiz_sci_8',
      classId: 8,
      subjectId: 'sci',
      title: 'Class 8 Science Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is a renewable source of energy?',
          options: ['Coal', 'Natural Gas', 'Solar Energy', 'Petroleum'],
          correctIndex: 2,
          explanation: 'Solar energy is a renewable source of energy as it is derived from the sun and can be replenished naturally.'
        },
        {
          question: 'What is the process by which plants make their own food?',
          options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'],
          correctIndex: 1,
          explanation: 'Photosynthesis is the process by which plants use sunlight, carbon dioxide, and water to produce food (glucose) and oxygen.'
        },
        {
          question: 'Which organ in the human body is responsible for pumping blood?',
          options: ['Lungs', 'Liver', 'Heart', 'Kidneys'],
          correctIndex: 2,
          explanation: 'The heart is responsible for pumping blood throughout the body, supplying oxygen and nutrients to tissues.'
        },
        {
          question: 'What is the chemical symbol for water?',
          options: ['H2O', 'O2', 'CO2', 'NaCl'],
          correctIndex: 0,
          explanation: 'The chemical symbol for water is H2O, indicating two hydrogen atoms bonded to one oxygen atom.'
        },
        {
          question: 'Which of the following is a non-renewable source of energy?',
          options: ['Wind Energy', 'Solar Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable source of energy as it takes millions of years to form and cannot be replenished on a human timescale.'
        },
        {
          question: 'What is the main function of the respiratory system?',
          options: ['To circulate blood', 'To digest food', 'To exchange gases (oxygen and carbon dioxide)', 'To produce hormones'],
          correctIndex: 2,
          explanation: 'The main function of the respiratory system is to facilitate the exchange of gases, allowing oxygen to enter the body and carbon dioxide to be expelled.'
        }
      ]
    },
    {
      id: 'quiz_math_8',
      classId: 8,
      subjectId: 'math',
      title: 'Class 8 Mathematics Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'What is the value of 5² + 12²?',
          options: ['169', '144', '125', '100'],
          correctIndex: 0,
          explanation: '5² = 25 and 12² = 144, so 25 + 144 = 169.'
        },
        {
          question: 'Which of the following is a prime number?',
          options: ['21', '29', '35', '49'],
          correctIndex: 1,
          explanation: '29 is a prime number as it has only two factors: 1 and itself.'
        },
        {
          question: 'What is the perimeter of a rectangle with length 10 cm and breadth 6 cm?',
          options: ['32 cm', '40 cm', '26 cm', '20 cm'],
          correctIndex: 0,
          explanation: 'Perimeter = 2 × (Length + Breadth) = 2 × (10 + 6) = 32 cm.'
        },
        {
          question: 'What is the value of π (pi) approximately?',
          options: ['3.14', '2.71', '1.62', '4.00'],
          correctIndex: 0,
          explanation: 'The value of π (pi) is approximately 3.14.'
        },
        {
          question: 'Which of the following is a composite number?',
          options: ['11', '13', '15', '17'],
          correctIndex: 2,
          explanation: '15 is a composite number as it has more than two factors (1, 3, 5, 15).'
        },
        {
          question: 'What is the sum of the angles in a triangle?',
          options: ['90°', '180°', '360°', '270°'],
          correctIndex: 1,
          explanation: 'The sum of the angles in a triangle is always 180 degrees.'
        }
      ]
    },
    {
      id: 'quiz_sst_8',
      classId: 8,
      subjectId: 'sst',
      title: 'Class 8 Social Science Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is the largest continent by area?',
          options: ['Africa', 'Asia', 'Europe', 'North America'],
          correctIndex: 1,
          explanation: 'Asia is the largest continent by area, covering approximately 44.58 million square kilometers.'
        },
        {
          question: 'Who was the first President of India?',
          options: ['Jawaharlal Nehru', 'Rajendra Prasad', 'Indira Gandhi', 'Sardar Patel'],
          correctIndex: 1,
          explanation: 'Dr. Rajendra Prasad served as the first President of India from 1950 to 1962.'
        },
        {
          question: 'Which river is known as the "Ganga of the South"?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Narmada'],
          correctIndex: 0,
          explanation: 'The Godavari River is often referred to as the "Ganga of the South" due to its cultural and religious significance.'
        },
        {
          question: 'Which ancient civilization is known for building ziggurats?',
          options: ['Mesopotamia', 'Egypt', 'Indus Valley', 'Maya'],
          correctIndex: 0,
          explanation: 'The Mesopotamian civilization built ziggurats, which were massive temple complexes.'
        },
        {
          question: 'What is the primary language spoken in Canada?',
          options: ['English', 'French', 'Spanish', 'Both English and French'],
          correctIndex: 3,
          explanation: 'Canada has two official languages: English and French.'
        },
        {
          question: 'Which of the following is a non-renewable resource?',
          options: ['Solar Energy', 'Wind Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable resource as it takes millions of years to form and cannot be replenished on a human timescale.'
        }
      ]
    },
    {
      id: 'quiz_eng_8',
      classId: 8,
      subjectId: 'eng',
      title: 'Class 8 English Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Identify the verb in the following sentence: "He plays football every weekend."',
          options: ['He', 'plays', 'football', 'every'],
          correctIndex: 1,
          explanation: 'The verb in the sentence is "plays."'
        },
        {
          question: 'Choose the correct form of the verb: "She ___ to the market yesterday."',
          options: ['go', 'went', 'going', 'gone'],
          correctIndex: 1,
          explanation: 'The correct form is "went" for past tense.'
        },
        {
          question: 'Select the adverb in the sentence: "He quickly completed his assignment."',
          options: ['He', 'quickly', 'completed', 'assignment'],
          correctIndex: 1,
          explanation: 'The adverb in the sentence is "quickly."'
        },
        {
          question: 'Identify the pronoun in the sentence: "They are going to the park."',
          options: ['They', 'are', 'going', 'park'],
          correctIndex: 0,
          explanation: 'The pronoun in the sentence is "They."'
        },
        {
          question: 'Choose the correct preposition: "The cat is hiding ___ the sofa."',
          options: ['under', 'on', 'in', 'by'],
          correctIndex: 0,
          explanation: 'The correct preposition is "under" as the cat is below the sofa.'
        },
        {
          question: 'Select the correct conjunction: "I wanted to go, ___ it was raining."',
          options: ['but', 'and', 'or', 'so'],
          correctIndex: 0,
          explanation: 'The correct conjunction is "but" as it shows contrast between wanting to go and the rain.'
        }
      ]
    },
    {
      id: 'quiz_hin_8',
      classId: 8,
      subjectId: 'hin',
      title: 'Class 8 Hindi Grammar Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'प्रश्न 1: "वह स्कूल जा रही है" में कौन सा शब्द क्रिया है?',
          options: ['वह', 'स्कूल', 'जा रही है', 'है'],
          correctIndex: 2,
          explanation: 'क्रिया "जा रही है" है।'
        },
        {
          question: 'प्रश्न 2: "राम और श्याम दोस्त हैं" में कौन सा शब्द संयोजक है?',
          options: ['राम', 'और', 'दोस्त', 'हैं'],
          correctIndex: 1,
          explanation: 'संयोजक "और" है।'
        },
        {
          question: 'प्रश्न 3: "यह मेरी किताब है" में कौन सा शब्द सर्वनाम है?',
          options: ['यह', 'मेरी', 'किताब', 'है'],
          correctIndex: 0,
          explanation: 'सर्वनाम "यह" है।'
        },
        {
          question: 'प्रश्न 4: "सूरज पूर्व से उगता है" में कौन सा शब्द विशेषण है?',
          options: ['सूरज', 'पूर्व', 'उगता', 'है'],
          correctIndex: 1,
          explanation: 'विशेषण "पूर्व" है।'
        },
        {
          question: 'प्रश्न 5: "मैंने उसे देखा" में कौन सा शब्द क्रिया है?',
          options: ['मैंने', 'उसे', 'देखा', 'है'],
          correctIndex: 2,
          explanation: 'क्रिया "देखा" है।'
        },
        {
          question: 'प्रश्न 6: "वह बहुत अच्छा गाता है" में कौन सा शब्द विशेषण है?',
          options: ['वह', 'बहुत', 'अच्छा', 'गाता'],
          correctIndex: 2,
          explanation: 'विशेषण "अच्छा" है।'
        }
      ]
    },
    {
      id: 'quiz_sst_8',
      classId: 8,
      subjectId: 'sst',
      title: 'Class 8 Social Science Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is the largest continent by area?',
          options: ['Africa', 'Asia', 'Europe', 'North America'],
          correctIndex: 1,
          explanation: 'Asia is the largest continent by area, covering approximately 44.58 million square kilometers.'
        },
        {
          question: 'Who was the first President of India?',
          options: ['Jawaharlal Nehru', 'Rajendra Prasad', 'Indira Gandhi', 'Sardar Patel'],
          correctIndex: 1,
          explanation: 'Dr. Rajendra Prasad served as the first President of India from 1950 to 1962.'
        },
        {
          question: 'Which river is known as the "Ganga of the South"?',
          options: ['Godavari', 'Krishna', 'Kaveri', 'Narmada'],
          correctIndex: 0,
          explanation: 'The Godavari River is often referred to as the "Ganga of the South" due to its cultural and religious significance.'
        },
        {
          question: 'Which ancient civilization is known for building ziggurats?',
          options: ['Mesopotamia', 'Egypt', 'Indus Valley', 'Maya'],
          correctIndex: 0,
          explanation: 'The Mesopotamian civilization built ziggurats, which were massive temple complexes.'
        },
        {
          question: 'What is the primary language spoken in Canada?',
          options: ['English', 'French', 'Spanish', 'Both English and French'],
          correctIndex: 3,
          explanation: 'Canada has two official languages: English and French.'
        },
        {
          question: 'Which of the following is a non-renewable resource?',
          options: ['Solar Energy', 'Wind Energy', 'Coal', 'Hydropower'],
          correctIndex: 2,
          explanation: 'Coal is a non-renewable resource as it takes millions of years to form and cannot be replenished on a human timescale.'
        }
      ]
    },
    {
      id: 'quiz_comp_9',
      classId: 9,
      subjectId: 'comp',
      title: 'Class 9 Computer Fundamentals Quiz',
      timerSeconds: 300,
      questions: [
        {
          question: 'Which of the following is a type of computer memory?',
          options: ['RAM', 'CPU', 'Monitor', 'Keyboard'],
          correctIndex: 0,
          explanation: 'RAM (Random Access Memory) is a type of computer memory used for temporary data storage.'
        },
        {
          question: 'Which device is used to input data into a computer?',
          options: ['Printer', 'Mouse', 'Monitor', 'Speaker'],
          correctIndex: 1,
          explanation: 'A mouse is an input device that allows users to interact with the computer.'
        },
        {
          question: 'Which of the following is an example of application software?',
          options: ['Microsoft Word', 'Windows OS', 'BIOS', 'CPU'],
          correctIndex: 0,
          explanation: 'Microsoft Word is an application software used for word processing.'
        },
        {
          question: 'What does URL stand for?',
          options: ['Uniform Resource Locator', 'Universal Resource Link', 'Unique Reference Location', 'Uniform Reference Link'],
          correctIndex: 0,
          explanation: 'URL stands for Uniform Resource Locator, which is the address of a web page on the internet.'
        },
        {
          question: 'Which of the following is a web browser?',
          options: ['Google Chrome', 'Microsoft Word', 'Adobe Photoshop', 'Windows Explorer'],
          correctIndex: 0,
          explanation: 'Google Chrome is a web browser used to access websites on the internet.'
        },
        {
          question: 'Which of the following is used to store data permanently?',
          options: ['RAM', 'ROM', 'Hard Disk', 'Cache Memory'],
          correctIndex: 2,
          explanation: 'Hard Disk is a permanent storage device used to store data and files.'
        }
      ]
    }
  ],

  // --- Worksheets ---
  worksheets: [
    {
      id: 'ws_math_6_1',
      classId: 6,
      subjectId: 'math',
      title: 'Worksheet 1: Number Operations Practice',
      questions: [
        {
          id: 'q1',
          type: 'text',
          question: 'Write 4,50,230 in words in English.',
          sampleAnswer: 'Four Lakh Fifty Thousand Two Hundred Thirty'
        },
        {
          id: 'q2',
          type: 'mcq',
          question: 'Solve: 450 + 350 - 120 = ?',
          options: ['680', '700', '800', '650'],
          correctIndex: 0
        }
      ]
    },
    {
      id: 'ws_sci_6_1',
      classId: 6,
      subjectId: 'sci',
      title: 'Worksheet 1: Plant Parts & Functions',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          question: 'Which gas do plants release during photosynthesis?',
          options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
          correctIndex: 1
        }
      ]
    }
  ],

  // --- Digital Library Assets ---
  library: [
    {
      id: 'lib_1',
      title: 'Class 6 Math Formula Sheet',
      category: 'Formula Sheets',
      subjectId: 'math',
      classId: 6,
      fileSize: '120 KB',
      summary: 'Quick reference sheet for Perimeter, Area, and Number System rules.',
      contentHtml: `<div style="font-family: inherit; line-height: 1.6;"><h3 style="color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 6px;">📐 Class 6 Mathematics Formula Sheet & Quick Notes</h3><h4 style="margin-top: 16px; color: var(--color-secondary);">1. Indian & International Place Value System</h4><ul><li><strong>1 Lakh</strong> = 1,00,000 = 100 Thousands</li><li><strong>1 Crore</strong> = 1,00,00000 = 10 Millions</li><li><strong>1 Million</strong> = 1,000,000 = 10 Lakhs</li></ul><h4 style="margin-top: 16px; color: var(--color-secondary);">2. Mensuration Formulas</h4><table style="width: 100%; border-collapse: collapse; margin-top: 8px;"><thead><tr style="background: var(--bg-subtle);"><th style="padding: 8px; border: 1px solid var(--border-color);">Shape</th><th style="padding: 8px; border: 1px solid var(--border-color);">Perimeter Formula</th><th style="padding: 8px; border: 1px solid var(--border-color);">Area Formula</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid var(--border-color);">Square</td><td style="padding: 8px; border: 1px solid var(--border-color);">4 × Side</td><td style="padding: 8px; border: 1px solid var(--border-color);">Side × Side</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);">Rectangle</td><td style="padding: 8px; border: 1px solid var(--border-color);">2 × (Length + Breadth)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Length × Breadth</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);">Equilateral Triangle</td><td style="padding: 8px; border: 1px solid var(--border-color);">3 × Side</td><td style="padding: 8px; border: 1px solid var(--border-color);">(√3 / 4) × Side²</td></tr></tbody></table><h4 style="margin-top: 16px; color: var(--color-secondary);">3. Number System Rules</h4><p>• <strong>Even Numbers:</strong> Divisible by 2 (Ends in 0, 2, 4, 6, 8).</p><p>• <strong>Odd Numbers:</strong> Not divisible by 2 (Ends in 1, 3, 5, 7, 9).</p><p>• <strong>Prime Numbers:</strong> Numbers having exactly 2 factors (1 and itself). First 5 prime numbers: 2, 3, 5, 7, 11.</p></div>`
    },
    {
      id: 'lib_2',
      title: 'Class 8 Science Summary Notes',
      category: 'Notes',
      subjectId: 'sci',
      classId: 8,
      fileSize: '240 KB',
      summary: 'Chapter 1 to 5 consolidated key points for quick revision.',
      contentHtml: `<div style="font-family: inherit; line-height: 1.6;"><h3 style="color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 6px;">🔬 Class 8 Science Consolidated Revision Notes</h3><h4 style="margin-top: 16px; color: var(--color-secondary);">Chapter 1: Crop Production and Management</h4><p>• <strong>Kharif Crops:</strong> Sown in rainy season (June to Sept). Examples: Paddy, Maize, Soyabean, Groundnut, Cotton.</p><p>• <strong>Rabi Crops:</strong> Sown in winter season (Oct to March). Examples: Wheat, Gram, Pea, Mustard, Linseed.</p><p>• <strong>Basic Steps:</strong> Preparation of soil → Sowing → Adding manure & fertilisers → Irrigation → Protecting from weeds → Harvesting → Storage.</p><h4 style="margin-top: 16px; color: var(--color-secondary);">Chapter 2: Microorganisms - Friend and Foe</h4><p>• <strong>Major Groups:</strong> Bacteria, Fungi, Protozoa, and Algae.</p><p>• <strong>Useful Microbes:</strong> Lactobacillus converts milk to curd; Yeast produces carbon dioxide used in bread baking.</p><p>• <strong>Antibiotics:</strong> Medicines produced from bacteria or fungi to kill disease-causing microbes (e.g., Penicillin).</p><h4 style="margin-top: 16px; color: var(--color-secondary);">Chapter 3: Synthetic Fibres and Plastics</h4><p>• <strong>Thermoplastics:</strong> Can be deformed easily on heating (Polythene, PVC).</p><p>• <strong>Thermosetting Plastics:</strong> Cannot be softened by heating once molded (Bakelite, Melamine).</p></div>`
    },
    {
      id: 'lib_3',
      title: 'Class 10 Model Question Paper 2026',
      category: 'Question Papers',
      subjectId: 'sci',
      classId: 10,
      fileSize: '350 KB',
      summary: 'Official sample board paper with answer key and marking scheme.',
      contentHtml: `<div style="font-family: inherit; line-height: 1.6;"><h3 style="color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 6px;">📝 Class 10 Science Model Question Paper 2026</h3><p><strong>Time: 3 Hours | Max Marks: 80</strong></p><div style="background: var(--bg-subtle); padding: 12px; border-radius: 6px; margin: 12px 0;"><strong>Section A: Multiple Choice Questions (1 Mark Each)</strong></div><p><strong>Q1:</strong> Which of the following is a displacement reaction?</p><p style="padding-left: 16px;">(a) MgCO3 → MgO + CO2<br>(b) 2H2 + O2 → 2H2O<br>(c) Fe + CuSO4 → FeSO4 + Cu<br>(d) NaOH + HCl → NaCl + H2O</p><p style="color: var(--color-success); font-weight: 600;">Answer: (c) Fe + CuSO4 → FeSO4 + Cu (Iron displaces copper from copper sulphate solution).</p><p style="margin-top: 12px;"><strong>Q2:</strong> The focal length of a spherical mirror of radius of curvature 20 cm is:</p><p style="padding-left: 16px;">(a) 10 cm<br>(b) 20 cm<br>(c) 40 cm<br>(d) 5 cm</p><p style="color: var(--color-success); font-weight: 600;">Answer: (a) 10 cm (f = R / 2 = 20 / 2 = 10 cm).</p><div style="background: var(--bg-subtle); padding: 12px; border-radius: 6px; margin: 16px 0 12px 0;"><strong>Section B: Short Answer Questions (3 Marks Each)</strong></div><p><strong>Q3:</strong> State the Ohm's Law and write its mathematical formula.</p><p style="color: var(--text-secondary);"><strong>Model Answer:</strong> Ohm's law states that electric current (I) flowing through a metallic conductor is directly proportional to potential difference (V) across its ends, provided temperature remains constant.<br>Formula: V = I × R.</p></div>`
    },
    {
      id: 'lib_4',
      title: 'Computer Basics Shortcut Key Chart',
      category: 'Study Material',
      subjectId: 'comp',
      classId: 6,
      fileSize: '95 KB',
      summary: 'Handy keyboard shortcuts table for CTRL+C, CTRL+V, CTRL+Z, and more.',
      contentHtml: `<div style="font-family: inherit; line-height: 1.6;"><h3 style="color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 6px;">⌨️ Computer Basics Essential Keyboard Shortcuts</h3><table style="width: 100%; border-collapse: collapse; margin-top: 12px;"><thead><tr style="background: var(--bg-subtle);"><th style="padding: 10px; border: 1px solid var(--border-color); width: 35%;">Shortcut Key</th><th style="padding: 10px; border: 1px solid var(--border-color);">Function & Description</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + C</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Copy selected text or file</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + V</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Paste copied text or file</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + X</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Cut selected text or item</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + Z</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Undo previous action</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + A</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Select all items or text</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + S</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Save current document</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Ctrl + P</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Print current page or document</td></tr><tr><td style="padding: 8px; border: 1px solid var(--border-color);"><strong>Alt + Tab</strong></td><td style="padding: 8px; border: 1px solid var(--border-color);">Switch between open applications</td></tr></tbody></table></div>`
    }
  ],

  // --- Announcements ---
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Shiksha Setu Digital Learning Portal',
      date: '2026-09-25',
      category: 'Portal News',
      content: 'All government school students from Class 6 to 10 can now access free offline lessons, quizzes, and digital worksheets.'
    },
    {
      id: 'ann_2',
      title: 'Quarterly Assessment Schedule',
      date: '2026-09-20',
      category: 'Exams',
      content: 'Chapter quizzes for Math and Science are live. Students are encouraged to complete daily lessons to maintain their study streak.'
    }
  ],

  // --- Badges & Achievements ---
  badges: [
    { id: 'b_first', title: 'First Lesson', icon: '🌟', desc: 'Completed your very first lesson!' },
    { id: 'b_quiz_master', title: 'Quiz Master', icon: '🏆', desc: 'Scored 100% on any chapter quiz.' },
    { id: 'b_streak_3', title: '3-Day Streak', icon: '🔥', desc: 'Logged in and learned 3 days in a row.' },
    { id: 'b_math_star', title: 'Math Genius', icon: '📐', desc: 'Completed 3 Mathematics lessons.' },
    { id: 'b_sci_explorer', title: 'Science Explorer', icon: '🔬', desc: 'Completed 3 Science lessons.' }
  ],

  // --- 3-Language Dictionaries (EN, HI, MR) ---
  translations: {
    en: {
      app_title: 'Shiksha Setu',
      app_tagline: 'Govt School E-Learning Platform',
      nav_home: 'Home',
      nav_dashboard: 'Dashboard',
      nav_classes: 'Classes',
      nav_subjects: 'Subjects',
      nav_lessons: 'Lessons',
      nav_quizzes: 'Quizzes',
      nav_library: 'Digital Library',
      nav_progress: 'Progress',
      nav_achievements: 'Achievements',
      nav_teacher: 'Teacher Portal',
      nav_settings: 'Settings',
      
      hero_badge: 'PM SHRI Govt School Initiative',
      hero_title: 'Quality Digital Education for Every Student',
      hero_desc: 'Free, simple, and accessible learning content designed for government school students across Classes 6 to 10.',
      start_learning: 'Start Learning',
      select_class: 'Select Class',
      class_6_title: 'Class 6',
      class_6_desc: 'Foundational concepts in Science & Math',
      class_7_title: 'Class 7',
      class_7_desc: 'Intermediate logic & environmental science',
      class_8_title: 'Class 8',
      class_8_desc: 'Advanced problem solving & digital literacy',
      class_9_title: 'Class 9',
      class_9_desc: 'High school core science & algebra',
      class_10_title: 'Class 10',
      class_10_desc: 'Board exam prep, formula sheets & tests',
      
      subj_math: 'Mathematics',
      subj_sci: 'Science',
      subj_eng: 'English',
      subj_hin: 'Hindi',
      subj_sst: 'Social Science',
      subj_comp: 'Computer Basics',
      
      stats_lessons: '50+ Interactive Lessons',
      stats_quizzes: '100+ Chapter Tests',
      stats_offline: '100% Free & Offline-Ready',

      dashboard_welcome: 'Welcome Back, Student!',
      learning_streak: 'Day Streak',
      xp_points: 'Total XP',
      completed_lessons: 'Completed Lessons',
      recent_lessons: 'Recently Opened Lessons',
      resume: 'Resume',
      quiz_scores: 'Quiz Achievements',
      
      mark_complete: 'Mark as Complete',
      lesson_completed: 'Completed ✓',
      prev_lesson: 'Previous Lesson',
      next_lesson: 'Next Lesson',
      key_terms: 'Key Terms',
      examples: 'Examples',
      read_aloud: 'Listen / Read Aloud',
      stop_speech: 'Stop Audio',
      
      quiz_title: 'Chapter Quiz Assessment',
      start_quiz: 'Start Quiz',
      time_left: 'Time Left',
      submit_quiz: 'Submit Quiz',
      retry_quiz: 'Retry Quiz',
      quiz_results: 'Quiz Results Summary',
      score: 'Score',
      percentage: 'Percentage',
      correct_answers: 'Correct Answers',
      wrong_answers: 'Wrong Answers',
      time_taken: 'Time Taken',

      library_title: 'Digital Study Library',
      search_placeholder: 'Search notes, papers, formula sheets...',
      all_categories: 'All Categories',
      download_view: 'View Document',

      teacher_title: 'Teacher Management Dashboard',
      student_roster: 'Student Roster',
      class_performance: 'Class Average Performance',
      post_announcement: 'Post Announcement',

      cert_title: 'Certificate of Achievement',
      cert_subtitle: 'This is to proudly certify that',
      cert_body: 'has successfully completed the curriculum requirements and demonstrated excellence in digital learning modules on Shiksha Setu Portal.',
      print_cert: 'Print Certificate',

      offline_mode: 'Offline Mode',
      online_mode: 'Online',
      low_data: 'Low-Data Mode',
      high_contrast: 'High Contrast',
      font_size: 'Font Size',

      nav_login: 'Login',
      nav_logout: 'Logout',
      student_login: 'Student Login',
      teacher_login: 'Teacher Login',
      select_role: 'Select Role',
      login_btn: 'Sign In',
      register_btn: 'Register',
      email: 'Email Address',
      password: 'Password',
      enter_email: 'Enter Email ',
      enter_password: 'Enter Password',

      demo_login_student: 'Quick Demo: Login as Student',
      demo_login_teacher: 'Quick Demo: Login as Teacher'
    },

    hi: {
      app_title: 'शिक्षा सेतु',
      app_tagline: 'शासकीय विद्यालय ई-लर्निंग पोर्टल',
      nav_home: 'मुख्य पृष्ठ',
      nav_dashboard: 'डैशबोर्ड',
      nav_classes: 'कक्षाएं',
      nav_subjects: 'विषय',
      nav_lessons: 'पाठ्यक्रम',
      nav_quizzes: 'प्रश्नोत्तरी (क्विज़)',
      nav_library: 'डिजिटल पुस्तकालय',
      nav_progress: 'प्रगति',
      nav_achievements: 'उपलब्धियां',
      nav_teacher: 'शिक्षक पोर्टल',
      nav_settings: 'सेटिंग्स',
      
      hero_badge: 'सरकारी स्कूल डिजिटल शिक्षा पहल',
      hero_title: 'हर छात्र के लिए गुणवत्तापूर्ण डिजिटल शिक्षा',
      hero_desc: 'कक्षा 6 से 10 तक के शासकीय विद्यालय के छात्रों के लिए निःशुल्क, सरल और सुलभ शिक्षण सामग्री।',
      start_learning: 'पढ़ाई शुरू करें',
      select_class: 'कक्षा चुनें',
      class_6_title: 'कक्षा 6',
      class_6_desc: 'विज्ञान और गणित की बुनियादी अवधारणाएं',
      class_7_title: 'कक्षा 7',
      class_7_desc: 'मध्यवर्ती तर्क और पर्यावरण विज्ञान',
      class_8_title: 'कक्षा 8',
      class_8_desc: 'उन्नत समस्या समाधान और कंप्यूटर ज्ञान',
      class_9_title: 'कक्षा 9',
      class_9_desc: 'माध्यमिक विज्ञान और बीजगणित',
      class_10_title: 'कक्षा 10',
      class_10_desc: 'बोर्ड परीक्षा की तैयारी और टेस्ट',
      
      subj_math: 'गणित',
      subj_sci: 'विज्ञान',
      subj_eng: 'अंग्रेजी',
      subj_hin: 'हिंदी',
      subj_sst: 'सामाजिक विज्ञान',
      subj_comp: 'कंप्यूटर ज्ञान',
      
      stats_lessons: '50+ अंतःक्रियात्मक पाठ',
      stats_quizzes: '100+ अध्याय टेस्ट',
      stats_offline: '100% निःशुल्क और ऑफलाइन-रेडी',

      dashboard_welcome: 'पुनः स्वागत है!',
      learning_streak: 'दिनों की निरंतरता',
      xp_points: 'कुल एक्सपी (XP)',
      completed_lessons: 'पूर्ण पाठ',
      recent_lessons: 'हाल ही में खोले गए पाठ',
      resume: 'जारी रखें',
      quiz_scores: 'क्विज़ उपलब्धियां',
      
      mark_complete: 'पूर्ण चिह्नित करें',
      lesson_completed: 'पूर्ण ✓',
      prev_lesson: 'पिछला पाठ',
      next_lesson: 'अगला पाठ',
      key_terms: 'मुख्य शब्दावली',
      examples: 'उदाहरण',
      read_aloud: 'सुनें (बोलकर पढ़ें)',
      stop_speech: 'ऑडियो रोकें',
      
      quiz_title: 'अध्याय प्रश्नोत्तरी मूल्यांकन',
      start_quiz: 'क्विज़ शुरू करें',
      time_left: 'शेष समय',
      submit_quiz: 'क्विज़ जमा करें',
      retry_quiz: 'पुनः प्रयास करें',
      quiz_results: 'क्विज़ परिणाम का विवरण',
      score: 'प्राप्तांक',
      percentage: 'प्रतिशत',
      correct_answers: 'सही उत्तर',
      wrong_answers: 'गलत उत्तर',
      time_taken: 'लिया गया समय',

      library_title: 'डिजिटल अध्ययन पुस्तकालय',
      search_placeholder: 'नोट्स, पेपर, सूत्र खोजें...',
      all_categories: 'सभी श्रेणियां',
      download_view: 'दस्तावेज़ देखें',

      teacher_title: 'शिक्षक प्रबंधन डैशबोर्ड',
      student_roster: 'छात्र सूची',
      class_performance: 'कक्षा का औसत प्रदर्शन',
      post_announcement: 'सूचना जारी करें',

      cert_title: 'उपलब्धि का प्रमाण पत्र',
      cert_subtitle: 'यह गर्व से प्रमाणित किया जाता है कि',
      cert_body: 'ने शिक्षा सेतु पोर्टल पर पाठ्यक्रम की आवश्यकताओं को सफलतापूर्वक पूरा किया और डिजिटल शिक्षण मॉड्यूल में उत्कृष्टता का प्रदर्शन किया।',
      print_cert: 'प्रमाणपत्र प्रिंट करें',

      offline_mode: 'ऑफलाइन मोड',
      online_mode: 'ऑनलाइन',
      low_data: 'लो-डेटा मोड',
      high_contrast: 'उच्च कंट्रास्ट',
      font_size: 'अक्षर का आकार',

      nav_login: 'लॉगइन',
      nav_logout: 'लॉगआउट',
      student_login: 'छात्र लॉगइन',
      teacher_login: 'शिक्षक लॉगइन',
      select_role: 'भूमिका चुनें',
      login_btn: 'प्रवेश करें',
      register_btn: 'पंजीकरण करें',
      email: 'ईमेल पता',
      password: 'पासवर्ड',

      enter_email: 'ईमेल पता दर्ज करें',
      enter_password: 'पासवर्ड दर्ज करें',

      demo_login_student: 'क्विक डेमो: छात्र के रूप में लॉगइन',
      demo_login_teacher: 'क्विक डेमो: शिक्षक के रूप में लॉगइन',
    },

    mr: {
      app_title: 'शिक्षण सेतू',
      app_tagline: 'शासकीय शाळा ई-लर्निंग पोर्टल',
      nav_home: 'मुख्य पृष्ठ',
      nav_dashboard: 'डॅशबोर्ड',
      nav_classes: 'इयत्ता',
      nav_subjects: 'विषय',
      nav_lessons: 'पाठ्यघटक',
      nav_quizzes: 'स्वाध्याय (क्विझ)',
      nav_library: 'डिजिटल ग्रंथालय',
      nav_progress: 'प्रगती',
      nav_achievements: 'यश / पदके',
      nav_teacher: 'शिक्षक विभाग',
      nav_settings: 'सेटिंग्ज',
      
      hero_badge: 'शासकीय शाळा डिजिटल शिक्षण उपक्रम',
      hero_title: 'प्रत्येक विद्यार्थ्यासाठी दर्जेदार डिजिटल शिक्षण',
      hero_desc: 'इयत्ता ६ वी ते १० वी च्या विद्यार्थ्यांसाठी मोफत, सोपे आणि ऑफलाइन उपलब्ध शिक्षण.',
      start_learning: 'शिकण्यास सुरुवात करा',
      select_class: 'इयत्ता निवडा',
      class_6_title: 'इयत्ता ६ वी',
      class_6_desc: 'विज्ञान व गणिताच्या मूलभूत संकल्पना',
      class_7_title: 'इयत्ता ७ वी',
      class_7_desc: 'मध्यम तर्कशास्त्र आणि पर्यावरण विज्ञान',
      class_8_title: 'इयत्ता ८ वी',
      class_8_desc: 'प्रगत प्रश्न निराकरण आणि संगणक ज्ञान',
      class_9_title: 'इयत्ता ९ वी',
      class_9_desc: 'माध्यमिक विज्ञान आणि बीजगणित',
      class_10_title: 'इयत्ता १० वी',
      class_10_desc: 'बोर्ड परीक्षा तयारी व सराव प्रश्नपत्रिका',
      
      subj_math: 'गणित',
      subj_sci: 'विज्ञान',
      subj_eng: 'इंग्रजी',
      subj_hin: 'हिंदी',
      subj_sst: 'सामाजिक शास्त्रे',
      subj_comp: 'संगणक मूलभूत ज्ञान',
      
      stats_lessons: '५०+ परस्परसंवादी धडे',
      stats_quizzes: '१००+ घटक चाचण्या',
      stats_offline: '१००% मोफत व ऑफलाइन उपलब्ध',

      dashboard_welcome: 'पुन्हा स्वागत आहे!',
      learning_streak: 'दिवसांचे सातत्य',
      xp_points: 'एकूण एक्सपी (XP)',
      completed_lessons: 'पूर्ण झालेले धडे',
      recent_lessons: 'नुकतेच अभ्यासलेले धडे',
      resume: 'पुढे सुरू ठेवा',
      quiz_scores: 'चाचणी यश',
      
      mark_complete: 'पूर्ण म्हणून नोंदवा',
      lesson_completed: 'पूर्ण झाले ✓',
      prev_lesson: 'मागील धडा',
      next_lesson: 'पुढील धडा',
      key_terms: 'महत्त्वाच्या संकल्पना',
      examples: 'उदाहरणे',
      read_aloud: 'वाचून ऐका (Audio)',
      stop_speech: 'आवाज थांबवा',
      
      quiz_title: 'घटक चाचणी मूल्यमापन',
      start_quiz: 'चाचणी सुरू करा',
      time_left: 'उरलेला वेळ',
      submit_quiz: 'चाचणी सबमिट करा',
      retry_quiz: 'पुन्हा प्रयत्न करा',
      quiz_results: 'चाचणी निकालाचा सारांश',
      score: 'मिळालेले गुण',
      percentage: 'टक्केवारी',
      correct_answers: 'बरोबर उत्तरे',
      wrong_answers: 'चुकीची उत्तरे',
      time_taken: 'लागलेला वेळ',

      library_title: 'डिजिटल अभ्यास ग्रंथालय',
      search_placeholder: 'टीपा, प्रश्नपत्रिका, सूत्रे शोधा...',
      all_categories: 'सर्व वर्गवारी',
      download_view: 'दस्तऐवज पहा',

      teacher_title: 'शिक्षक व्यवस्थापन डॅशबोर्ड',
      student_roster: 'विद्यार्थी यादी',
      class_performance: 'वर्गाची सरासरी प्रगती',
      post_announcement: 'सूचना प्रसिद्ध करा',

      cert_title: 'यशस्वीता प्रमाणपत्र',
      cert_subtitle: 'हे अभिमानाने प्रमाणित करण्यात येते की',
      cert_body: 'यांनी शिक्षण सेतू पोर्टलवरील अभ्यासक्रमाच्या सर्व गरजा यशस्वीरीत्या पूर्ण करून डिजिटल शिक्षणात उत्कृष्ट कामगिरी केली आहे.',
      print_cert: 'प्रमाणपत्र प्रिंट करा',

      offline_mode: 'ऑफलाइन मोड',
      online_mode: 'ऑनलाइन',
      low_data: 'कमी डेटा मोड',
      high_contrast: 'उच्च कॉन्ट्रास्ट',
      font_size: 'फॉन्ट आकार',

      nav_login: 'लॉगिन',
      nav_logout: 'लॉगआउट',
      student_login: 'विद्यार्थी लॉगिन',
      teacher_login: 'शिक्षक लॉगिन',
      select_role: 'भूमिका निवडा',
      login_btn: 'प्रवेश करा',
      register_btn: 'नोंदणी करा',
      email: 'ईमेल पत्ता',
      password: 'पासवर्ड',
      enter_email: 'ईमेल पत्ता टाका',
      enter_password: 'पासवर्ड टाका',

      demo_login_student: 'क्विक प्रात्यक्षिक: विद्यार्थी म्हणून लॉगिन',
      demo_login_teacher: 'क्विक प्रात्यक्षिक: शिक्षक म्हणून लॉगिन',
    }
  }
};
