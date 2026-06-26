/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Exam, Quiz, Question, BlogPost, LeaderboardItem, Difficulty, Language } from "../types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "ssc",
    name: "SSC",
    description: "Staff Selection Commission Exams",
    iconName: "FileText",
    quizCount: 500,
    colorClass: "from-blue-500/20 to-blue-600/10 border-blue-200 text-blue-700"
  },
  {
    id: "upsc",
    name: "UPSC",
    description: "Union Public Service Commission",
    iconName: "Award",
    quizCount: 500,
    colorClass: "from-purple-500/20 to-purple-600/10 border-purple-200 text-purple-700"
  },
  {
    id: "railway",
    name: "Railway",
    description: "RRB NTPC, Group D, ALP",
    iconName: "Train",
    quizCount: 500,
    colorClass: "from-sky-500/20 to-sky-600/10 border-sky-200 text-sky-700"
  },
  {
    id: "banking",
    name: "Banking",
    description: "IBPS PO, SBI Clerk, RBI",
    iconName: "Coins",
    quizCount: 500,
    colorClass: "from-indigo-500/20 to-indigo-600/10 border-indigo-200 text-indigo-700"
  },
  {
    id: "teaching",
    name: "Teaching",
    description: "CTET, REET, KVS, NVS",
    iconName: "GraduationCap",
    quizCount: 500,
    colorClass: "from-orange-500/20 to-orange-600/10 border-orange-200 text-orange-700"
  },
  {
    id: "police",
    name: "Police",
    description: "State Police Constable & SI",
    iconName: "Shield",
    quizCount: 500,
    colorClass: "from-red-500/20 to-red-600/10 border-red-200 text-red-700"
  },
  {
    id: "defence",
    name: "Defence",
    description: "Army, Navy, Air Force",
    iconName: "Milestone",
    quizCount: 500,
    colorClass: "from-teal-500/20 to-teal-600/10 border-teal-200 text-teal-700"
  },
  {
    id: "state-psc",
    name: "State PSC",
    description: "All State PCS Exams",
    iconName: "Map",
    quizCount: 500,
    colorClass: "from-amber-500/20 to-amber-600/10 border-amber-200 text-amber-700"
  },
  {
    id: "judiciary",
    name: "Judiciary",
    description: "Judicial Services Exam",
    iconName: "Scale",
    quizCount: 500,
    colorClass: "from-rose-500/20 to-rose-600/10 border-rose-200 text-rose-700"
  },
  {
    id: "nursing",
    name: "Nursing",
    description: "AIIMS, NHM Nursing",
    iconName: "HeartPulse",
    quizCount: 500,
    colorClass: "from-emerald-500/20 to-emerald-600/10 border-emerald-200 text-emerald-700"
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "GATE, SSC JE, RRB JE",
    iconName: "Wrench",
    quizCount: 500,
    colorClass: "from-cyan-500/20 to-cyan-600/10 border-cyan-200 text-cyan-700"
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Agricultural Exams",
    iconName: "Leaf",
    quizCount: 500,
    colorClass: "from-green-500/20 to-green-600/10 border-green-200 text-green-700"
  },
  {
    id: "current-affairs",
    name: "Current Affairs",
    description: "Daily & Weekly Updates",
    iconName: "Calendar",
    quizCount: 500,
    colorClass: "from-pink-500/20 to-pink-600/10 border-pink-200 text-pink-700"
  },
  {
    id: "gk",
    name: "General Knowledge",
    description: "History, Geography, Polity",
    iconName: "Globe",
    quizCount: 500,
    colorClass: "from-indigo-500/20 to-indigo-600/10 border-indigo-200 text-indigo-700"
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    fullName: "UPSC CSE",
    category: "SSC",
    vacancies: "17,727 Posts",
    lastDate: "25 Jan 2027",
    practiceUrl: "#",
    colorClass: "from-blue-600 to-indigo-700",
    tier: "Graduate"
  },
  {
    id: "upsc-cse",
    name: "UPSC CSE",
    fullName: "Union Public Service Commission",
    category: "UPSC",
    vacancies: "1,056 Posts",
    lastDate: "11 Feb 2027",
    practiceUrl: "#",
    colorClass: "from-fuchsia-600 to-pink-700",
    tier: "Graduate"
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway NTPC Exam",
    category: "Railway",
    vacancies: "11,558 Posts",
    lastDate: "15 Feb 2027",
    practiceUrl: "#",
    colorClass: "from-sky-600 to-blue-700",
    tier: "Graduate/12th"
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection",
    category: "Banking",
    vacancies: "4,455 Posts",
    lastDate: "01 Feb 2027",
    practiceUrl: "#",
    colorClass: "from-teal-600 to-emerald-700",
    tier: "Graduate"
  },
  {
    id: "up-police",
    name: "UP Police",
    fullName: "Uttar Pradesh Police Constable",
    category: "Police",
    vacancies: "60,244 Posts",
    lastDate: "28 Jan 2027",
    practiceUrl: "#",
    colorClass: "from-rose-600 to-red-700",
    tier: "12th Pass"
  },
  {
    id: "army-agniveer",
    name: "Army Agniveer",
    fullName: "Indian Army Agniveer Recruitment",
    category: "Defence",
    vacancies: "25,000 Posts",
    lastDate: "15 Feb 2027",
    practiceUrl: "#",
    colorClass: "from-amber-600 to-orange-700",
    tier: "10th/12th"
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "quiz-ssc-gd-constable",
    title: "SSC GD Constable 2026",
    description: "General GK and Elementary Mathematics booster quiz.",
    categoryId: "ssc",
    examId: "ssc-gd",
    durationMinutes: 10,
    difficulty: Difficulty.MEDIUM,
    language: Language.ENGLISH,
    questionsCount: 5,
    attemptsCount: 46123,
    rating: 4.8,
    tags: ["GK", "Maths", "Constable"],
    seoTitle: "SSC GD Constable Mock Test 2026 Quiz",
    seoDescription: "Attempt free SSC GD Constable GK and Maths Quiz online. Score high in India's leading staff vacancy tests."
  },
  {
    id: "quiz-ssc-cgl-tier1",
    title: "SSC CGL Tier I 2026",
    description: "Advance level Quantitative Aptitude & General Intelligence.",
    categoryId: "ssc",
    examId: "ssc-cgl",
    durationMinutes: 15,
    difficulty: Difficulty.HARD,
    language: Language.ENGLISH,
    questionsCount: 5,
    attemptsCount: 89450,
    rating: 4.9,
    tags: ["CGL", "Maths", "Reasoning"],
    seoTitle: "SSC CGL Tier I Quantitative Aptitude Test Online",
    seoDescription: "Challenge yourself with custom Quantitative Aptitude and General Intelligence mock quizzes for SSC CGL Tier 1."
  },
  {
    id: "quiz-rrb-group-d",
    title: "RRB Group D 2026",
    description: "General Science & GK based on latest RRB patterns.",
    categoryId: "railway",
    examId: "rrb-group-d",
    durationMinutes: 10,
    difficulty: Difficulty.EASY,
    language: Language.ENGLISH,
    questionsCount: 5,
    attemptsCount: 123400,
    rating: 4.8,
    tags: ["Railway", "Science", "GK"],
    seoTitle: "RRB Group D Free General Science Quiz online",
    seoDescription: "Free online mock tests and topic quizzes for RRB Group D general science and basic GS sections."
  },
  {
    id: "quiz-hindi-grammar",
    title: "Hindi Grammar Quiz (हिंदी व्याकरण)",
    description: "तद्भव, तत्सम, संज्ञा, संधि, समास, पर्यायवाची और स्त्रीलिंग/पुल्लिंग प्रश्न।",
    categoryId: "gk",
    durationMinutes: 8,
    difficulty: Difficulty.EASY,
    language: Language.HINDI,
    questionsCount: 5,
    attemptsCount: 78500,
    rating: 4.9,
    tags: ["Hindi", "हिंदी व्याकरण", "State Exams"],
    seoTitle: "Hindi Vyakaran General Grammar Quiz for State PSC Exams",
    seoDescription: "अभ्यास करें हिंदी व्याकरण के महत्वपूर्ण प्रश्नोत्तरी का जो राज्य स्तरीय पुलिस, शिक्षक भर्ती और पीएससी के लिए आवश्यक हैं।"
  },
  {
    id: "quiz-english-vocabulary",
    title: "English Vocabulary & Spelling Quiz",
    description: "Master spellings, antonyms, synonyms, and idioms for competitive exams.",
    categoryId: "gk",
    durationMinutes: 8,
    difficulty: Difficulty.MEDIUM,
    language: Language.ENGLISH,
    questionsCount: 5,
    attemptsCount: 54300,
    rating: 4.7,
    tags: ["English", "Vocabulary", "Banking"],
    seoTitle: "Competitive English Spelling and Vocabulary Quiz Practice",
    seoDescription: "Boost your IBPS, SSC, and insurance exam English scores with this vocabulary and grammar mock set."
  },
  {
    id: "quiz-current-affairs-today",
    title: "India & World Current Affairs - Daily Booster",
    description: "Daily updated booster on national events, sports, and international schemes.",
    categoryId: "current-affairs",
    durationMinutes: 10,
    difficulty: Difficulty.MEDIUM,
    language: Language.ENGLISH,
    questionsCount: 5,
    attemptsCount: 124500,
    rating: 4.9,
    tags: ["Current Affairs", "Daily Quiz", "Latest Notification"],
    seoTitle: "Daily Indian and Global Current Affairs GK Quiz Online",
    seoDescription: "Practice latest 2026 current affairs questions with detailed explanations. Updated daily with employment news."
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // SSC GD Questions
  {
    id: "q-ssc-gd-1",
    quizId: "quiz-ssc-gd-constable",
    text: "Which of the following is the highest dam in India?",
    options: ["Tehri Dam", "Bhakra Nangal Dam", "Hirakud Dam", "Nagarjuna Sagar Dam"],
    correctOptionIndex: 0,
    explanation: "Tehri Dam located on the Bhagirathi River in Uttarakhand is the highest dam in India with a height of 260.5 meters.",
    points: 10
  },
  {
    id: "q-ssc-gd-2",
    quizId: "quiz-ssc-gd-constable",
    text: "What is the capital of Lakshadweep?",
    options: ["Kavaratti", "Port Blair", "Silvassa", "Daman"],
    correctOptionIndex: 0,
    explanation: "Kavaratti is the capital city and union territory headquarters of Lakshadweep in India.",
    points: 10
  },
  {
    id: "q-ssc-gd-3",
    quizId: "quiz-ssc-gd-constable",
    text: "Who was the first female Governor of an Indian State?",
    options: ["Sarojini Naidu", "Sucheta Kripalani", "Indira Gandhi", "Pratibha Patil"],
    correctOptionIndex: 0,
    explanation: "Sarojini Naidu was appointed as the Governor of the United Provinces (now Uttar Pradesh) from 1947 to 1949, making her the first woman to hold this post in India.",
    points: 10
  },
  {
    id: "q-ssc-gd-4",
    quizId: "quiz-ssc-gd-constable",
    text: "Which article of the Indian Constitution guarantees the Right to Education?",
    options: ["Article 21A", "Article 19", "Article 32", "Article 45"],
    correctOptionIndex: 0,
    explanation: "Article 21A was added by the 86th Constitutional Amendment Act 2002 to make the Right to Education a Fundamental Right for children aged 6 to 14 years.",
    points: 10
  },
  {
    id: "q-ssc-gd-5",
    quizId: "quiz-ssc-gd-constable",
    text: "If a sum of money doubles itself in 5 years at simple interest, what is the rate of interest per annum?",
    options: ["20%", "10%", "15%", "25%"],
    correctOptionIndex: 0,
    explanation: "Simple Interest SI = P. Under doubling, SI = P. Thus P = (P * R * 5) / 100 => 5R = 100 => R = 20%.",
    points: 10
  },

  // SSC CGL Questions
  {
    id: "q-ssc-cgl-1",
    quizId: "quiz-ssc-cgl-tier1",
    text: "Who presided over the 1907 Surat Session of the Indian National Congress where the Congress split into Extremists and Moderates?",
    options: ["Rash Behari Ghosh", "Dadabhai Naoroji", "Gopal Krishna Gokhale", "Bal Gangadhar Tilak"],
    correctOptionIndex: 0,
    explanation: "Dr. Rash Behari Ghosh presided over the Surat Session of 1907, which witnessed the split of INC into Moderates and Extremists over ideology differences.",
    points: 20
  },
  {
    id: "q-ssc-cgl-2",
    quizId: "quiz-ssc-cgl-tier1",
    text: "The ratio of present ages of A and B is 4:5. After 5 years, the ratio becomes 5:6. What is the present age of A?",
    options: ["20 years", "25 years", "30 years", "15 years"],
    correctOptionIndex: 0,
    explanation: "Let ages be 4x and 5x. (4x+5)/(5x+5) = 5/6 => 24x + 30 = 25x + 25 => x = 5. Age of A = 4 * 5 = 20 years.",
    points: 20
  },
  {
    id: "q-ssc-cgl-3",
    quizId: "quiz-ssc-cgl-tier1",
    text: "Which state in India has the longest coastline?",
    options: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Maharashtra"],
    correctOptionIndex: 0,
    explanation: "Gujarat has the longest mainland coastline in India, extending about 1,600 km, followed by Andhra Pradesh.",
    points: 20
  },
  {
    id: "q-ssc-cgl-4",
    quizId: "quiz-ssc-cgl-tier1",
    text: "What is the chemical name of Baking Soda?",
    options: ["Sodium Bicarbonate", "Sodium Carbonate", "Calcium Carbonate", "Sodium Chloride"],
    correctOptionIndex: 0,
    explanation: "Baking Soda is Sodium Bicarbonate (NaHCO3), whereas Sodium Carbonate (Na2CO3) is washing soda.",
    points: 20
  },
  {
    id: "q-ssc-cgl-5",
    quizId: "quiz-quiz-ssc-cgl-tier1",
    text: "In a code, 'ROSE' is written as 'TQUG'. How is 'BISCUIT' written?",
    options: ["DKUEWKV", "DKVEXKW", "DKUEWJV", "CKTDVJS"],
    correctOptionIndex: 0,
    explanation: "Each letter is shifted by +2 (R->T, O->Q, S->U, E->G). Similarly, B->D, I->K, S->U, C->E, U->W, I->K, T->V.",
    points: 20
  },

  // RRB Group D Questions
  {
    id: "q-rrb-1",
    quizId: "quiz-rrb-group-d",
    text: "Which of the following is a scalar quantity?",
    options: ["Mass", "Velocity", "Acceleration", "Force"],
    correctOptionIndex: 0,
    explanation: "Mass has only magnitude and no specific direction, which makes it a scalar quantity. Velocity, acceleration, and force are vector quantities.",
    points: 10
  },
  {
    id: "q-rrb-2",
    quizId: "quiz-rrb-group-d",
    text: "What is the SI unit of power?",
    options: ["Watt", "Joule", "Newton", "Pascal"],
    correctOptionIndex: 0,
    explanation: "The SI unit of power is Watt (W), which represents one joule of energy expended per second.",
    points: 10
  },
  {
    id: "q-rrb-3",
    quizId: "quiz-rrb-group-d",
    text: "Which gas is filled inside an electric bulb to prevent oxidation of filament?",
    options: ["Nitrogen or Argon", "Oxygen", "Carbon Dioxide", "Hydrogen"],
    correctOptionIndex: 0,
    explanation: "Chemically inactive gases like Argon or Nitrogen are filled inside bulbs to prevent the hot tungsten filament from oxidizing.",
    points: 10
  },
  {
    id: "q-rrb-4",
    quizId: "quiz-rrb-group-d",
    text: "Where is the head office of Western Railway located?",
    options: ["Mumbai (Churchgate)", "Mumbai (CST)", "Jaipur", "Ahmedabad"],
    correctOptionIndex: 0,
    explanation: "The headquarters of Western Railway is situated at Churchgate, Mumbai.",
    points: 10
  },
  {
    id: "q-rrb-5",
    quizId: "quiz-rrb-group-d",
    text: "What is the normal pH value of human blood?",
    options: ["7.35 - 7.45", "6.1 - 6.5", "8.0 - 8.5", "5.5 - 6.0"],
    correctOptionIndex: 0,
    explanation: "Human blood is slightly basic, with a healthy normal pH range between approximately 7.35 and 7.45.",
    points: 10
  },

  // Hindi Grammar Questions
  {
    id: "q-hindi-1",
    quizId: "quiz-hindi-grammar",
    text: "निम्नलिखित में से कौन सा शब्द तद्भव है?",
    options: ["अग्नि", "आग", "जल", "वायु"],
    correctOptionIndex: 1,
    explanation: "आग शब्द तद्भव है, इसका तत्सम (संस्कृत) रूप 'अग्नि' होता है।",
    points: 10
  },
  {
    id: "q-hindi-2",
    quizId: "quiz-hindi-grammar",
    text: "'राजा' शब्द का बहुवचन रूप क्या है?",
    options: ["राजाएँ", "राजाओं", "राजे", "राजा"],
    correctOptionIndex: 3,
    explanation: "'राजा' शब्द का एकवचन और बहुवचन रूप समान 'राजा' ही होता है। वाक्य प्रयोग पर निर्भर करता है (जैसे: 'सभी राजा एकत्रित हुए')।",
    points: 10
  },
  {
    id: "q-hindi-3",
    quizId: "quiz-hindi-grammar",
    text: "निम्नलिखित में से कौन सा शब्द स्त्रीलिंग है?",
    options: ["घोड़ा", "कुत्ता", "लड़की", "लड़का"],
    correctOptionIndex: 2,
    explanation: "लड़की शब्द संज्ञा रूप में स्त्रीलिंग जाति को दर्शाता है।",
    points: 10
  },
  {
    id: "q-hindi-4",
    quizId: "quiz-hindi-grammar",
    text: "'सूर्योदय' शब्द का संधि विच्छेद क्या होगा?",
    options: ["सूर्य + उदय", "सूर्यो + दय", "सूर्य + उदयः", "सूर + उदय"],
    correctOptionIndex: 0,
    explanation: "सूर्योदय का सही संधि विच्छेद 'सूर्य + उदय' है। यहाँ अ + उ मिलकर 'ओ' (गुण स्वर संधि) बनते हैं।",
    points: 10
  },
  {
    id: "q-hindi-5",
    quizId: "quiz-hindi-grammar",
    text: "'त्रिफला' शब्द में कौन सा समास है?",
    options: ["द्विगु समास", "द्वंद्व समास", "तत्पुरुष समास", "कर्मधारय समास"],
    correctOptionIndex: 0,
    explanation: "त्रिफला का अर्थ है 'तीन फलों का समाहार'। चूँकि प्रथम पद संख्यावाचक ('त्रि') है, इसलिए यह द्विगु समास है।",
    points: 10
  },

  // English Questions
  {
    id: "q-eng-1",
    quizId: "quiz-english-vocabulary",
    text: "Choose the correct spelling:",
    options: ["Accommodation", "Accomodation", "Acomodation", "Acommoration"],
    correctOptionIndex: 0,
    explanation: "The correct spelling is 'Accommodation' which contains double 'c' and double 'm'.",
    points: 10
  },
  {
    id: "q-eng-2",
    quizId: "quiz-english-vocabulary",
    text: "Select the antonym of the word 'BENEVOLENT':",
    options: ["Malevolent", "Kind", "Genial", "Compassionate"],
    correctOptionIndex: 0,
    explanation: "Benevolent means kind and well-meaning. Malevolent means having or showing a wish to do evil to others, which is the exact opposite.",
    points: 10
  },
  {
    id: "q-eng-3",
    quizId: "quiz-english-vocabulary",
    text: "Fill in the blank: 'Neither of the two candidates ________ qualified for the post.'",
    options: ["is", "are", "have been", "were"],
    correctOptionIndex: 0,
    explanation: "Words like 'Neither', 'Either', 'Each' take a singular verb. Hence, 'Neither... is qualified' is correct.",
    points: 10
  },
  {
    id: "q-eng-4",
    quizId: "quiz-english-vocabulary",
    text: "Find the synonym of 'AUDACIOUS':",
    options: ["Bold", "Timid", "Mute", "Polite"],
    correctOptionIndex: 0,
    explanation: "Audacious means showing a willingness to take surprisingly bold risks.",
    points: 10
  },
  {
    id: "q-eng-5",
    quizId: "quiz-english-vocabulary",
    text: "What is the meaning of the idiom 'To burn the midnight oil'?",
    options: ["To work late into the night", "To waste fuel unnecessarily", "To create light with oil lamps", "To wake up early in the morning"],
    correctOptionIndex: 0,
    explanation: "The idiom 'To burn the midnight oil' means to read or work late into the night.",
    points: 10
  },

  // Current Affairs Questions
  {
    id: "q-ca-1",
    quizId: "quiz-current-affairs-today",
    text: "Which country hosted the G20 Summit in late 2025?",
    options: ["South Africa", "Brazil", "India", "Saudi Arabia"],
    correctOptionIndex: 0,
    explanation: "South Africa assumed the G20 Presidency and hosted the main summit proceedings in late 2025, succeeding Brazil.",
    points: 10
  },
  {
    id: "q-ca-2",
    quizId: "quiz-current-affairs-today",
    text: "What is the name of India's indigenous solar observation mission launched by ISRO?",
    options: ["Aditya-L1", "Gaganyaan", "Chandrayaan-3", "AstroSat"],
    correctOptionIndex: 0,
    explanation: "Aditya-L1 is India's first dedicated spacecraft mission to study the Sun, positioned in a halo orbit around the Lagrangian point 1 (L1).",
    points: 10
  },
  {
    id: "q-ca-3",
    quizId: "quiz-current-affairs-today",
    text: "Who was awarded the Nobel Peace Prize for the year 2025?",
    options: ["Nihon Hidankyo", "Narges Mohammadi", "Maria Ressa", "World Food Programme"],
    correctOptionIndex: 0,
    explanation: "The Nobel Peace Prize 2024/2025 went to Japanese organization 'Nihon Hidankyo' for its efforts to achieve a world free of nuclear weapons.",
    points: 10
  },
  {
    id: "q-ca-4",
    quizId: "quiz-current-affairs-today",
    text: "Which state government launched the 'Lado Protsahan Yojana' to support female student higher education in 2025-2026?",
    options: ["Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Bihar"],
    correctOptionIndex: 0,
    explanation: "The Rajasthan government announced the 'Lado Protsahan Yojana' to provide financial support and savings bonds for girl children on birth and schooling milestones.",
    points: 10
  },
  {
    id: "q-ca-5",
    quizId: "quiz-current-affairs-today",
    text: "Which team won the ICC Men's Champions Trophy held in early 2025?",
    options: ["Pakistan", "India", "Australia", "New Zealand"],
    correctOptionIndex: 0,
    explanation: "The ICC Champions Trophy 2025 was concluded with Pakistan securing the title in a thrilling campaign hosted in South Asia.",
    points: 10
  }
];

export const INITIAL_LEADERBOARD: LeaderboardItem[] = [
  {
    id: "leader-1",
    name: "Rahul Kumar",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    score: 9850,
    accuracy: 98.5,
    quizzesTaken: 45,
    rank: 1,
    badge: "Champion"
  },
  {
    id: "leader-2",
    name: "Priya Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    score: 9720,
    accuracy: 97.2,
    quizzesTaken: 42,
    rank: 2,
    badge: "Speed King"
  },
  {
    id: "leader-3",
    name: "Amit Singh",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120",
    score: 9680,
    accuracy: 96.8,
    quizzesTaken: 40,
    rank: 3,
    badge: "90%+ Accuracy"
  },
  {
    id: "leader-4",
    name: "Sneha Patel",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    score: 9540,
    accuracy: 95.4,
    quizzesTaken: 40,
    rank: 4,
    badge: "7 Day Streak"
  },
  {
    id: "leader-5",
    name: "Vikash Yadav",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    score: 9380,
    accuracy: 93.8,
    quizzesTaken: 38,
    rank: 5,
    badge: "100 Quizzes"
  },
  {
    id: "leader-6",
    name: "Pooja Verma",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    score: 9250,
    accuracy: 92.5,
    quizzesTaken: 35,
    rank: 6
  },
  {
    id: "leader-7",
    name: "Suresh Gupta",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    score: 9120,
    accuracy: 91.2,
    quizzesTaken: 33,
    rank: 7
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "SSC GD Constable 2026: Complete Syllabus, Exam Pattern & Preparation Strategy",
    slug: "ssc-gd-constable-syllabus-pattern",
    excerpt: "Complete guide to SSC GD Constable 2026 examination including detailed syllabus, exam pattern, physical standards, and preparation tips.",
    content: `### SSC GD Constable 2026 Exam Overview

The Staff Selection Commission (SSC) conducts the GD Constable Exam annually to recruit candidates for General Duty posts in Border Security Force (BSF), Central Industrial Security Force (CISF), Central Reserve Police Force (CRPF), Indo Tibetan Border Police (ITBP), Sashastra Seema Bal (SSB), Secretariat Security Force (SSF), and Rifleman (General Duty) in Assam Rifles.

#### Exam Pattern:
The Computer Based Examination (CBE) will consist of one objective type paper containing 80 questions carrying 2 marks each:
1. **General Intelligence and Reasoning**: 20 Questions (40 Marks)
2. **General Knowledge and General Awareness**: 20 Questions (40 Marks)
3. **Elementary Mathematics**: 20 Questions (40 Marks)
4. **English/Hindi**: 20 Questions (40 Marks)

Total Time: 60 Minutes.
Negative marking is **0.50 marks** for each wrong answer.

#### Preparation Tips:
- **Solve daily mock quizzes** in Hindi & English on QuizRank India.
- Focus on basic quantitative formulas and speed-reading of newspapers for daily Current Affairs.
- Track accuracy closely to manage the negative marking threshold.`,
    category: "Syllabus",
    publishedAt: "2026-06-15",
    readTimeMinutes: 8,
    views: 48250,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "post-2",
    title: "RRB NTPC 2026 Notification Released: 11,558 Vacancies, Apply Now!",
    slug: "rrb-ntpc-2026-notification-released",
    excerpt: "Railway Recruitment Board (RRB) has released the recruitment notice for NTPC Graduate & Under-Graduate levels. Read eligibility criteria.",
    content: `### RRB NTPC 2026 Notification Details

Indian Railways has announced high-profile recruitment under Non-Technical Popular Categories (NTPC). Eligible applicants can submit application forms starting today on the zonal websites.

#### Post Details:
- **Undergraduate Posts**: Junior Clerk cum Typist, Accounts Clerk cum Typist, Junior Time Keeper, Trains Clerk, Commercial cum Ticket Clerk.
- **Graduate Posts**: Traffic Assistant, Goods Guard, Senior Commercial cum Ticket Clerk, Senior Clerk cum Typist, Junior Accounts Assistant cum Typist, Station Master.

#### Selection Process:
1. First Stage Computer Based Test (CBT-1)
2. Second Stage Computer Based Test (CBT-2)
3. Typing Skill Test/Computer Based Aptitude Test (as applicable)
4. Document Verification and Medical Examination.

Bookmark the **RRB NTPC Collection** on QuizRank India to practice real exam papers!`,
    category: "Notification",
    publishedAt: "2026-06-20",
    readTimeMinutes: 5,
    views: 89300,
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "post-3",
    title: "UPSC CSE 2026: Prelims Date Announced, Important Schedule Updates",
    slug: "upsc-cse-2026-prelims-announced",
    excerpt: "Union Public Service Commission released the calendar confirming Civil Services Preliminary Exam date. Check application dates and deadlines.",
    content: `### Civil Services Preliminary Examination 2026

The Union Public Service Commission (UPSC) has officially published the Civil Services calendar. The prestigious CSE Prelims is scheduled to take place on Sunday, May 24th, 2026.

#### Key Timelines:
- **Notification Release**: February 11, 2026
- **Last Date for Applications**: March 3, 2026
- **Admit Card Release**: Early May 2026
- **Preliminary Examination**: May 24, 2026

We have launched a custom **UPSC daily current affairs and history quiz** mapping standard static NCERT sections. Start practicing now to elevate your Rank Prediction score!`,
    category: "Exam Dates",
    publishedAt: "2026-06-22",
    readTimeMinutes: 6,
    views: 68100,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400"
  }
];
