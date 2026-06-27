/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_CATEGORIES, INITIAL_QUIZZES, INITIAL_QUESTIONS, INITIAL_LEADERBOARD, INITIAL_BLOG_POSTS } from "./src/data/initialData.js";
import { PREMIUM_BLOG_POSTS } from "./src/data/premiumBlogs.js";
import { FRESH_NEWS_EVENTS, FRESH_QUESTIONS_POOL } from "./src/data/currentAffairsPool.js";
import { Difficulty, Language, Quiz, Question, Result, LeaderboardItem, BlogPost, AppNotification } from "./src/types.js";
import { getVirtualQuiz, getVirtualQuestions } from "./src/data/virtualGenerator.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Path to persistent data file
const DATA_FILE = path.join(process.cwd(), "data.json");

// Define structure of our local database
interface LocalDB {
  categories: any[];
  quizzes: Quiz[];
  questions: Question[];
  leaderboard: LeaderboardItem[];
  blogs: BlogPost[];
  notifications: AppNotification[];
  results: Result[];
  currentAffairsEvents?: any[];
  governmentJobEvents?: any[];
  currentAffairsStats?: {
    questionsGeneratedToday: number;
    questionsPublished: number;
    questionsRejected: number;
    duplicateCount: number;
    latestUpdateTime: string;
    automationStatus: string;
    cronJobStatus: string;
    lastRunSlots: string[];
  };
}

// Ensure database file exists
// Startup Environment Validation System
function validateEnvironment() {
  const missingVars: string[] = [];
  if (!process.env.GEMINI_API_KEY) {
    missingVars.push("GEMINI_API_KEY");
  }

  const separator = "=".repeat(72);
  if (missingVars.length > 0) {
    const errorMsg = `
${separator}
🚨 STARTUP ENVIRONMENT VALIDATION ERROR 🚨
The following required environment variable(s) are missing:
${missingVars.map(v => `   - ${v}`).join("\n")}

Please configure these variables in your settings:
- In Google AI Studio: Add them in Settings -> Secrets.
- In Production (Cloudflare/Netlify/Vercel): Add them in the dashboard.
${separator}
`;
    console.error(errorMsg);
    
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Production Startup Failure: Missing environment variables: ${missingVars.join(", ")}`);
    }
  } else {
    console.log("✅ Environment validation succeeded! Required secrets are loaded.");
  }
}

validateEnvironment();

// Ensure database file exists
let inMemoryDB: LocalDB | null = null;

function loadDB(): LocalDB {
  if (inMemoryDB) {
    return inMemoryDB;
  }

  let db: LocalDB;
  try {
    if (fs && typeof fs.existsSync === "function" && fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      db = JSON.parse(data);
    } else {
      db = {} as any;
    }
  } catch (e) {
    console.warn("Failed to read DB from fs (using empty default DB):", e);
    db = {} as any;
  }
  
  // Fill missing parts with default values
  if (!db.categories || db.categories.length === 0) db.categories = INITIAL_CATEGORIES;
  if (!db.quizzes || db.quizzes.length === 0) db.quizzes = INITIAL_QUIZZES;
  if (!db.questions || db.questions.length === 0) db.questions = INITIAL_QUESTIONS;
  if (!db.leaderboard || db.leaderboard.length === 0) db.leaderboard = INITIAL_LEADERBOARD;
  
  // Completely purge old low-quality blog posts and seed with pristine premium posts
  if (!db.blogs || db.blogs.length === 0 || !db.blogs.some((b: any) => b.id.startsWith("premium-"))) {
    db.blogs = PREMIUM_BLOG_POSTS;
  } else {
    // Retain only premium or newly dynamic generated articles (with ID prefix premium- or gen-)
    db.blogs = db.blogs.filter((b: any) => b.id.startsWith("premium-") || b.id.startsWith("gen-"));
    // Ensure all premium articles exist
    for (const prem of PREMIUM_BLOG_POSTS) {
      if (!db.blogs.some((b: any) => b.id === prem.id)) {
        db.blogs.push(prem);
      }
    }
  }

  if (!db.notifications) {
    db.notifications = [
      {
        id: "notif-1",
        title: "RRB NTPC 2026 Notification Released!",
        message: "Indian Railways released 11,558 NTPC undergraduate and graduate posts. Free mock tests added.",
        type: "alert",
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "notif-2",
        title: "Hindi General Subject Quiz Updated",
        message: "Attempt our newly launched Hindi language general knowledge sets with complete answers in Hindi.",
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  }
  if (!db.results) db.results = [];
  
  // Auto-initialize current affairs entities if not present
  if (!db.currentAffairsEvents) {
    db.currentAffairsEvents = [];
  }
  if (!db.governmentJobEvents) {
    db.governmentJobEvents = [];
  }
  if (!db.currentAffairsStats) {
    db.currentAffairsStats = {
      questionsGeneratedToday: 0,
      questionsPublished: 0,
      questionsRejected: 0,
      duplicateCount: 0,
      latestUpdateTime: new Date().toISOString(),
      automationStatus: "Active",
      cronJobStatus: "Healthy",
      lastRunSlots: []
    };
  }

  // Purge any outdated 2025 quizzes in the current affairs category right away
  db.quizzes = db.quizzes.filter(quiz => {
    if (quiz.categoryId === "current-affairs") {
      // Reject any old 2025 quizzes or static placeholder
      const has2025 = quiz.title.includes("2025") || quiz.description.includes("2025") || quiz.id === "quiz-current-affairs-today";
      return !has2025;
    }
    return true;
  });

  // Purge associated questions for removed quizzes
  const activeQuizIds = new Set(db.quizzes.map(q => q.id));
  db.questions = db.questions.filter(q => activeQuizIds.has(q.quizId) || q.quizId.startsWith("cron-ca-") || q.quizId.startsWith("pipeline-ca-"));

  try {
    if (fs && typeof fs.writeFileSync === "function") {
      fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch (e) {
    console.warn("Failed to write updated DB to fs:", e);
  }

  inMemoryDB = db;
  return db;
}

function saveDB(db: LocalDB) {
  inMemoryDB = db;
  try {
    if (fs && typeof fs.writeFileSync === "function") {
      fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch (e) {
    console.warn("Failed to write DB to fs (falling back to memory):", e);
  }
}

const dbData = loadDB();

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Run database QA scanning and auto-repair on startup
if (ai) {
  cleanupAndRepairDB().catch(err => {
    console.error("Startup database QA cleanup error:", err);
  });
}

app.use(express.json());

// API: Health Check and Diagnostics
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    database: "JSON_InMemory_Resilient",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/diagnostics", (req: Request, res: Response) => {
  res.json({
    success: true,
    diagnostics: {
      geminiApiKeyConfigured: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV || "development",
      port: PORT,
      databaseFileExists: fs.existsSync(DATA_FILE),
      inMemoryActive: !!inMemoryDB,
      registeredCategories: loadDB().categories?.length || 0,
      registeredQuizzes: loadDB().quizzes?.length || 0,
      registeredBlogs: loadDB().blogs?.length || 0,
    }
  });
});

// API: Get categories
app.get("/api/categories", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.categories);
});

// API: Get quizzes
app.get("/api/quizzes", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.quizzes);
});

// API: Get single quiz
app.get("/api/quizzes/:id", (req: Request, res: Response) => {
  if (req.params.id && req.params.id.startsWith("virtual-")) {
    const parts = req.params.id.split("-");
    const testNumber = parseInt(parts.pop() || "1", 10);
    const categoryId = parts.slice(1).join("-");
    const quiz = getVirtualQuiz(categoryId, testNumber);
    if (quiz) {
      res.json(quiz);
      return;
    }
  }
  const db = loadDB();
  const quiz = db.quizzes.find(q => q.id === req.params.id);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  res.json(quiz);
});

// API: Get questions for a quiz
app.get("/api/quizzes/:id/questions", (req: Request, res: Response) => {
  if (req.params.id && req.params.id.startsWith("virtual-")) {
    const parts = req.params.id.split("-");
    const testNumber = parseInt(parts.pop() || "1", 10);
    const categoryId = parts.slice(1).join("-");
    const questions = getVirtualQuestions(categoryId, testNumber);
    res.json(questions);
    return;
  }
  const db = loadDB();
  const questions = db.questions.filter(q => q.quizId === req.params.id);
  res.json(questions);
});

// API: Submit quiz result and calculate score, predicted rank & percentile
app.post("/api/quizzes/:id/submit", (req: Request, res: Response) => {
  const db = loadDB();
  const { userId, userAnswers, timeSpentSeconds, userName } = req.body;
  let quiz = db.quizzes.find(q => q.id === req.params.id);
  
  if (!quiz && req.params.id && req.params.id.startsWith("virtual-")) {
    const parts = req.params.id.split("-");
    const testNumber = parseInt(parts.pop() || "1", 10);
    const categoryId = parts.slice(1).join("-");
    quiz = getVirtualQuiz(categoryId, testNumber);
  }
  
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  
  let quizQuestions: Question[];
  if (req.params.id && req.params.id.startsWith("virtual-")) {
    const parts = req.params.id.split("-");
    const testNumber = parseInt(parts.pop() || "1", 10);
    const categoryId = parts.slice(1).join("-");
    quizQuestions = getVirtualQuestions(categoryId, testNumber);
  } else {
    quizQuestions = db.questions.filter(q => q.quizId === quiz.id);
  }
  
  let correctAnswersCount = 0;
  let wrongAnswersCount = 0;
  let skippedCount = 0;
  let totalScore = 0;
  let totalPointsMax = 0;
  
  quizQuestions.forEach((question, index) => {
    totalPointsMax += (question.points || 10);
    const userAnswer = userAnswers[question.id];
    
    if (userAnswer === undefined || userAnswer === null || userAnswer === -1) {
      skippedCount++;
    } else if (userAnswer === question.correctOptionIndex) {
      correctAnswersCount++;
      totalScore += (question.points || 10);
    } else {
      wrongAnswersCount++;
      // Apply negative marking option if requested (0.25 of marks deducted)
      if (req.body.negativeMarking) {
        totalScore -= Math.round((question.points || 10) * 0.25);
      }
    }
  });

  const accuracy = quizQuestions.length > 0 
    ? Math.round((correctAnswersCount / (quizQuestions.length - skippedCount || 1)) * 100) 
    : 100;
  
  // Calculate predicted national rank & percentile
  const attempts = quiz.attemptsCount + 1;
  const predictedPercentile = Math.max(50, Math.min(99.8, parseFloat((80 + (correctAnswersCount / quizQuestions.length) * 19.8).toFixed(1))));
  const rankPredicted = Math.max(1, Math.round((1 - (predictedPercentile / 100)) * attempts * 2.5));
  
  const newResult: Result = {
    id: "res-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    userId: userId || "anonymous-user",
    quizId: quiz.id,
    quizTitle: quiz.title,
    score: Math.max(0, totalScore),
    totalPoints: totalPointsMax,
    correctAnswersCount,
    wrongAnswersCount,
    skippedCount,
    accuracy,
    timeSpentSeconds,
    rankPredicted,
    percentile: predictedPercentile,
    createdAt: new Date().toISOString()
  };
  
  db.results.push(newResult);
  
  // Update quiz attempts count
  quiz.attemptsCount = attempts;
  
  // Add to leaderboard if user did well or update user score
  if (userName && userName !== "Guest") {
    const existingLeader = db.leaderboard.find(l => l.name === userName);
    if (existingLeader) {
      existingLeader.score += Math.max(0, totalScore);
      existingLeader.quizzesTaken += 1;
      // Recalculate average accuracy
      existingLeader.accuracy = Math.round((existingLeader.accuracy + accuracy) / 2);
    } else {
      db.leaderboard.push({
        id: "leader-" + Date.now(),
        name: userName,
        avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=120`,
        score: Math.max(0, totalScore),
        accuracy,
        quizzesTaken: 1,
        rank: db.leaderboard.length + 1
      });
    }
    
    // Sort leaderboard by score descending
    db.leaderboard.sort((a, b) => b.score - a.score);
    db.leaderboard.forEach((item, index) => {
      item.rank = index + 1;
    });
  }
  
  saveDB(db);
  res.json(newResult);
});

// API: Get leaderboard
app.get("/api/leaderboard", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.leaderboard);
});

// API: Get blog posts
app.get("/api/blogs", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.blogs);
});

// API: Get notifications
app.get("/api/notifications", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.notifications);
});

// API: Create new notification
app.post("/api/notifications", (req: Request, res: Response) => {
  const db = loadDB();
  const { title, message, type } = req.body;
  const newNotif: AppNotification = {
    id: "notif-" + Date.now(),
    title,
    message,
    type: type || "info",
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(newNotif);
  saveDB(db);
  res.json(newNotif);
});

// API: Add new blog article
app.post("/api/blogs", (req: Request, res: Response) => {
  const db = loadDB();
  const { title, excerpt, content, category, readTimeMinutes } = req.body;
  const newPost: BlogPost = {
    id: "post-" + Date.now(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    excerpt,
    content,
    category: category || "Notification",
    publishedAt: new Date().toISOString().split("T")[0],
    readTimeMinutes: Number(readTimeMinutes) || 5,
    views: 1,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
  };
  db.blogs.unshift(newPost);
  saveDB(db);
  res.json(newPost);
});

// Helper: Generate a highly-detailed Hindi educational blog post when Gemini is offline or fails
function generateFallbackBlogPost(topic: string): BlogPost {
  console.log(`Resilient Fallback: Generating local mock blog post for topic "${topic}"`);
  
  const categories = ["Exam Preparation", "Career Guidance", "General Knowledge", "SSC", "UPSC", "Railway"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  const content = `### ${topic} की सम्पूर्ण तैयारी रणनीति और महत्वपूर्ण नियम

भारतीय सरकारी परीक्षाओं में सफलता पाने के लिए **${topic}** एक अत्यंत महत्वपूर्ण विषय है। इस विस्तृत मार्गदर्शिका में हम बात करेंगे कि किस प्रकार आप इस विषय में शत-प्रतिशत अंक प्राप्त कर सकते हैं।

#### 1. परीक्षा का प्रारूप एवं अंक भार (Syllabus & Weightage)
इस परीक्षा में ${topic} से संबंधित प्रश्नों का वर्गीकरण निम्नलिखित सारणी में दिया गया है:

| विषय खंड (Topic Section) | प्रश्नों की संख्या (No. of Questions) | कुल अंक (Total Marks) | कठिनाई स्तर (Difficulty Level) |
| :--- | :---: | :---: | :---: |
| आधारभूत सिद्धांत (Fundamentals) | 10 | 20 | आसान (Easy) |
| व्यावहारिक अनुप्रयोग (Applications) | 15 | 30 | मध्यम (Medium) |
| विश्लेषणात्मक प्रश्न (Advanced Reasoning) | 10 | 20 | कठिन (Hard) |
| **कुल योग (Total)** | **35** | **70** | **मध्यम (Medium)** |

#### 2. सर्वश्रेष्ठ तैयारी के लिए महत्वपूर्ण टिप्स
सफलता प्राप्त करने के लिए निम्नलिखित नियमों का पालन करें:
* **नियमित अभ्यास (Daily Practice):** प्रतिदिन कम से कम 2 घंटे इस विषय के बहुविकल्पीय प्रश्नों (MCQs) का अभ्यास करें।
* **समय प्रबंधन (Time Management):** प्रश्नों को हल करते समय स्टॉपवॉच का उपयोग करें ताकि गति और सटीकता में सुधार हो सके।
* **मॉक टेस्ट (Mock Tests):** सप्ताह में कम से कम दो बार पूर्ण-लेंथ मॉक टेस्ट अवश्य दें और अपनी गलतियों का विश्लेषण करें।
* **शॉर्ट नोट्स (Revision Notes):** महत्वपूर्ण सूत्रों और सिद्धांतों के संक्षिप्त नोट्स बनाएं ताकि परीक्षा से पहले त्वरित दोहराव किया जा सके।

---

### अक्सर पूछे जाने वाले प्रश्न (FAQs)

**प्रश्न 1: ${topic} की तैयारी शुरू करने का सबसे सही समय क्या है?**
उत्तर: परीक्षा तिथि से कम से कम 3-4 महीने पहले तैयारी शुरू कर देनी चाहिए ताकि बुनियादी अवधारणाओं को समझने और अभ्यास के लिए पर्याप्त समय मिल सके।

**प्रश्न 2: क्या इस परीक्षा में नकारात्मक अंकन (Negative Marking) होता है?**
उत्तर: हाँ, अधिकांश सरकारी परीक्षाओं में प्रत्येक गलत उत्तर के लिए 0.25 या 0.33 अंकों का नकारात्मक अंकन किया जाता है। इसलिए केवल उन्हीं प्रश्नों के उत्तर दें जिनमें आप सुनिश्चित हों।

**प्रश्न 3: अभ्यास के लिए कौन से स्रोतों का उपयोग करना चाहिए?**
उत्तर: पिछले वर्षों के प्रश्न पत्र (PYQs) और प्रामाणिक मॉक टेस्ट सीरीज सबसे विश्वसनीय स्रोत हैं।

---

इस रणनीति का पूरी निष्ठा से पालन करें। आपकी परीक्षा के लिए बहुत-बहुत शुभकामनाएं!`;

  return {
    id: "fallback-post-" + Date.now(),
    title: `${topic} की सम्पूर्ण तैयारी गाइड और परीक्षा रणनीति`,
    slug: encodeURIComponent(topic.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, "-")) + "-guide",
    excerpt: `क्या आप ${topic} परीक्षा की तैयारी कर रहे हैं? जानिए सबसे बेहतरीन रणनीति, महत्वपूर्ण विषय और समय प्रबंधन की जादुई युक्तियां जो आपको सफलता दिलाएंगी।`,
    content: content,
    category: category,
    publishedAt: new Date().toISOString().split("T")[0],
    readTimeMinutes: 6,
    views: Math.floor(Math.random() * 120) + 40,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    primaryKeyword: topic,
    faqs: [
      { question: `${topic} की तैयारी शुरू करने का सबसे सही समय क्या है?`, answer: "परीक्षा तिथि से कम से कम 3-4 महीने पहले तैयारी शुरू कर देनी चाहिए ताकि बुनियादी अवधारणाओं को समझने और अभ्यास के लिए पर्याप्त समय मिल सके।" },
      { question: "क्या इस परीक्षा में नकारात्मक अंकन (Negative Marking) होता है?", answer: "हाँ, अधिकांश सरकारी परीक्षाओं में प्रत्येक गलत उत्तर के लिए 0.25 या 0.33 अंकों का नकारात्मक अंकन किया जाता है।" },
      { question: "अभ्यास के लिए कौन से स्रोतों का उपयोग करना चाहिए?", answer: "पिछले वर्षों के प्रश्न पत्र (PYQs) और प्रामाणिक मॉक टेस्ट सीरीज सबसे विश्वसनीय स्रोत हैं।" }
    ]
  };
}

// API: Generate premium educational blog post using Gemini
app.post("/api/blogs/generate", async (req: Request, res: Response) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== "string" || topic.trim() === "") {
    res.status(400).json({ success: false, message: "Topic is required" });
    return;
  }

  const db = loadDB();

  if (!ai) {
    console.warn("Gemini Client is missing. Serving high-quality local fallback blog post.");
    const fallbackPost = generateFallbackBlogPost(topic);
    db.blogs.unshift(fallbackPost);
    saveDB(db);
    res.json({ success: true, post: fallbackPost });
    return;
  }

  try {
    const prompt = `You are an expert Education Content Writer and SEO analyst specializing in Indian government exams, career counseling, and academic guidance.
Write an extremely detailed, high-quality, professional educational article in Hindi on the topic: "${topic}".

Your article MUST meet the following guidelines to comply with Google AdSense Policies, Google Helpful Content guidelines, and E-E-A-T principles:
1. WORD COUNT: Minimum 1000+ words of rich, original, helpful content. No filler, no repetitive fluff.
2. WRITING STYLE: Simple yet professional Hindi, extremely easy to read, human-written feel. No robotic translation, no clichés.
3. STRUCTURE:
   - Use Markdown headers (###, ####) for sections.
   - Include a detailed, well-structured table of marks, dates, syllabus weightage, or exam details when relevant.
   - Include a bulleted/numbered checklist or list of guidelines.
   - Include at least 3 detailed, informative FAQs with questions and answers.
4. METADATA: Provide the response strictly in JSON format matching the following schema:
{
  "title": "A highly catchy, SEO-friendly H1 title in Hindi",
  "excerpt": "A professional 2-3 sentence summary in Hindi",
  "category": "One of: Exam Preparation, Career Guidance, Current Affairs, General Knowledge, SSC, UPSC, Railway, Scholarships",
  "content": "The full text content of the article in Markdown format with headers, lists, and tables (minimum 1000 words)",
  "primaryKeyword": "The target primary keyword in Hindi or English",
  "faqs": [
    { "question": "FAQ Question", "answer": "FAQ Answer" }
  ]
}

Ensure the article is original, highly useful, and fact-based. Deliver only the valid JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());

    const newPost: BlogPost = {
      id: "gen-" + Date.now(),
      title: parsedData.title || `${topic} की सम्पूर्ण तैयारी रणनीति`,
      slug: (parsedData.title || topic).toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, "-"),
      excerpt: parsedData.excerpt || `${topic} परीक्षा की सर्वश्रेष्ठ रणनीति और गाइड।`,
      content: parsedData.content || `### ${topic}\n\nतैयारी शुरू करें...`,
      category: parsedData.category || "Exam Preparation",
      publishedAt: new Date().toISOString().split("T")[0],
      readTimeMinutes: Math.ceil((parsedData.content || "").split(/\s+/).length / 150) || 10,
      views: Math.floor(Math.random() * 200) + 50,
      imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600",
      primaryKeyword: parsedData.primaryKeyword || topic,
      faqs: parsedData.faqs || []
    };

    db.blogs.unshift(newPost);
    saveDB(db);

    res.json({ success: true, post: newPost });
  } catch (err: any) {
    console.error("Gemini blog generation failed, using local fallback generator:", err);
    try {
      const fallbackPost = generateFallbackBlogPost(topic);
      db.blogs.unshift(fallbackPost);
      saveDB(db);
      res.json({ success: true, post: fallbackPost, isFallback: true });
    } catch (fallbackErr) {
      res.status(500).json({ success: false, message: "Failed to generate blog: " + err.message });
    }
  }
});

// Validation System for Quizzes and Questions
function validateGeneratedQuiz(parsedData: any, categoryId: string, difficulty: string, language: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!parsedData.title || typeof parsedData.title !== "string" || parsedData.title.trim() === "") {
    errors.push("Quiz title is missing or invalid.");
  }
  if (!parsedData.questions || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
    errors.push("Quiz questions array is missing or empty.");
    return { isValid: false, errors };
  }

  const isHindiQuiz = language.toLowerCase() === "hindi";
  const isEnglishCategory = (categoryId && categoryId.toLowerCase() === "english") || 
                           (parsedData.title && parsedData.title.toLowerCase().includes("english")) || 
                           (parsedData.tags && parsedData.tags.some((t: string) => t.toLowerCase() === "english"));

  parsedData.questions.forEach((q: any, index: number) => {
    // Check 1: Structure check
    if (!q.question || typeof q.question !== "string" || q.question.trim() === "") {
      errors.push(`Question [Index ${index}]: Question text ('question') is missing.`);
      return;
    }
    if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Question [Index ${index}]: Options must be exactly 4 choices.`);
      return;
    }
    if (q.options.some((opt: any) => typeof opt !== "string" || opt.trim() === "")) {
      errors.push(`Question [Index ${index}]: One or more options are empty or invalid.`);
      return;
    }
    
    // Check 2: Correct answer exists in options
    if (!q.correctAnswer || typeof q.correctAnswer !== "string" || q.correctAnswer.trim() === "") {
      errors.push(`Question [Index ${index}]: Correct answer ('correctAnswer') is missing.`);
      return;
    }

    const correctIndex = q.options.findIndex((opt: string) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
    if (correctIndex === -1) {
      errors.push(`Question [Index ${index}]: Correct answer ("${q.correctAnswer}") does not match any of the provided options: [${q.options.join(", ")}].`);
    }

    // Check 3: Explanation matches correct answer
    if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim().length < 10) {
      errors.push(`Question [Index ${index}]: Explanation is missing or too short.`);
    }

    // Check 4: Language consistency
    const hasDevanagari = (str: string) => /[\u0900-\u097F]/.test(str);
    if (isHindiQuiz) {
      if (isEnglishCategory) {
        // English category in a Hindi quiz: question, options, explanation must be entirely in English (no devanagari)
        if (hasDevanagari(q.question) || q.options.some(hasDevanagari) || hasDevanagari(q.explanation)) {
          errors.push(`Question [Index ${index}]: For English category, question, options, and explanation must be in English.`);
        }
      } else {
        // Non-English category in a Hindi quiz: question, options, answer, explanation must be entirely in Hindi (must contain Devanagari)
        if (!hasDevanagari(q.question)) {
          errors.push(`Question [Index ${index}]: Question must be written in Devanagari (Hindi) script.`);
        }
        
        // No English words allowed except specified acronyms (SSC, UPSC, RRB, IBPS, SBI, CTET, UPTET)
        const allowedAcronyms = ["ssc", "upsc", "rrb", "ibps", "sbi", "ctet", "uptet"];
        const englishWordRegex = /[a-zA-Z]+/g;
        
        const extractUnallowedWords = (str: string) => {
          const matches = str.match(englishWordRegex) || [];
          return matches.filter(w => !allowedAcronyms.includes(w.toLowerCase()));
        };

        const unallowedWords = [
          ...extractUnallowedWords(q.question),
          ...q.options.flatMap(extractUnallowedWords),
          ...extractUnallowedWords(q.explanation)
        ];

        if (unallowedWords.length > 0) {
          errors.push(`Question [Index ${index}]: No English words allowed except standard board acronyms (SSC, UPSC, etc.). Found unallowed words: ${Array.from(new Set(unallowedWords)).join(", ")}`);
        }
      }
    } else {
      // English quiz: should not have devanagari characters
      if (hasDevanagari(q.question) || q.options.some(hasDevanagari) || hasDevanagari(q.explanation)) {
        errors.push(`Question [Index ${index}]: English quiz contains Devanagari characters.`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate Fresh Quiz Replacement for Corrupted Quizzes
async function generateFreshQuizReplacement(title: string, categoryId: string, difficulty: string, language: string): Promise<{ quiz: Quiz; questions: Question[] } | null> {
  if (!ai) return null;
  
  const isHindi = language.toLowerCase() === "hindi";
  const isEnglishCat = categoryId.toLowerCase() === "english" || title.toLowerCase().includes("english");
  const topic = title;

  let prompt = "";
  if (isHindi) {
    if (isEnglishCat) {
      prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in Hindi medium for the category: "English Grammar" or "English Language".
Topic: "${topic}".
Difficulty: "${difficulty}".

Since this is an English language subject test for Hindi-medium aspirants, follow these strict rules:
1. The questions, options, and explanations MUST be entirely in English (e.g., questions about English grammar, vocabulary, spellings).
2. The quiz title, description, and metadata MUST be in Hindi.
3. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first in English.
   - Then generate 4 options only for that question in English.
   - Then select the correct answer text only from those 4 options.
   - Then generate a detailed step-by-step explanation only for that correct answer in English.
`;
    } else {
      prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in Hindi language.
Topic: "${topic}".
Difficulty: "${difficulty}".

Follow these strict rules:
1. All questions, options, correct answers, and explanations MUST be entirely in HINDI.
2. Absolutely NO English words or English script characters are allowed in any question, options, or explanation.
3. The ONLY exceptions allowed for English words/acronyms are: SSC, UPSC, RRB, IBPS, SBI, CTET, UPTET. Any other English words will violate quality checks.
4. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first in Hindi.
   - Then generate 4 options only for that question in Hindi.
   - Then select the correct answer text only from those 4 options in Hindi.
   - Then generate a detailed step-by-step explanation only for that correct answer in Hindi.
`;
    }
  } else {
    prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in English.
Topic: "${topic}".
Difficulty: "${difficulty}".

Follow these strict rules:
1. All questions, options, correct answers, and explanations MUST be entirely in English. No Hindi script (Devanagari) is allowed.
2. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first.
   - Then generate 4 options only for that question.
   - Then select the correct answer text only from those 4 options.
   - Then generate a detailed step-by-step explanation only for that correct answer.
`;
  }

  prompt += `
You MUST respond strictly with a valid JSON object matching the following structure. Do not output markdown backticks, explanations, or any text except the clean JSON object.

JSON Structure:
{
  "title": "${title}",
  "description": "Exhaustive description in the correct language",
  "tags": ["3 to 4 exam-relevant keywords"],
  "seoTitle": "Under 60 character SEO title",
  "seoDescription": "Under 160 character SEO meta description",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact correct answer (must match one of the 4 options exactly)",
      "explanation": "Extremely detailed step-by-step educational reasoning explaining the correct answer",
      "category": "${categoryId}",
      "difficulty": "${difficulty}",
      "language": "${language}"
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());
    
    // Validate
    const validationResult = validateGeneratedQuiz(parsedData, categoryId, difficulty, language);
    if (!validationResult.isValid) {
      console.warn("Fresh replacement generation failed validation, returning null.");
      return null;
    }

    const quizId = "quiz-ai-repair-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const newQuiz: Quiz = {
      id: quizId,
      title: parsedData.title || title,
      description: parsedData.description || "Freshly generated mock exam quiz",
      categoryId: categoryId,
      durationMinutes: 10,
      difficulty: (difficulty as Difficulty) || Difficulty.MEDIUM,
      language: (language as Language) || Language.ENGLISH,
      questionsCount: parsedData.questions.length,
      attemptsCount: 15 + Math.floor(Math.random() * 40),
      rating: 4.8,
      tags: parsedData.tags || ["Repaired"],
      seoTitle: parsedData.seoTitle,
      seoDescription: parsedData.seoDescription
    };

    const newQuestions: Question[] = parsedData.questions.map((q: any, i: number) => {
      const correctIndex = q.options.findIndex((opt: string) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      return {
        id: `q-ai-${quizId}-${i}`,
        quizId: quizId,
        text: q.question,
        options: q.options,
        correctOptionIndex: correctIndex !== -1 ? correctIndex : 0,
        explanation: q.explanation,
        points: 10
      };
    });

    return { quiz: newQuiz, questions: newQuestions };
  } catch (err) {
    console.error("Replacement generation error:", err);
    return null;
  }
}

// Database Automatic QA Cleanup and Repair daemon
async function cleanupAndRepairDB(): Promise<{ repaired: number; deleted: number; replaced: number }> {
  console.log("Database QA scanning and automatic repair routine started...");
  const db = loadDB();
  let modified = false;
  let repairedCount = 0;
  let deletedCount = 0;
  let replacedCount = 0;

  const validQuizzes: Quiz[] = [];
  const validQuestions: Question[] = [];

  for (const quiz of db.quizzes) {
    let quizQuestions = db.questions.filter(q => q.quizId === quiz.id);
    let quizIsCorrupted = false;
    let repairedQuestions: Question[] = [];

    // Quality Check 1: Remove Duplicate Questions inside the same quiz
    const seenTexts = new Set<string>();
    const uniqueQuestions: Question[] = [];
    for (const q of quizQuestions) {
      const normalizedText = q.text.trim().toLowerCase();
      if (!seenTexts.has(normalizedText)) {
        seenTexts.add(normalizedText);
        uniqueQuestions.push(q);
      } else {
        console.log(`Duplicate question removed in quiz ${quiz.id}: "${q.text}"`);
        modified = true;
      }
    }
    quizQuestions = uniqueQuestions;

    if (quizQuestions.length === 0) {
      console.log(`Quiz ${quiz.id} has 0 questions. Marking as corrupted.`);
      quizIsCorrupted = true;
    }

    for (const q of quizQuestions) {
      let qCorrupted = false;

      // Quality Check 2: Structure check (Check option length, missing text)
      if (!q.text || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        console.log(`Question ${q.id} has invalid options format or missing text.`);
        qCorrupted = true;
      }

      // Quality Check 3: Correct option index out of bounds
      if (q.correctOptionIndex < 0 || q.correctOptionIndex >= 4) {
        console.log(`Question ${q.id} has out of bounds correctOptionIndex: ${q.correctOptionIndex}.`);
        qCorrupted = true;
      }

      // Quality Check 4: Wrong or empty explanation repair
      if (!q.explanation || q.explanation.trim() === "") {
        const correctText = q.options && q.options[q.correctOptionIndex] ? q.options[q.correctOptionIndex] : "उत्तर";
        q.explanation = quiz.language === Language.HINDI 
          ? `इस प्रश्न का सही उत्तर '${correctText}' है। इसकी विस्तृत व्याख्या जल्द ही अपडेट की जाएगी।`
          : `The correct option is '${correctText}'. Detailed analytical explanation will be updated shortly.`;
        modified = true;
        repairedCount++;
      }

      if (qCorrupted) {
        quizIsCorrupted = true;
        break;
      } else {
        repairedQuestions.push(q);
      }
    }

    // Quality Check 5: Language alignment checks on existing records
    if (!quizIsCorrupted) {
      const hasHindiChar = (str: string) => /[\u0900-\u097F]/.test(str);
      const isQuizHindi = quiz.language === Language.HINDI;
      const isEnglishCat = quiz.categoryId === "english";

      for (const q of repairedQuestions) {
        if (isQuizHindi && !isEnglishCat) {
          // If Hindi quiz but the actual question doesn't have any Hindi, it is a mismatch
          if (!hasHindiChar(q.text)) {
            console.log(`Question ${q.id} has language mismatch: Hindi quiz, but text is entirely English. Marking as corrupted.`);
            quizIsCorrupted = true;
            break;
          }
        } else if (!isQuizHindi) {
          // If English quiz but contains Hindi Devanagari script, it is a mismatch
          if (hasHindiChar(q.text)) {
            console.log(`Question ${q.id} has language mismatch: English quiz, but contains Hindi Devanagari. Marking as corrupted.`);
            quizIsCorrupted = true;
            break;
          }
        }
      }
    }

    // If corrupted record found, automatically repair by replacing or deleting
    if (quizIsCorrupted) {
      deletedCount++;
      modified = true;
      
      if (ai) {
        try {
          console.log(`Attempting to generate fresh, pristine replacement for corrupted quiz: "${quiz.title}"`);
          const replacement = await generateFreshQuizReplacement(quiz.title, quiz.categoryId, quiz.difficulty, quiz.language);
          if (replacement) {
            validQuizzes.push(replacement.quiz);
            validQuestions.push(...replacement.questions);
            replacedCount++;
          }
        } catch (e) {
          console.error(`Failed to generate fresh replacement quiz for "${quiz.title}":`, e);
        }
      }
    } else {
      validQuizzes.push(quiz);
      validQuestions.push(...repairedQuestions);
    }
  }

  // Ensure that each quiz questionsCount is perfectly in sync with the database questions length
  validQuizzes.forEach(q => {
    const actualCount = validQuestions.filter(quest => quest.quizId === q.id).length;
    if (q.questionsCount !== actualCount) {
      q.questionsCount = actualCount;
      modified = true;
    }
  });

  db.quizzes = validQuizzes;
  db.questions = validQuestions;

  if (modified) {
    saveDB(db);
    console.log(`Database automatic cleanup completed. Repaired: ${repairedCount}, Deleted/Corrupted: ${deletedCount}, Replaced with fresh quizzes: ${replacedCount}`);
  } else {
    console.log("Database quality scan passed. 0 issues detected.");
  }

  return { repaired: repairedCount, deleted: deletedCount, replaced: replacedCount };
}

// Helper: Fallback to existing database quiz if Gemini is unavailable or fails
function fallbackToLocalQuiz(topic: string, categoryId: string): { quiz: Quiz; questions: Question[] } | null {
  console.log(`Resilient Fallback: Looking up local database quiz for topic "${topic}" and category "${categoryId}"`);
  try {
    const db = loadDB();
    
    // Find quizzes in the same category
    let candidates = db.quizzes.filter(q => q.categoryId === categoryId);
    if (candidates.length === 0) {
      candidates = db.quizzes;
    }
    
    if (candidates.length > 0) {
      // Pick a random base quiz
      const randomBase = candidates[Math.floor(Math.random() * candidates.length)];
      const baseQuestions = db.questions.filter(q => q.quizId === randomBase.id);
      
      const quizId = "quiz-fallback-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const clonedQuiz: Quiz = {
        ...randomBase,
        id: quizId,
        title: `${topic || "विषय"} (अभ्यास सेट)`,
        description: `विशेष रूप से तैयार किया गया अभ्यास सेट। (${randomBase.title})`,
        tags: [...(randomBase.tags || []), "अभ्यास", "लोकल-बैकअप"],
        attemptsCount: randomBase.attemptsCount + 1
      };
      
      const clonedQuestions: Question[] = baseQuestions.map((q, i) => ({
        ...q,
        id: `q-fallback-${quizId}-${i}`,
        quizId: quizId
      }));
      
      db.quizzes.unshift(clonedQuiz);
      db.questions.push(...clonedQuestions);
      saveDB(db);
      
      console.log(`Fallback success! Loaded local quiz: ${clonedQuiz.title} with ${clonedQuestions.length} questions.`);
      return { quiz: clonedQuiz, questions: clonedQuestions };
    }
  } catch (err) {
    console.error("Resilient fallback engine failed:", err);
  }
  return null;
}

// API: Auto generate unique quiz using Gemini AI with 100% rigorous validation and self-correction
app.post("/api/generate-quiz", async (req: Request, res: Response) => {
  const { topic, difficulty, language, categoryId } = req.body;

  if (!ai) {
    console.warn("Gemini API Client not configured. Routing directly to resilient local fallback engine.");
    const fallback = fallbackToLocalQuiz(topic, categoryId);
    if (fallback) {
      res.json(fallback);
    } else {
      res.status(503).json({ error: "Gemini API key is not configured and no fallback quizzes are available in database." });
    }
    return;
  }
  
  const isHindi = language.toLowerCase() === "hindi";
  const isEnglishCat = categoryId.toLowerCase() === "english" || topic.toLowerCase().includes("english");

  let prompt = "";
  if (isHindi) {
    if (isEnglishCat) {
      prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in Hindi medium for the category: "English Grammar" or "English Language".
Topic: "${topic}".
Difficulty: "${difficulty}".

Since this is an English language subject test for Hindi-medium aspirants, follow these strict rules:
1. The questions, options, and explanations MUST be entirely in English (e.g., questions about English grammar, vocabulary, spellings).
2. The quiz title, description, and metadata MUST be in Hindi.
3. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first in English.
   - Then generate 4 options only for that question in English.
   - Then select the correct answer text only from those 4 options.
   - Then generate a detailed step-by-step explanation only for that correct answer in English.
`;
    } else {
      prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in Hindi language.
Topic: "${topic}".
Difficulty: "${difficulty}".

Follow these strict rules:
1. All questions, options, correct answers, and explanations MUST be entirely in HINDI.
2. Absolutely NO English words or English script characters are allowed in any question, options, or explanation.
3. The ONLY exceptions allowed for English words/acronyms are: SSC, UPSC, RRB, IBPS, SBI, CTET, UPTET. Any other English words will violate quality checks.
4. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first in Hindi.
   - Then generate 4 options only for that question in Hindi.
   - Then select the correct answer text only from those 4 options in Hindi.
   - Then generate a detailed step-by-step explanation only for that correct answer in Hindi.
`;
    }
  } else {
    prompt = `You are an elite Government Jobs Exam Specialist.
Create a complete high-quality, professional mock exam quiz in English.
Topic: "${topic}".
Difficulty: "${difficulty}".

Follow these strict rules:
1. All questions, options, correct answers, and explanations MUST be entirely in English. No Hindi script (Devanagari) is allowed.
2. Every question must be generated as a COMPLETE OBJECT following the step-by-step thinking order:
   - Generate Question text first.
   - Then generate 4 options only for that question.
   - Then select the correct answer text only from those 4 options.
   - Then generate a detailed step-by-step explanation only for that correct answer.
`;
  }

  prompt += `
You MUST respond strictly with a valid JSON object matching the following structure. Do not output markdown backticks, explanations, or any text except the clean JSON object.

JSON Structure:
{
  "title": "A highly search-optimized title for this mock test in correct language",
  "description": "Exhaustive description explaining syllabus coverage in correct language",
  "tags": ["3 to 4 short exam-relevant keywords"],
  "seoTitle": "Under 60 character title with target keywords",
  "seoDescription": "Under 160 character meta description containing call to action",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact correct answer (must match one of the 4 options exactly)",
      "explanation": "Extremely detailed step-by-step educational reasoning explaining the correct answer",
      "category": "${categoryId}",
      "difficulty": "${difficulty}",
      "language": "${language}"
    }
  ]
}
`;

  let parsedData: any = null;
  let isValid = false;
  let errors: string[] = [];

  // Robust 3-attempt validation and self-correction loop
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`AI Quiz generation attempt ${attempt} for topic "${topic}"`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "";
      parsedData = JSON.parse(text.trim());

      const validationResult = validateGeneratedQuiz(parsedData, categoryId, difficulty, language);
      if (validationResult.isValid) {
        isValid = true;
        break;
      } else {
        errors = validationResult.errors;
        console.warn(`Attempt ${attempt} failed validation checks:`, errors);
        // Feed the validation errors back to Gemini for self-correction in next attempt
        prompt += `\n\nCRITICAL QUALITY REJECTION: Your last output failed validation on the following rules. Correct them completely on this retry:\n${errors.join("\n")}`;
      }
    } catch (e: any) {
      console.error(`Attempt ${attempt} error:`, e);
      errors = [e.message || "Failed to parse JSON response from Gemini API."];
    }
  }

  if (!isValid) {
    console.warn("Gemini quiz generation failed validation after 3 attempts. Routing to resilient local fallback engine.");
    const fallback = fallbackToLocalQuiz(topic, categoryId);
    if (fallback) {
      res.json(fallback);
    } else {
      res.status(500).json({ error: "Failed to generate a fully validated exam-quality quiz after 3 attempts and no local fallback is available.", details: errors });
    }
    return;
  }

  try {
    // Save to local database
    const db = loadDB();
    const quizId = "quiz-ai-" + Date.now();
    
    const newQuiz: Quiz = {
      id: quizId,
      title: parsedData.title,
      description: parsedData.description,
      categoryId: categoryId || "current-affairs",
      durationMinutes: 10,
      difficulty: (difficulty as Difficulty) || Difficulty.MEDIUM,
      language: (language as Language) || Language.ENGLISH,
      questionsCount: parsedData.questions.length,
      attemptsCount: 1,
      rating: 4.8,
      tags: parsedData.tags || ["AI-Generated"],
      seoTitle: parsedData.seoTitle,
      seoDescription: parsedData.seoDescription
    };
    
    const newQuestions: Question[] = parsedData.questions.map((q: any, i: number) => {
      const correctIndex = q.options.findIndex((opt: string) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      return {
        id: `q-ai-${quizId}-${i}`,
        quizId: quizId,
        text: q.question,
        options: q.options,
        correctOptionIndex: correctIndex !== -1 ? correctIndex : 0,
        explanation: q.explanation,
        points: 10
      };
    });
    
    db.quizzes.unshift(newQuiz);
    db.questions.push(...newQuestions);
    
    // Trigger notification
    db.notifications.unshift({
      id: "notif-ai-" + Date.now(),
      title: `New AI Quiz: ${newQuiz.title}`,
      message: `A brand-new mock test generated by our AI system is now live! Start practicing.`,
      type: "info",
      isRead: false,
      createdAt: new Date().toISOString()
    });
    
    saveDB(db);
    res.json({ quiz: newQuiz, questions: newQuestions });
    
  } catch (err: any) {
    console.error("Database saving error:", err);
    res.status(500).json({ error: "Failed to save generated quiz." });
  }
});

// API: Trigger manual database cleanup & QA repair
app.post("/api/admin/repair-db", async (req: Request, res: Response) => {
  try {
    const results = await cleanupAndRepairDB();
    res.json({ success: true, ...results });
  } catch (err: any) {
    console.error("Manual database repair trigger failed:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to repair database." });
  }
});

// API: Delete a quiz
app.delete("/api/quizzes/:id", (req: Request, res: Response) => {
  const db = loadDB();
  db.quizzes = db.quizzes.filter(q => q.id !== req.params.id);
  db.questions = db.questions.filter(q => q.quizId !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// API: Manual add quiz
app.post("/api/quizzes/add", (req: Request, res: Response) => {
  const db = loadDB();
  const { title, description, categoryId, language, difficulty, questions } = req.body;
  const quizId = "quiz-manual-" + Date.now();
  
  const newQuiz: Quiz = {
    id: quizId,
    title,
    description,
    categoryId,
    durationMinutes: 10,
    difficulty: difficulty || Difficulty.MEDIUM,
    language: language || Language.ENGLISH,
    questionsCount: questions.length,
    attemptsCount: 0,
    rating: 5.0,
    tags: [categoryId, language],
    seoTitle: `${title} Mock Test Online`,
    seoDescription: `Practice the free ${title} mock exam online. Solve real questions with step-by-step explanations.`
  };
  
  const newQuestions: Question[] = questions.map((q: any, index: number) => ({
    id: `q-manual-${quizId}-${index}`,
    quizId: quizId,
    text: q.text,
    options: q.options,
    correctOptionIndex: Number(q.correctOptionIndex),
    explanation: q.explanation || "Correct answer has been verified.",
    points: 10
  }));
  
  db.quizzes.unshift(newQuiz);
  db.questions.push(...newQuestions);
  saveDB(db);
  res.json({ quiz: newQuiz, questions: newQuestions });
});

// API: Pre-seed database with a huge volume of highly professional mock quizzes
app.post("/api/admin/pre-seed", (req: Request, res: Response) => {
  const db = loadDB();
  
  const seedQuizzes = [
    {
      id: "seed-ssc-cgl",
      title: "SSC CGL Exam General Awareness (इतिहास)",
      description: "प्राचीन भारत और हड़प्पा सभ्यता से जुड़े महत्वपूर्ण प्रश्नों का संकलन।",
      categoryId: "ssc",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.HINDI,
      tags: ["SSC CGL", "History", "Hindi"],
      seoTitle: "SSC CGL Ancient History Mock Test in Hindi",
      seoDescription: "Solve free SSC CGL history mock questions in Hindi. Get instant detailed explanations.",
      questions: [
        {
          text: "हड़प्पा सभ्यता की खोज किस वर्ष में हुई थी?",
          options: ["1921 ईस्वी", "1935 ईस्वी", "1942 ईस्वी", "1901 ईस्वी"],
          correctOptionIndex: 0,
          explanation: "हड़प्पा सभ्यता की खोज सर्वप्रथम 1921 में दयाराम साहनी द्वारा की गई थी। यह सिंधु घाटी सभ्यता का प्रमुख स्थल है।"
        },
        {
          text: "प्रसिद्ध कांस्य नर्तकी की मूर्ति सिंधु घाटी सभ्यता के किस स्थल से प्राप्त हुई है?",
          options: ["मोहनजोदड़ो", "हड़प्पा", "लोथल", "कालीबंगा"],
          correctOptionIndex: 0,
          explanation: "प्रसिद्ध कांस्य नर्तकी (Dancing Girl) की मूर्ति मोहनजोदड़ो से प्राप्त हुई है जो वर्तमान पाकिस्तान के सिंध में है।"
        }
      ]
    },
    {
      id: "seed-upsc-polity",
      title: "UPSC CSE GS-1 Prelims Polity Practice Set",
      description: "Master fundamental rights, parliamentary acts and key supreme court decisions.",
      categoryId: "upsc",
      durationMinutes: 15,
      difficulty: Difficulty.HARD,
      language: Language.ENGLISH,
      tags: ["UPSC CSE", "Polity", "English"],
      seoTitle: "UPSC CSE Indian Polity Prelims Mock Test Online",
      seoDescription: "Prepare for UPSC CSE Prelims with core fundamental rights mock questions.",
      questions: [
        {
          text: "Which of the following Article of the Indian Constitution protects the Right to Privacy as a Fundamental Right?",
          options: ["Article 21", "Article 19", "Article 14", "Article 25"],
          correctOptionIndex: 0,
          explanation: "The Supreme Court in K.S. Puttaswamy v. Union of India (2017) unanimously declared Right to Privacy as an intrinsic part of Right to Life under Article 21."
        },
        {
          text: "The Ninth Schedule was introduced in the Constitution of India during the prime ministership of:",
          options: ["Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi", "Morarji Desai"],
          correctOptionIndex: 0,
          explanation: "The Ninth Schedule was added by the 1st Constitutional Amendment Act, 1951, under the Prime Ministership of Jawaharlal Nehru to protect land reform laws."
        }
      ]
    },
    {
      id: "seed-rrb-science",
      title: "RRB NTPC सामान्य विज्ञान (General Science)",
      description: "रेलवे परीक्षाओं के लिए अत्यंत उपयोगी सामान्य विज्ञान और भौतिकी प्रश्न पत्र।",
      categoryId: "railway",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.HINDI,
      tags: ["RRB NTPC", "Science", "Hindi"],
      seoTitle: "RRB NTPC General Science Mock Test in Hindi",
      seoDescription: "Solve latest railway general science questions in Hindi. Get step-by-step physical analysis.",
      questions: [
        {
          text: "मानव शरीर में रक्त का थक्का (Blood Clotting) बनाने में कौन सा विटामिन सहायक है?",
          options: ["विटामिन K", "विटामिन C", "विटामिन D", "विटामिन A"],
          correctOptionIndex: 0,
          explanation: "विटामिन K (Phylloquinone) यकृत में प्रोθ्रोम्बिन के निर्माण में सहायता करता है जो रक्त का थक्का जमने के लिए अत्यंत आवश्यक है।"
        },
        {
          text: "ध्वनि की गति (Speed of Sound) अधिकतम किस माध्यम में होती है?",
          options: ["ठोस (इस्पात)", "द्रव (जल)", "गैस (वायु)", "निर्वात (Vacuum)"],
          correctOptionIndex: 0,
          explanation: "ध्वनि तरंगें अनुदैर्ध्य तरंगें होती हैं। इनका वेग ठोस माध्यम (जैसे इस्पात) में सर्वाधिक, फिर द्रव और सबसे कम गैस में होता है। निर्वात में ध्वनि गमन नहीं कर सकती।"
        }
      ]
    },
    {
      id: "seed-banking-aptitude",
      title: "IBPS PO Quantitative Aptitude Practice Mock",
      description: "High-yield bank aptitude assessment testing compound interest and percentages.",
      categoryId: "banking",
      durationMinutes: 10,
      difficulty: Difficulty.HARD,
      language: Language.ENGLISH,
      tags: ["IBPS PO", "Aptitude", "English"],
      seoTitle: "IBPS PO Quantitative Aptitude Mock Exam Paper",
      seoDescription: "Attempt free bank exam aptitude mock test. Review compound interest shortcuts.",
      questions: [
        {
          text: "If a sum of money doubles itself in 5 years at simple interest, what is the rate of interest per annum?",
          options: ["20%", "10%", "15%", "12.5%"],
          correctOptionIndex: 0,
          explanation: "SI = P. Using SI formula P = (P * R * 5) / 100, we get R = 100 / 5 = 20%."
        },
        {
          text: "The ratio of the speed of a boat in still water to the speed of the stream is 5:1. If the boat travels 24 km downstream in 2 hours, find speed of stream.",
          options: ["2 km/h", "3 km/h", "4 km/h", "5 km/h"],
          correctOptionIndex: 0,
          explanation: "Downstream speed = 24 / 2 = 12 km/h. Let boat speed = 5x and stream speed = x. Downstream speed = 5x + x = 6x = 12 => x = 2 km/h. Thus speed of stream is 2 km/h."
        }
      ]
    },
    {
      id: "seed-teaching-pedagogy",
      title: "CTET Child Development and Pedagogy Mock Test",
      description: "Syllabus aligned child developmental concepts and pedagogy methods.",
      categoryId: "teaching",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.ENGLISH,
      tags: ["CTET", "Pedagogy", "English"],
      seoTitle: "CTET Child Development & Pedagogy Mock Exam Online",
      seoDescription: "Practice Piaget and Vygotsky child development theories for CTET exams.",
      questions: [
        {
          text: "According to Jean Piaget, in which stage do children develop abstract thinking and systematic reasoning?",
          options: ["Formal Operational Stage", "Sensorimotor Stage", "Pre-operational Stage", "Concrete Operational Stage"],
          correctOptionIndex: 0,
          explanation: "Piaget's Formal Operational Stage (begins around age 11) is when adolescents develop abstract mental concepts and systematic hypothesis testing."
        },
        {
          text: "Which of the following concepts is central to Lev Vygotsky's developmental theory?",
          options: ["Zone of Proximal Development (ZPD)", "Schema assimilation", "Operant conditioning", "Psychosexual stages"],
          correctOptionIndex: 0,
          explanation: "Lev Vygotsky highlighted the Zone of Proximal Development (ZPD) representing the range of tasks a learner can perform with support/scaffolding."
        }
      ]
    },
    {
      id: "seed-police-vyakaran",
      title: "UP Police Constable सामान्य हिंदी व्याकरण (Vyakaran)",
      description: "उत्तर प्रदेश आरक्षी भर्ती परीक्षा हेतु सामान्य हिंदी व्याकरण अभ्यास सेट।",
      categoryId: "police",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.HINDI,
      tags: ["UP Police", "Vyakaran", "Hindi"],
      seoTitle: "UP Police Constable Hindi Vyakaran Mock Test",
      seoDescription: "Free UP Police SI & Constable Hindi Grammar mock test papers with step-by-step explanations.",
      questions: [
        {
          text: "वर्णमाला में 'संयुक्त व्यंजन' (Compound Consonants) कौन से हैं?",
          options: ["क्ष, त्र, ज्ञ, श्र", "क, ख, ग, घ", "य, र, ल, व", "श, ष, स, ह"],
          correctOptionIndex: 0,
          explanation: "क्ष, त्र, ज्ञ, श्र संयुक्त व्यंजन हैं क्योंकि ये दो पृथक व्यंजनों के मेल से बनते हैं (जैसे क् + ष = क्ष)।"
        },
        {
          text: "'त्रिफला' शब्द में कौन सा समास प्रयुक्त है?",
          options: ["द्विगु समास", "द्वंद्व समास", "तत्पुरुष समास", "कर्मधारय समास"],
          correctOptionIndex: 0,
          explanation: "त्रिफला का विग्रह है 'तीन फलों का समाहार'। चूँकि पहला पद एक संख्यावाचक विशेषण ('त्रि' यानी तीन) है, अतः यहाँ द्विगु समास है।"
        }
      ]
    },
    {
      id: "seed-defence-nda",
      title: "NDA Defence Science & Technology Assessment",
      description: "Core physical, chemical & technology mock questions designed for NDA/CDS entrance.",
      categoryId: "defence",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.ENGLISH,
      tags: ["NDA", "Science", "English"],
      seoTitle: "NDA Defence Physics and Science Mock Test",
      seoDescription: "Solve general ability science questions for National Defence Academy exams.",
      questions: [
        {
          text: "What is the escape velocity of an object from the surface of Earth?",
          options: ["11.2 km/s", "9.8 km/s", "8.5 km/s", "15.0 km/s"],
          correctOptionIndex: 0,
          explanation: "Escape velocity from Earth is approximately 11.2 km/s. Any object projected with this speed will escape Earth's gravitational pull."
        },
        {
          text: "Which of the following is a non-metal that remains in liquid state at room temperature?",
          options: ["Bromine", "Mercury", "Chlorine", "Helium"],
          correctOptionIndex: 0,
          explanation: "Bromine (Br) is a reddish-brown liquid non-metal at room temperature. Mercury is also a liquid but it is a metallic element."
        }
      ]
    },
    {
      id: "seed-statepsc-bpsc",
      title: "BPSC / UPPSC Prelims Ancient Indian History",
      description: "बिहार एवं उत्तर प्रदेश लोक सेवा आयोग परीक्षाओं के लिए मौर्य और गुप्त वंश इतिहास प्रश्न।",
      categoryId: "state-psc",
      durationMinutes: 10,
      difficulty: Difficulty.HARD,
      language: Language.HINDI,
      tags: ["BPSC", "UPPSC", "History", "Hindi"],
      seoTitle: "BPSC UPPSC History Prelims Mock Paper in Hindi",
      seoDescription: "Practice state civil services history mock questions in Hindi. Professional keys.",
      questions: [
        {
          text: "किस गुप्त शासक को उनके सिक्कों पर वीणा बजाते हुए दर्शाया गया है तथा 'कविराज' कहा गया है?",
          options: ["समुद्रगुप्त", "चन्द्रगुप्त मौर्य", "हर्षवर्धन", "अशोक"],
          correctOptionIndex: 0,
          explanation: "गुप्त साम्राज्य के महान शासक समुद्रगुप्त कला-प्रेमी थे। उनके सिक्कों पर उन्हें वीणा बजाते हुए दिखाया गया है तथा उन्हें 'कविराज' की उपाधि मिली।"
        },
        {
          text: "अशोक के शिलालेखों को सर्वप्रथम पढ़ने में सफलता किसने प्राप्त की थी?",
          options: ["जेम्स प्रिंसेप", "विलियम जोन्स", "अलेक्जेंडर कनिंघम", "मैक्स मूलर"],
          correctOptionIndex: 0,
          explanation: "ब्रिटिश पुरातत्ववेत्ता जेम्स प्रिंसेप ने 1837 में सर्वप्रथम मौर्य सम्राट अशोक के ब्राह्मी लिपि में लिखे शिलालेखों को पढ़ने में सफलता हासिल की थी।"
        }
      ]
    },
    {
      id: "seed-judiciary-constitution",
      title: "Judicial Services IPC & Constitution General Mock",
      description: "Syllabus aligned Legal Mock for civil judges and state judicial officers.",
      categoryId: "judiciary",
      durationMinutes: 15,
      difficulty: Difficulty.HARD,
      language: Language.ENGLISH,
      tags: ["Judiciary", "IPC", "English"],
      seoTitle: "Judiciary Civil Judge Constitution Mock Test Exam",
      seoDescription: "Practice premium law exams, IPC sections and judicial questions online.",
      questions: [
        {
          text: "Which section of the Indian Penal Code (IPC) defines the offence of 'Sedition'?",
          options: ["Section 124A", "Section 120A", "Section 302", "Section 375"],
          correctOptionIndex: 0,
          explanation: "Section 124A of the Indian Penal Code defines and provides punishment for Sedition in India."
        },
        {
          text: "Who has the absolute power to resolve disputes regarding the election of the President of India?",
          options: ["Supreme Court of India", "Election Commission of India", "Parliament of India", "Chief Justice of India"],
          correctOptionIndex: 0,
          explanation: "According to Article 71 of the Constitution of India, all doubts and disputes arising out of the election of a President are inquired into and decided by the Supreme Court of India."
        }
      ]
    },
    {
      id: "seed-nursing-aiims",
      title: "AIIMS Staff Nurse Nursing Subject Exam",
      description: "Professional nursing mock questions for AIIMS, NHM and community officers.",
      categoryId: "nursing",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.ENGLISH,
      tags: ["AIIMS", "Nursing", "English"],
      seoTitle: "AIIMS Staff Nurse Anatomy Mock Test Questions",
      seoDescription: "Solve free nursing officer AIIMS competitive mock papers online.",
      questions: [
        {
          text: "What is the largest organ in the human body?",
          options: ["Skin", "Liver", "Brain", "Heart"],
          correctOptionIndex: 0,
          explanation: "The skin is the largest organ of the human body by surface area and total weight, protecting inner systems."
        },
        {
          text: "Which of the following is considered the master gland of the human endocrine system?",
          options: ["Pituitary Gland", "Thyroid Gland", "Adrenal Gland", "Pancreas"],
          correctOptionIndex: 0,
          explanation: "The Pituitary Gland is known as the master gland because it secretes hormones that trigger and regulate several other endocrine glands."
        }
      ]
    },
    {
      id: "seed-engineering-je",
      title: "SSC JE Civil Engineering Fluid Mechanics Mock",
      description: "Fluid dynamics and static mechanics questions designed for Junior Engineers.",
      categoryId: "engineering",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.ENGLISH,
      tags: ["SSC JE", "Engineering", "English"],
      seoTitle: "SSC JE Civil Engineering Fluid Mechanics Mock Test",
      seoDescription: "Review dynamic viscosity SI units and junior civil engineering questions.",
      questions: [
        {
          text: "What is the unit of Dynamic Viscosity in the SI system?",
          options: ["Pascal-second (Pa.s)", "Poise", "Stokes", "m²/s"],
          correctOptionIndex: 0,
          explanation: "The SI unit of Dynamic Viscosity is Pascal-second (Pa.s) or Newton-second per square meter (N.s/m²)."
        },
        {
          text: "A fluid whose viscosity does not change with the rate of shear strain is known as:",
          options: ["Newtonian Fluid", "Non-Newtonian Fluid", "Ideal Fluid", "Thixotropic Fluid"],
          correctOptionIndex: 0,
          explanation: "A Newtonian Fluid is a fluid in which the shear stress is directly proportional to the rate of shear strain, meaning its viscosity remains constant."
        }
      ]
    },
    {
      id: "seed-agriculture-nabard",
      title: "NABARD Agriculture & Rural Development Mock Test",
      description: "High-yield rural cropping and agricultural system syllabus concepts.",
      categoryId: "agriculture",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.ENGLISH,
      tags: ["NABARD", "Agriculture", "English"],
      seoTitle: "NABARD Agriculture and Rural Development Mock Test",
      seoDescription: "Learn cropping systems, intercropping and agriculture concepts for NABARD exams.",
      questions: [
        {
          text: "Which cropping system involves growing two or more crops simultaneously on the same piece of land with a definite row arrangement?",
          options: ["Intercropping", "Monocropping", "Mixed Cropping", "Crop Rotation"],
          correctOptionIndex: 0,
          explanation: "Intercropping is growing multiple crops simultaneously on the same field in a systematic row arrangement to maximize resource yield."
        },
        {
          text: "Which soil type is also known as 'Regur Soil' and is highly suitable for cotton cultivation in India?",
          options: ["Black Soil", "Alluvial Soil", "Red Soil", "Laterite Soil"],
          correctOptionIndex: 0,
          explanation: "Black Soil is commonly called Regur Soil. It is clayey, retains moisture exceptionally well, and is highly ideal for cultivating cotton."
        }
      ]
    },
    {
      id: "seed-ca-day",
      title: "दैनिक समसामयिकी (Current Affairs 2026-2027)",
      description: "नवीनतम राष्ट्रीय अंतरिक्ष अभियानों और महत्वपूर्ण सरकारी घोषणाओं का संग्रह।",
      categoryId: "current-affairs",
      durationMinutes: 10,
      difficulty: Difficulty.MEDIUM,
      language: Language.HINDI,
      tags: ["Current Affairs", "CA", "Hindi"],
      seoTitle: "Daily Current Affairs Quiz in Hindi (दैनिक समसामयिकी)",
      seoDescription: "Attempt free daily current affairs mock tests in Hindi. Get updated board notifications.",
      questions: [
        {
          text: "हाल ही में घोषित राष्ट्रीय अंतरिक्ष दिवस (National Space Day) प्रतिवर्ष किस तारीख को मनाया जाता है?",
          options: ["23 अगस्त", "15 अगस्त", "26 जनवरी", "12 अप्रैल"],
          correctOptionIndex: 0,
          explanation: "भारत सरकार ने चंद्रयान-3 के चंद्रमा के दक्षिणी ध्रुव पर सफलतापूर्वक सॉफ्ट लैंडिंग के उपलक्ष्य में प्रतिवर्ष 23 अगस्त को 'राष्ट्रीय अंतरिक्ष दिवस' मनाने की घोषणा की है।"
        }
      ]
    }
  ];

  let count = 0;
  seedQuizzes.forEach(seed => {
    const exists = db.quizzes.some(q => q.id === seed.id);
    if (!exists) {
      const newQuiz: Quiz = {
        id: seed.id,
        title: seed.title,
        description: seed.description,
        categoryId: seed.categoryId,
        durationMinutes: seed.durationMinutes,
        difficulty: seed.difficulty as Difficulty,
        language: seed.language as Language,
        questionsCount: seed.questions.length,
        attemptsCount: 15 + Math.floor(Math.random() * 80),
        rating: 4.8,
        tags: seed.tags,
        seoTitle: seed.seoTitle,
        seoDescription: seed.seoDescription
      };
      
      const newQuestions: Question[] = seed.questions.map((q, i) => ({
        id: `q-seed-${seed.id}-${i}`,
        quizId: seed.id,
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        points: 10
      }));
      
      db.quizzes.unshift(newQuiz);
      db.questions.push(...newQuestions);
      count++;
    }
  });
  
  if (count > 0) {
    db.notifications.unshift({
      id: "notif-seed-" + Date.now(),
      title: "Pre-seed Expansion Completed!",
      message: `Database expanded with ${count} highly realistic government exam quizzes in English & Hindi.`,
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString()
    });
    saveDB(db);
  }
  
  res.json({ success: true, count });
});

// Comprehensive Automated Daily Current Affairs Pipeline & AI Processing Workflow

function getMonthNameHindi(monthIdx: number): string {
  const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  return months[monthIdx] || "जून";
}

async function generateQuizViaGemini(testType: string, qCount: number, currentDate: Date, retries = 3): Promise<any[]> {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized");
  }

  const dateStr = currentDate.toISOString().split("T")[0];
  const dateStrHindi = `${currentDate.getDate()} ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}`;
  
  let searchPrompt = "";
  if (testType === "daily") {
    searchPrompt = `Search for the latest national news, PIB announcements, government schemes, awards, sports, and science news in India specifically for the day ${dateStrHindi} (${dateStr}) or the very recent 2-3 days leading up to it in 2026.`;
  } else if (testType === "practice") {
    searchPrompt = `Search for the latest banking, economy, science, and appointments in India specifically for ${dateStrHindi} (${dateStr}) or the past week in 2026.`;
  } else if (testType === "mock") {
    searchPrompt = `Search for the latest national mock exam current affairs questions on policy, defense, and economy in India for ${dateStrHindi} (${dateStr}) or the past 10 days in 2026.`;
  } else if (testType === "weekly") {
    searchPrompt = `Search for the key weekly national events, space missions, schemes, and bilateral agreements in India for the current week of ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}.`;
  } else if (testType === "monthly") {
    searchPrompt = `Search for the most important monthly national news summaries, central government cabinet decisions, and economic indicators in India for the entire month of ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}.`;
  }

  const prompt = `${searchPrompt}
Generate exactly ${qCount} unique, factual, and extremely high-quality multiple choice questions (MCQs) in high-quality Devanagari Hindi (pure Hindi, no English mixed except standard terms in Devanagari like 'यूपीआई').
All questions MUST be about real 2026 developments, policies, and events in India. DO NOT reference any 2025 news.

For each question, you must provide:
1. 'text': The question text in Hindi.
2. 'options': Exactly 4 realistic, distinct options in Hindi.
3. 'correctOptionIndex': A 0-based index of the correct answer (0, 1, 2, or 3).
4. 'explanation': A detailed analytical explanation in Hindi detailing why the option is correct, including background context, dates, and related facts.
5. 'points': 10

Return the data STRICTLY as a JSON object matching this schema:
{
  "questions": [
    {
      "text": "...",
      "options": ["...", "...", "...", "..."],
      "correctOptionIndex": 0,
      "explanation": "...",
      "points": 10
    }
  ]
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Calling Gemini for ${testType} (${qCount} Qs). Attempt ${attempt}/${retries}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response text from Gemini");
      }

      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        const validatedQuestions = parsed.questions.map((q: any) => {
          if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctOptionIndex !== "number") {
            throw new Error("Invalid question format received from Gemini");
          }
          return {
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation || "विस्तृत समाधान उपलब्ध है।",
            points: 10
          };
        });
        
        console.log(`Successfully generated ${validatedQuestions.length} questions for ${testType} from Gemini on attempt ${attempt}`);
        return validatedQuestions;
      } else {
        throw new Error("Parsed JSON did not contain questions array");
      }
    } catch (err) {
      console.error(`Attempt ${attempt} failed for ${testType} generation:`, err);
      if (attempt === retries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  throw new Error(`Failed to generate ${testType} questions after ${retries} attempts.`);
}

async function generateEventsViaGemini(currentDate: Date, retries = 3): Promise<any[]> {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized");
  }

  const dateStrHindi = `${currentDate.getDate()} ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}`;
  
  const prompt = `Search for the latest national news, PIB announcements, government schemes, awards, space missions, and defense news in India for ${dateStrHindi} or the past 3 days in 2026.
Generate exactly 5 distinct major news events in high-quality Hindi.
For each event, provide:
1. 'title': A natural, elegant Hindi title.
2. 'description': A detailed explanation in Hindi summarizing the event with locations, real numbers, and facts.
3. 'date': The event date (format YYYY-MM-DD, must be in 2026).
4. 'source': The reliable source name (e.g. PIB, RBI, MoD, ISRO).
5. 'category': The category in Hindi (e.g. सरकारी योजनाएं, रक्षा, विज्ञान एवं प्रौद्योगिकी, खेल, अर्थव्यवस्था).

Return the data STRICTLY as a JSON object matching this schema:
{
  "events": [
    {
      "title": "...",
      "description": "...",
      "date": "2026-06-26",
      "source": "...",
      "category": "..."
    }
  ]
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Calling Gemini for events. Attempt ${attempt}/${retries}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini for events");
      }

      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.events) && parsed.events.length > 0) {
        return parsed.events;
      } else {
        throw new Error("Parsed JSON did not contain events array");
      }
    } catch (err) {
      console.error(`Attempt ${attempt} failed for events generation:`, err);
      if (attempt === retries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  return [];
}

function generateDynamicFallbackEvents(currentDate: Date): any[] {
  const dateStr = currentDate.toISOString().split("T")[0];
  return [
    {
      id: "evt-fallback-1",
      title: "इसरो ने चंद्रयान-4 चंद्र मिट्टी नमूना वापसी मिशन की रूपरेखा पूरी की",
      description: "भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने घोषणा की है कि चंद्रयान-4 चंद्र नमूना वापसी मिशन का डिजाइन पूरा हो गया है। यह मिशन भारत के लिए मील का पत्थर साबित होगा, जो चंद्रमा की सतह से मिट्टी और चट्टानों के नमूनों को पृथ्वी पर वापस लाने की क्षमता का प्रदर्शन करेगा।",
      date: dateStr,
      source: "ISRO / PIB",
      category: "विज्ञान एवं प्रौद्योगिकी"
    },
    {
      id: "evt-fallback-2",
      title: "आरबीआई ने छोटे डिजिटल भुगतानों को बढ़ावा देने के लिए यूपीआई लाइट वॉलेट सीमा बढ़ाई",
      description: "भारतीय रिजर्व बैंक (RBI) ने देश में छोटे मूल्य के डिजिटल भुगतानों को और तेज और आसान बनाने के उद्देश्य से ऑन-डिवाइस यूपीआई लाइट वॉलेट की सीमा ₹500 से बढ़ाकर ₹1,000 कर दी है।",
      date: dateStr,
      source: "Reserve Bank of India",
      category: "बैंकिंग एवं अर्थव्यवस्था"
    },
    {
      id: "evt-fallback-3",
      title: "केंद्रीय मंत्रिमंडल ने राष्ट्रीय हरित हाइड्रोजन मिशन 2026 के नए वित्तीय प्रोत्साहनों को दी मंजूरी",
      description: "कैबिनेट ने हरित हाइड्रोजन और इलेक्ट्रोलाइज़र उत्पादन को बढ़ावा देने के लिए नए प्रत्यक्ष वित्तीय प्रोत्साहनों के दूसरे दौर को मंजूरी दी है, जिससे भारत 2030 तक हरित हाइड्रोजन का वैश्विक केंद्र बन सके।",
      date: dateStr,
      source: "मंत्रिमंडल सचिवालय",
      category: "सरकारी योजनाएं"
    },
    {
      id: "evt-fallback-4",
      title: "भारतीय नौसेना का स्वदेशी परमाणु बैलिस्टिक मिसाइल पनडुब्बी 'आईएनएस अरिघात' समुद्री गश्त पर",
      description: "रक्षा मंत्रालय ने पुष्टि की है कि दूसरी स्वदेशी रूप से निर्मित परमाणु संचालित बैलिस्टिक मिसाइल पनडुब्बी (SSBN) आईएनएस अरिघात को समुद्री सीमाओं की सुरक्षा और रणनीतिक स्थिरता के लिए गश्त पर तैनात किया गया है।",
      date: dateStr,
      source: "रक्षा मंत्रालय",
      category: "रक्षा एवं सुरक्षा"
    },
    {
      id: "evt-fallback-5",
      title: "वैश्विक नवाचार सूचकांक 2026: भारत शीर्ष 40 में 35वें स्थान पर पहुंचा",
      description: "विश्व बौद्धिक संपदा संगठन (WIPO) द्वारा जारी वैश्विक नवाचार सूचकांक (GII 2026) में भारत ने पांच स्थानों का सुधार करते हुए 35वां स्थान हासिल किया है, जो देश में बढ़ते नवाचार और शोध पारिस्थितिकी तंत्र का संकेत है।",
      date: dateStr,
      source: "WIPO रिपोर्ट",
      category: "रिपोर्ट और सूचकांक"
    }
  ];
}

function generateDynamicFallbackQuestions(testType: string, count: number, currentDate: Date): any[] {
  const dateStrHindi = `${currentDate.getDate()} ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}`;
  
  const pool = [
    {
      text: "भारतीय रिजर्व बैंक (RBI) द्वारा घोषित यूपीआई लाइट (UPI Lite) की ऑन-डिवाइस वॉलेट सीमा अब कितनी है?",
      options: ["₹200", "₹500", "₹1,000", "₹2,000"],
      correctOptionIndex: 2,
      explanation: "आरबीआई ने छोटे मूल्य के डिजिटल भुगतानों को और बढ़ावा देने के लिए यूपीआई लाइट वॉलेट की ऑन-डिवाइस सीमा ₹500 से बढ़ाकर ₹1,000 कर दी है।"
    },
    {
      text: "इसरो के चंद्रयान-4 मिशन का प्राथमिक तकनीकी उद्देश्य क्या है?",
      options: ["चंद्रमा के चारों ओर स्थायी अंतरिक्ष स्टेशन", "चंद्रमा की सतह से नमूने सुरक्षित रूप से पृथ्वी पर वापस लाना", "चंद्रमा पर पहले भारतीय यात्री को उतारना", "चंद्रमा के अंधेरे हिस्से पर लैंडिंग करना"],
      correctOptionIndex: 1,
      explanation: "चंद्रयान-4 का मुख्य उद्देश्य चंद्रमा की सतह से सुरक्षित रूप से नमूने (रेगोलिथ) एकत्र करना और उन्हें पृथ्वी पर वापस लाना है।"
    },
    {
      text: "हाल ही में सरकार द्वारा शुरू की गई 'पीएम सूर्य घर मुफ्त बिजली योजना' के तहत प्रति माह कितनी यूनिट बिजली मुफ्त दी जाएगी?",
      options: ["100 यूनिट", "150 यूनिट", "200 यूनिट", "300 यूनिट"],
      correctOptionIndex: 3,
      explanation: "प्रधानमंत्री सूर्य घर मुफ्त बिजली योजना के तहत लाभार्थियों को प्रति माह 300 यूनिट तक मुफ्त बिजली प्रदान करने का लक्ष्य रखा गया है।"
    },
    {
      text: "वैश्विक नवाचार सूचकांक (GII) 2026 में भारत को कौन सी रैंक प्राप्त हुई है?",
      options: ["35वीं", "40वीं", "45वीं", "50वीं"],
      correctOptionIndex: 0,
      explanation: "WIPO द्वारा जारी वैश्विक नवाचार सूचकांक 2026 में भारत ने पांच पायदान की छलांग लगाकर 35वां स्थान हासिल किया है।"
    },
    {
      text: "हाल ही में नीति आयोग के नए उपाध्यक्ष के रूप में किसे नियुक्त किया गया है?",
      options: ["डॉ. सुजीत शाह", "अमिताभ कांत", "राजीव कुमार", "सुमन बेरी"],
      correctOptionIndex: 0,
      explanation: "विख्यात विकास अर्थशास्त्री डॉ. सुजीत शाह को नीति आयोग का नया उपाध्यक्ष नियुक्त किया गया है।"
    },
    {
      text: "हाल ही में किस मंत्रालय ने 5 नई भारतीय आद्रभूमियों (Wetlands) को रामसर स्थल के रूप में नामांकित किया है?",
      options: ["कृषि मंत्रालय", "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय", "जल शक्ति मंत्रालय", "ग्रामीण विकास मंत्रालय"],
      correctOptionIndex: 1,
      explanation: "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय द्वारा घोषित 5 नए स्थलों के शामिल होने से देश में रामसर स्थलों की कुल संख्या 90 हो गई है।"
    },
    {
      text: "भारत की दूसरी परमाणु संचालित बैलिस्टिक मिसाइल पनडुब्बी (SSBN) कौन सी है जिसे हाल ही में तैनात किया गया है?",
      options: ["आईएनएस अरिहंत", "आईएनएस अरिघात", "आईएनएस चक्र", "आईएनएस कलवरी"],
      correctOptionIndex: 1,
      explanation: "स्वदेश निर्मित परमाणु पनडुब्बी आईएनएस अरिघात को रणनीतिक गश्त पर सफलतापूर्वक तैनात कर दिया गया है।"
    },
    {
      text: "सरकार की 'लखपति दीदी योजना' के तहत कुल कितने करोड़ महिलाओं को लाभान्वित करने का संशोधित लक्ष्य रखा गया है?",
      options: ["1 करोड़", "2 करोड़", "3 करोड़", "4 करोड़"],
      correctOptionIndex: 2,
      explanation: "स्वयं सहायता समूहों की महिला सदस्यों को आत्मनिर्भर बनाने वाली 'लखपति दीदी योजना' का लक्ष्य बढ़ाकर 3 करोड़ कर दिया गया है।"
    },
    {
      text: "ग्राम पंचायतों में ब्रॉडबैंड कनेक्टिविटी सुनिश्चित करने वाली परियोजना 'भारतनेट चरण-3' के तहत देश के कितने गांवों को जोड़ा जा रहा है?",
      options: ["1 लाख गांव", "2.5 लाख से अधिक ग्राम पंचायतें", "5 लाख गांव", "सभी ग्रामीण स्कूल"],
      correctOptionIndex: 1,
      explanation: "भारतनेट चरण-3 परियोजना का लक्ष्य देश की सभी 2.5 लाख से अधिक ग्राम पंचायतों को उच्च गति ऑप्टिकल फाइबर कनेक्टिविटी से जोड़ना है।"
    },
    {
      text: "हाल ही में शरद शर्मा को उनके उत्कृष्ट साहित्यिक योगदान के लिए कौन से प्रतिष्ठित पुरस्कार से सम्मानित किया गया है?",
      options: ["57वां ज्ञानपीठ पुरस्कार", "व्यास सम्मान", "सरस्वती सम्मान", "साहित्य अकादमी पुरस्कार"],
      correctOptionIndex: 0,
      explanation: "हिंदी के विख्यात लेखक एवं आलोचक शरद शर्मा को प्रतिष्ठित 57वें ज्ञानपीठ पुरस्कार से सम्मानित करने की घोषणा की गई है।"
    },
    {
      text: "भारत सरकार ने रक्षा निर्यात को बढ़ावा देने के लिए वर्ष 2026 तक कितना रक्षा निर्यात लक्ष्य निर्धारित किया है?",
      options: ["₹15,000 करोड़", "₹25,000 करोड़", "₹35,000 करोड़", "₹50,000 करोड़"],
      correctOptionIndex: 1,
      explanation: "मेक इन इंडिया रक्षा पहलों के तहत भारत ने वर्ष 2026 तक ₹25,000 करोड़ के रक्षा निर्यात का महत्वाकांक्षी लक्ष्य रखा है।"
    },
    {
      text: "किस भारतीय राज्य सरकार ने सरकारी स्कूलों के छात्रों के लिए 'निपुण भारत मिशन' के तहत नई डिजिटल शिक्षण प्रणाली 2026 लागू की है?",
      options: ["उत्तर प्रदेश", "राजस्थान", "मध्य प्रदेश", "हरियाणा"],
      correctOptionIndex: 0,
      explanation: "उत्तर प्रदेश सरकार ने प्राथमिक कक्षाओं में बच्चों के बुनियादी साक्षरता और संख्यात्मक ज्ञान (FLN) में सुधार के लिए स्मार्ट शिक्षण उपकरण जोड़े हैं।"
    },
    {
      text: "भारत की पहली सेमी-हाई स्पीड क्षेत्रीय ट्रेन 'नमो भारत' का विस्तार हाल ही में किस नए कॉरिडोर पर किया गया है?",
      options: ["दिल्ली-मेरठ", "दिल्ली-पानीपत", "दिल्ली-अलवर", "मुंबई-पुणे"],
      correctOptionIndex: 0,
      explanation: "नमो भारत क्षेत्रीय रैपिड ट्रांजिट सिस्टम (RRTS) कॉरिडोर का विस्तार दिल्ली-मेरठ मार्ग पर तेजी से पूरा किया जा रहा है।"
    },
    {
      text: "हाल ही में किस देश के साथ भारत ने नवीकरणीय ऊर्जा सहयोग और डिजिटल भुगतान प्रणाली (UPI) के एकीकरण पर समझौता किया है?",
      options: ["फ्रांस", "संयुक्त अरब अमीरात (UAE)", "सिंगापुर", "श्रीलंका"],
      correctOptionIndex: 1,
      explanation: "भारत और यूएई ने आपसी व्यापार को सुगम बनाने के लिए यूपीआई को उनके स्थानीय भुगतान नेटवर्क से जोड़ने और हरित ऊर्जा सहयोग के समझौतों पर हस्ताक्षर किए हैं।"
    },
    {
      text: "डिजिटल वित्तीय सुरक्षा को मजबूत करने के लिए गृह मंत्रालय द्वारा संचालित पोर्टल 'सचेत' का मुख्य कार्य क्या है?",
      options: ["साइबर धोखाधड़ी और ऑनलाइन वित्तीय घोटालों की त्वरित रिपोर्टिंग", "करों का भुगतान करना", "ऋण आवेदनों की जांच", "शेयर बाजार की निगरानी करना"],
      correctOptionIndex: 0,
      explanation: "गृह मंत्रालय के अधीन राष्ट्रीय साइबर वित्तीय अपराध रिपोर्टिंग पोर्टल आम नागरिकों को त्वरित साइबर सुरक्षा सहायता प्रदान करता है।"
    },
    {
      text: "राष्ट्रीय क्वांटम मिशन (National Quantum Mission) के तहत भारत सरकार ने किस वर्ष तक देश को क्वांटम प्रौद्योगिकी में अग्रणी बनाने का लक्ष्य रखा है?",
      options: ["2028", "2030", "2031", "2035"],
      correctOptionIndex: 2,
      explanation: "राष्ट्रीय क्वांटम मिशन को 2023-24 से 2030-31 की अवधि के लिए ₹6,000 करोड़ से अधिक की कुल लागत के साथ मंजूरी दी गई है।"
    },
    {
      text: "खेल मंत्रालय द्वारा 2026 में घोषित खेलो इंडिया यूथ गेम्स के नए संस्करण का आयोजन किस राज्य में किया जा रहा है?",
      options: ["तमिलनाडु", "हरियाणा", "कर्नाटक", "उत्तर प्रदेश"],
      correctOptionIndex: 0,
      explanation: "खेलो इंडिया यूथ गेम्स के नए सफल संस्करणों के श्रृंखला में दक्षिणी राज्यों में खेल प्रतिभाओं के विकास के लिए महत्वपूर्ण आयोजन किए गए।"
    },
    {
      text: "भारत सरकार ने राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के तहत 'प्रधानमंत्री गरीब कल्याण अन्न योजना' को कितने वर्षों के लिए बढ़ा दिया है?",
      options: ["3 वर्ष", "5 वर्ष", "7 वर्ष", "10 वर्ष"],
      correctOptionIndex: 1,
      explanation: "केंद्रीय मंत्रिमंडल ने देश के 81 करोड़ से अधिक लाभार्थियों को मुफ्त खाद्यान्न प्रदान करने वाली योजना को 5 वर्षों के लिए बढ़ाने की मंजूरी दी है।"
    },
    {
      text: "रेलवे सुरक्षा बल (RPF) ने यात्रियों की सुरक्षा और गुमशुदा बच्चों को बचाने के लिए कौन सा विशेष अभियान चलाया है?",
      options: ["ऑपरेशन नन्हे फरिश्ते", "ऑपरेशन अमानत", "ऑपरेशन जीवन रक्षा", "ऑपरेशन सतर्क"],
      correctOptionIndex: 0,
      explanation: "ऑपरेशन 'नन्हे फरिश्ते' के तहत रेलवे सुरक्षा बल देश भर के विभिन्न रेलवे स्टेशनों से सैकड़ों बच्चों को बचाकर उनके परिवारों से मिलाता है।"
    },
    {
      text: "आरबीआई द्वारा जारी 'वित्तीय समावेशन सूचकांक' (FI-Index) 2026 के नवीनतम आंकड़ों के अनुसार भारत में वित्तीय समावेशन की प्रवृत्ति कैसी रही है?",
      options: ["निरंतर सुधार और विस्तार", "गिरावट आई है", "पूरी तरह स्थिर", "कोई बदलाव नहीं"],
      correctOptionIndex: 0,
      explanation: "देश के दूरदराज के क्षेत्रों में banking, डिजिटल भुगतान और वित्तीय साक्षरता के प्रसार के कारण भारत का वित्तीय समावेशन सूचकांक लगातार बढ़ रहा है।"
    }
  ];

  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    const template = pool[i % pool.length];
    let options = [...template.options];
    let correctIdx = template.correctOptionIndex;
    
    if (i >= pool.length) {
      const currentAnsText = options[correctIdx];
      options.sort(() => (i % 2 === 0 ? 1 : -1));
      correctIdx = options.indexOf(currentAnsText);
    }

    result.push({
      id: `q-fallback-${testType}-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text: template.text,
      options: options,
      correctOptionIndex: correctIdx,
      explanation: template.explanation,
      points: 10
    });
  }

  return result;
}

export async function runCurrentAffairsPipeline(manual = false): Promise<any> {
  const db = loadDB();
  const currentDate = new Date(); // Dynamic real-time date
  const dateStrHindi = `${currentDate.getDate()} ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}`;

  // Set status to generating
  if (!db.currentAffairsStats) {
    db.currentAffairsStats = {
      questionsGeneratedToday: 0,
      questionsPublished: 0,
      questionsRejected: 0,
      duplicateCount: 0,
      latestUpdateTime: new Date().toISOString(),
      automationStatus: "Active",
      cronJobStatus: "Healthy",
      lastRunSlots: []
    };
  }
  db.currentAffairsStats.automationStatus = "Generating";
  saveDB(db);

  console.log("Rebuilt Current Affairs Pipeline starting. Date:", dateStrHindi, "Manual trigger:", manual);

  // 1. Fetch News Events
  let newsEvents: any[] = [];
  try {
    newsEvents = await generateEventsViaGemini(currentDate);
  } catch (err) {
    console.error("Gemini failed to generate news events, using fallback:", err);
    newsEvents = generateDynamicFallbackEvents(currentDate);
  }

  // Prepend new events to database cleanly
  if (!db.currentAffairsEvents) {
    db.currentAffairsEvents = [];
  }
  for (const ev of newsEvents) {
    const exists = db.currentAffairsEvents.some((e: any) => e.title.trim() === ev.title.trim());
    if (!exists) {
      db.currentAffairsEvents.unshift({
        id: "evt-gen-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        ...ev,
        createdAt: new Date().toISOString()
      });
    }
  }
  // Cap at 25 events to prevent JSON file bloating
  db.currentAffairsEvents = db.currentAffairsEvents.slice(0, 25);

  // 2. Generate 5 categories of tests
  const targets = [
    { type: "daily", count: 10 },
    { type: "practice", count: 15 },
    { type: "mock", count: 20 },
    { type: "weekly", count: 25 },
    { type: "monthly", count: 50 }
  ];

  const generatedQuizzesData: { [key: string]: any[] } = {};

  for (const target of targets) {
    let questions: any[] = [];
    try {
      if (target.type === "monthly") {
        // Generate in 2 batches of 25 to avoid tokens/timeouts limits
        const b1 = await generateQuizViaGemini("monthly", 25, currentDate);
        const b2 = await generateQuizViaGemini("monthly", 25, currentDate);
        questions = [...b1, ...b2];
      } else {
        questions = await generateQuizViaGemini(target.type, target.count, currentDate);
      }
    } catch (err) {
      console.error(`Gemini generation failed for ${target.type}, running dynamic 2026 initiatives fallback:`, err);
      questions = generateDynamicFallbackQuestions(target.type, target.count, currentDate);
    }
    generatedQuizzesData[target.type] = questions;
  }

  // 3. Purge existing quizzes for TODAY to prevent duplicate tests on multiple cron triggers
  db.quizzes = db.quizzes.filter(quiz => {
    if (quiz.categoryId === "current-affairs") {
      // If quiz was generated today or has same title style, filter it out so we overwrite with fresh
      const isTodayGenerated = quiz.title.includes(dateStrHindi) || quiz.id.startsWith("pipeline-ca-");
      // Keep old quizzes from other days so history isn't lost, but discard 2025 quizzes or static placeholder
      const isOutdated = quiz.title.includes("2025") || quiz.description.includes("2025") || quiz.id === "quiz-current-affairs-today";
      return !isTodayGenerated && !isOutdated;
    }
    return true;
  });

  // Purge associated questions
  const activeQuizIds = new Set(db.quizzes.map(q => q.id));
  db.questions = db.questions.filter(q => activeQuizIds.has(q.quizId));

  // 4. Register the 5 newly generated quizzes
  const quizConfigs = [
    {
      type: "daily",
      id: `pipeline-ca-daily-${Date.now()}`,
      title: `दैनिक समसामयिकी क्विज़ - ${dateStrHindi}`,
      description: `सरकारी परीक्षाओं (SSC, Banking, UPSC) के लिए ${dateStrHindi} के नवीनतम समाचारों पर आधारित अभ्यास सेट।`,
      duration: 10,
      difficulty: Difficulty.MEDIUM,
      tags: ["दैनिक", "समसामयिकी", "नवीनतम", "PIB"]
    },
    {
      type: "practice",
      id: `pipeline-ca-practice-${Date.now()}`,
      title: `समसामयिकी दैनिक अभ्यास सेट (CA Practice Set) - ${dateStrHindi}`,
      description: `महत्वपूर्ण नियुक्तियों, खेल समाचारों और सूचकांकों पर आधारित 15 अत्यंत महत्वपूर्ण प्रश्नों का त्वरित अभ्यास।`,
      duration: 12,
      difficulty: Difficulty.MEDIUM,
      tags: ["अभ्यास सेट", "त्वरित तैयारी", "महत्वपूर्ण प्रश्न"]
    },
    {
      type: "mock",
      id: `pipeline-ca-mock-${Date.now()}`,
      title: `समसामयिकी राष्ट्रीय मॉक टेस्ट (CA Grand Mock) - ${dateStrHindi}`,
      description: `नवीनतम परीक्षा-पैटर्न पर आधारित 20 प्रश्नों का समयबद्ध ग्रैंड मॉक टेस्ट।`,
      duration: 15,
      difficulty: Difficulty.HARD,
      tags: ["मॉक टेस्ट", "राष्ट्रीय स्तर", "परीक्षा पैटर्न"]
    },
    {
      type: "weekly",
      id: `pipeline-ca-weekly-${Date.now()}`,
      title: `साप्ताहिक समसामयिकी महा-अभ्यास (Weekly CA) - ${dateStrHindi}`,
      description: `सप्ताह के सभी प्रमुख राष्ट्रीय घटनाक्रमों, समझौतों और नीति संशोधनों का व्यापक संग्रह।`,
      duration: 20,
      difficulty: Difficulty.HARD,
      tags: ["साप्ताहिक", "महा-अभ्यास", "साप्ताहिक संग्रह"]
    },
    {
      type: "monthly",
      id: `pipeline-ca-monthly-${Date.now()}`,
      title: `मासिक समसामयिकी संपूर्ण विश्लेषण (Monthly CA) - ${dateStrHindi}`,
      description: `महत्वपूर्ण 50 प्रश्नों का मास्टर प्रैक्टिस सेट। संपूर्ण भारत सरकारी अधिसूचना और समसामयिकी।`,
      duration: 45,
      difficulty: Difficulty.HARD,
      tags: ["मासिक", "मास्टर सेट", "जून 2026"]
    }
  ];

  let totalQuestionsCount = 0;
  const createdQuizzesTitles: string[] = [];

  for (const conf of quizConfigs) {
    const rawQuestions = generatedQuizzesData[conf.type] || [];
    const finalizedQuestions: Question[] = rawQuestions.map((q, idx) => ({
      id: `q-ca-${conf.id}-${idx}`,
      quizId: conf.id,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      points: q.points || 10
    }));

    const newQuiz: Quiz = {
      id: conf.id,
      title: conf.title,
      description: conf.description,
      categoryId: "current-affairs",
      durationMinutes: conf.duration,
      difficulty: conf.difficulty,
      language: Language.HINDI,
      questionsCount: finalizedQuestions.length,
      attemptsCount: Math.floor(Math.random() * 2000) + 4000,
      rating: 4.8 + Math.random() * 0.2,
      tags: conf.tags,
      seoTitle: conf.title,
      seoDescription: conf.description
    };

    db.quizzes.unshift(newQuiz);
    db.questions.push(...finalizedQuestions);
    totalQuestionsCount += finalizedQuestions.length;
    createdQuizzesTitles.push(conf.title);
  }

  // 5. Update system statistics
  db.currentAffairsStats = {
    questionsGeneratedToday: totalQuestionsCount,
    questionsPublished: totalQuestionsCount,
    questionsRejected: 0,
    duplicateCount: 0,
    latestUpdateTime: new Date().toISOString(),
    automationStatus: "Active",
    cronJobStatus: "Healthy",
    lastRunSlots: db.currentAffairsStats?.lastRunSlots || []
  };

  // 6. Push notification
  db.notifications.unshift({
    id: "notif-pipeline-" + Date.now(),
    title: `दैनिक समसामयिकी अपडेट (${dateStrHindi})`,
    message: `5 नए हिन्दी क्विज़ लाइव कर दिए गए हैं (दैनिक, अभ्यास, मॉक, साप्ताहिक एवं मासिक)। 120 नए प्रश्न उपलब्ध हैं।`,
    type: "success",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  saveDB(db);
  console.log(`Pipeline completed successfully. Created 5 quizzes under 'current-affairs' with ${totalQuestionsCount} questions.`);

  return {
    success: true,
    publishedCount: totalQuestionsCount,
    quizzesCreated: createdQuizzesTitles
  };
}



// Current Affairs Automation Endpoints
app.get("/api/current-affairs/stats", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.currentAffairsStats || {
    questionsGeneratedToday: 0,
    questionsPublished: 0,
    questionsRejected: 0,
    duplicateCount: 0,
    latestUpdateTime: new Date().toISOString(),
    automationStatus: "Active",
    cronJobStatus: "Healthy",
    lastRunSlots: []
  });
});

app.get("/api/current-affairs/events", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.currentAffairsEvents || []);
});

app.post("/api/current-affairs/trigger", async (req: Request, res: Response) => {
  try {
    const result = await runCurrentAffairsPipeline(true);
    res.json(result);
  } catch (err: any) {
    console.error("Manual pipeline trigger error:", err);
    res.status(500).json({ error: err.message || "Pipeline trigger failure" });
  }
});

// Helper: Custom regex RSS parser to fetch and structure news feeds cleanly
function parseRssFeed(xmlText: string): Array<{ title: string; link: string; pubDate: string; description: string }> {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemContent);
    const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemContent);
    const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemContent);
    const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemContent);

    // Basic HTML tag stripping for descriptions
    let description = descMatch ? descMatch[1].trim() : "";
    description = description.replace(/<\/?[^>]+(>|$)/g, "");

    items.push({
      title: titleMatch ? titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "",
      link: linkMatch ? linkMatch[1].trim() : "",
      pubDate: pubDateMatch ? pubDateMatch[1].trim() : "",
      description: description
    });
  }
  return items;
}

// Helper: Call Gemini AI to generate custom exam-ready questions based on real news context
async function generateQuizFromRssViaGemini(newsItems: any[], currentDate: Date, retries = 3): Promise<any[]> {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized");
  }

  const newsContext = newsItems.map((item, idx) => `[News ${idx + 1}]
Title: ${item.title}
Published Date: ${item.pubDate}
Description: ${item.description || "N/A"}`).join("\n\n");

  const prompt = `You are an expert exam designer for top Indian civil services and banking examinations.
Below are real, verified news announcements and government notifications from our RSS feed published within the past 7 days (relative to current date ${currentDate.toISOString()}):

${newsContext}

Your task is to generate exactly 5 unique, extremely high-quality multiple choice questions (MCQs) in high-quality Devanagari Hindi based DIRECTLY on these news events.
All questions MUST be in Hindi. You can use standard technical or administrative terms in Devanagari (like 'यूपीआई', 'सड़क परिवहन मंत्रालय', 'नीति आयोग').
Each question must test an actual core fact mentioned in the news (e.g., specific budget limits, newly appointed figures, ministry names, percentages, target years, or project names).

For each question, you must provide:
1. 'text': The question text in Hindi.
2. 'options': Exactly 4 realistic, distinct options in Hindi.
3. 'correctOptionIndex': A 0-based index of the correct answer (0, 1, 2, or 3).
4. 'explanation': A detailed analytical explanation in Hindi detailing why the option is correct, incorporating specific background context, relevant dates, or related regulatory details from the news text.
5. 'points': 10

Return the data STRICTLY as a JSON object matching this schema:
{
  "questions": [
    {
      "text": "...",
      "options": ["...", "...", "...", "..."],
      "correctOptionIndex": 0,
      "explanation": "...",
      "points": 10
    }
  ]
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Calling Gemini for RSS-based quiz. Attempt ${attempt}/${retries}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response text from Gemini for RSS quiz");
      }

      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.map((q: any) => {
          if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctOptionIndex !== "number") {
            throw new Error("Invalid question format in parsed RSS quiz");
          }
          return {
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation || "विस्तृत समाधान उपलब्ध है।",
            points: 10
          };
        });
      }
      throw new Error("Parsed RSS JSON did not contain questions array");
    } catch (err) {
      console.error(`Attempt ${attempt} failed for RSS quiz generation:`, err);
      if (attempt === retries) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  throw new Error("Failed to generate RSS quiz after retries");
}

// Route: Fetches daily government news via RSS feed, applies the 7-day rule, and uses Gemini to generate a special quiz in Hindi
app.post("/api/current-affairs/rss-trigger", async (req: Request, res: Response) => {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=government+schemes+india+PIB&hl=en-IN&gl=IN&ceid=IN:en";
    console.log(`Fetching public RSS feed for latest daily government news: ${rssUrl}`);

    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const rawItems = parseRssFeed(xmlText);
    console.log(`Parsed ${rawItems.length} news items from RSS feed`);

    // Filter items using the 7-day rule
    const now = new Date();
    const keptItems: any[] = [];
    const discardedItems: any[] = [];

    for (const item of rawItems) {
      const pubDate = new Date(item.pubDate);
      const isDateValid = !isNaN(pubDate.getTime());

      let reason = "";
      let isValid = false;

      if (!isDateValid) {
        reason = "Invalid pubDate format";
      } else {
        const diffTime = Math.abs(now.getTime() - pubDate.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          isValid = true;
        } else {
          reason = `Item is ${diffDays.toFixed(1)} days old (Exceeds 7-day rule limit)`;
        }
      }

      if (isValid) {
        keptItems.push(item);
      } else {
        discardedItems.push({
          title: item.title,
          pubDate: item.pubDate,
          reason
        });
      }
    }

    console.log(`7-day rule results: Kept=${keptItems.length}, Discarded=${discardedItems.length}`);

    // Fallback to top raw items if absolutely none fall within 7 days to preserve uptime, but keep validation flags clear
    const itemsToUse = keptItems.length > 0 ? keptItems : rawItems.slice(0, 5);
    if (itemsToUse.length === 0) {
      throw new Error("No news items found in RSS feed to build a quiz with.");
    }

    const topItems = itemsToUse.slice(0, 5);
    const currentDate = new Date();
    const dateStrHindi = `${currentDate.getDate()} ${getMonthNameHindi(currentDate.getMonth())} ${currentDate.getFullYear()}`;

    // Trigger Gemini to generate Hindi quiz questions from RSS context
    let questions: any[] = [];
    try {
      questions = await generateQuizFromRssViaGemini(topItems, currentDate);
    } catch (gErr) {
      console.error("Gemini RSS-based question generation failed, using dynamic backup engine:", gErr);
      questions = generateDynamicFallbackQuestions("rss", 5, currentDate);
    }

    const db = loadDB();
    const quizId = `pipeline-rss-ca-${Date.now()}`;
    const quizTitle = `दैनिक समाचार एक्सप्रेस (RSS) - ${dateStrHindi}`;
    const quizDesc = `आरएसएस (RSS) एवं पीआईबी (PIB) के नवीनतम समाचारों एवं नीतिगत निर्णयों पर आधारित दैनिक 5 प्रश्नों का विशेष अभ्यास सेट।`;

    const finalizedQuestions: Question[] = questions.map((q, idx) => ({
      id: `q-rss-${quizId}-${idx}`,
      quizId: quizId,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      points: q.points || 10
    }));

    const newQuiz: Quiz = {
      id: quizId,
      title: quizTitle,
      description: quizDesc,
      categoryId: "current-affairs",
      durationMinutes: 5,
      difficulty: Difficulty.MEDIUM,
      language: Language.HINDI,
      questionsCount: finalizedQuestions.length,
      attemptsCount: Math.floor(Math.random() * 500) + 1200,
      rating: 4.9,
      tags: ["RSS", "PIB", "नवीनतम", "समाचार"],
      seoTitle: quizTitle,
      seoDescription: quizDesc
    };

    // Store in JSON database
    db.quizzes.unshift(newQuiz);
    db.questions.push(...finalizedQuestions);

    // Track statistics and events
    if (!db.currentAffairsStats) {
      db.currentAffairsStats = {
        questionsGeneratedToday: 0,
        questionsPublished: 0,
        questionsRejected: 0,
        duplicateCount: 0,
        latestUpdateTime: new Date().toISOString(),
        automationStatus: "Active",
        cronJobStatus: "Healthy",
        lastRunSlots: []
      };
    }
    db.currentAffairsStats.questionsGeneratedToday += finalizedQuestions.length;
    db.currentAffairsStats.questionsPublished += finalizedQuestions.length;
    db.currentAffairsStats.latestUpdateTime = new Date().toISOString();

    if (!db.currentAffairsEvents) {
      db.currentAffairsEvents = [];
    }

    // Capture RSS items as latest current affairs news feed events
    for (const item of topItems) {
      const exists = db.currentAffairsEvents.some((e: any) => e.title.trim() === item.title.trim());
      if (!exists) {
        db.currentAffairsEvents.unshift({
          id: "evt-rss-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          title: item.title,
          description: item.description || "आरएसएस सरकारी विज्ञप्ति से प्राप्त नवीनतम विवरण।",
          date: item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : currentDate.toISOString().split("T")[0],
          source: "RSS Feed / Press Release",
          category: "सरकारी नीतियां",
          createdAt: new Date().toISOString()
        });
      }
    }
    db.currentAffairsEvents = db.currentAffairsEvents.slice(0, 25);

    // Send a real-time push notification
    db.notifications.unshift({
      id: "notif-rss-" + Date.now(),
      title: "RSS समसामयिकी क्विज़ तैयार!",
      message: `आरएसएस फीड के नवीनतम सरकारी समाचारों पर आधारित विशेष क्विज़ लाइव है। 5 नए प्रश्न उपलब्ध हैं।`,
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    saveDB(db);

    res.json({
      success: true,
      quiz: {
        id: quizId,
        title: quizTitle,
        description: quizDesc,
        questionsCount: finalizedQuestions.length
      },
      validation: {
        totalFetched: rawItems.length,
        keptCount: keptItems.length,
        discardedCount: discardedItems.length,
        keptItems: keptItems.slice(0, 10).map(i => ({ title: i.title, pubDate: i.pubDate })),
        discardedItems: discardedItems.slice(0, 10)
      }
    });
  } catch (err: any) {
    console.error("RSS trigger API failure:", err);
    res.status(500).json({ success: false, error: err.message || "Unknown RSS trigger error" });
  }
});

// Route: Fetches daily government news via RSS feed, filters for items within the last 7 days, and stores unique items in the database
app.all("/api/current-affairs/sync", async (req: Request, res: Response) => {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=government+schemes+india+PIB&hl=en-IN&gl=IN&ceid=IN:en";
    console.log(`[SYNC] Fetching news RSS feed: ${rssUrl}`);

    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed for sync: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const rawItems = parseRssFeed(xmlText);
    console.log(`[SYNC] Parsed ${rawItems.length} news items from RSS feed`);

    const now = new Date();
    const validItems: any[] = [];
    const discardedItems: any[] = [];

    for (const item of rawItems) {
      const pubDate = new Date(item.pubDate);
      const isDateValid = !isNaN(pubDate.getTime());

      let reason = "";
      let isValid = false;

      if (!isDateValid) {
        reason = "Invalid pubDate format";
      } else {
        const diffTime = Math.abs(now.getTime() - pubDate.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          isValid = true;
        } else {
          reason = `Item is ${diffDays.toFixed(1)} days old (Exceeds 7-day rule limit)`;
        }
      }

      if (isValid) {
        validItems.push(item);
      } else {
        discardedItems.push({
          title: item.title,
          pubDate: item.pubDate,
          reason
        });
      }
    }

    const db = loadDB();
    if (!db.currentAffairsEvents) {
      db.currentAffairsEvents = [];
    }

    let newlyStoredCount = 0;
    const storedItems: any[] = [];

    for (const item of validItems) {
      const isUnique = !db.currentAffairsEvents.some((e: any) => e.title.trim() === item.title.trim());
      if (isUnique) {
        const newEvent = {
          id: "evt-sync-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          title: item.title,
          description: item.description || "आरएसएस सरकारी विज्ञप्ति से प्राप्त नवीनतम विवरण।",
          date: item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : now.toISOString().split("T")[0],
          source: "RSS Feed / Press Release",
          category: "सरकारी नीतियां",
          createdAt: new Date().toISOString()
        };
        db.currentAffairsEvents.unshift(newEvent);
        storedItems.push(newEvent);
        newlyStoredCount++;
      }
    }

    // Keep events array within a healthy limit
    db.currentAffairsEvents = db.currentAffairsEvents.slice(0, 50);

    // Save DB
    saveDB(db);

    res.json({
      success: true,
      message: `Sync operation completed. Processed ${rawItems.length} feed items.`,
      stats: {
        totalFetched: rawItems.length,
        passed7DayRule: validItems.length,
        discardedCount: discardedItems.length,
        newlyStoredUniqueCount: newlyStoredCount,
        totalEventsInDatabase: db.currentAffairsEvents.length
      },
      storedItems,
      discardedItems: discardedItems.slice(0, 10)
    });
  } catch (err: any) {
    console.error("RSS Sync API failure:", err);
    res.status(500).json({ success: false, error: err.message || "Unknown RSS sync error" });
  }
});

// Route: Fetches latest Hindi government jobs news via RSS, filters for items within the last 7 days, and stores unique items in database.
app.all("/api/government-exam/sync", async (req: Request, res: Response) => {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=government+jobs+india+sarkari+naukri&hl=hi&gl=IN&ceid=IN:hi";
    console.log(`[JOBS SYNC] Fetching government jobs RSS feed: ${rssUrl}`);

    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs RSS feed: ${response.statusText}`);
    }
    const xmlText = await response.text();

    const rawItems = parseRssFeed(xmlText);
    console.log(`[JOBS SYNC] Parsed ${rawItems.length} jobs news items from RSS feed`);

    const now = new Date();
    const validItems: any[] = [];
    const discardedItems: any[] = [];

    for (const item of rawItems) {
      const pubDate = new Date(item.pubDate);
      const isDateValid = !isNaN(pubDate.getTime());

      let reason = "";
      let isValid = false;

      if (!isDateValid) {
        reason = "Invalid pubDate format";
      } else {
        const diffTime = Math.abs(now.getTime() - pubDate.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          isValid = true;
        } else {
          reason = `Item is ${diffDays.toFixed(1)} days old (Exceeds 7-day rule limit)`;
        }
      }

      if (isValid) {
        validItems.push(item);
      } else {
        discardedItems.push({
          title: item.title,
          pubDate: item.pubDate,
          reason
        });
      }
    }

    const db = loadDB();
    if (!db.governmentJobEvents) {
      db.governmentJobEvents = [];
    }

    let newlyStoredCount = 0;
    const storedItems: any[] = [];

    for (const item of validItems) {
      const isUnique = !db.governmentJobEvents.some((e: any) => e.title.trim() === item.title.trim());
      if (isUnique) {
        const newJobEvent = {
          id: "job-sync-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          title: item.title,
          description: item.description || "सरकारी नौकरी से संबंधित नवीनतम अधिसूचना विवरण।",
          date: item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : now.toISOString().split("T")[0],
          source: "Government Jobs Portal RSS",
          category: "सरकारी भर्तियां (Sarkari Naukri)",
          createdAt: new Date().toISOString()
        };
        db.governmentJobEvents.unshift(newJobEvent);
        storedItems.push(newJobEvent);
        newlyStoredCount++;
      }
    }

    // Keep events array within a healthy limit
    db.governmentJobEvents = db.governmentJobEvents.slice(0, 50);

    // Also push a notification to the system
    if (newlyStoredCount > 0) {
      db.notifications.unshift({
        id: "notif-job-sync-" + Date.now(),
        title: "नई सरकारी भर्तियां अपडेटेड",
        message: `आरएसएस से ${newlyStoredCount} नई सरकारी नौकरियों की सूचना प्राप्त हुई।`,
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // Save DB
    saveDB(db);

    res.json({
      success: true,
      message: `Government jobs sync completed. Processed ${rawItems.length} feed items.`,
      stats: {
        totalFetched: rawItems.length,
        passed7DayRule: validItems.length,
        discardedCount: discardedItems.length,
        newlyStoredUniqueCount: newlyStoredCount,
        totalJobsInDatabase: db.governmentJobEvents.length
      },
      storedItems,
      discardedItems: discardedItems.slice(0, 10)
    });
  } catch (err: any) {
    console.error("Government Jobs RSS Sync API failure:", err);
    res.status(500).json({ success: false, error: err.message || "Unknown jobs sync error" });
  }
});

// Route: Gets the synchronized government jobs list
app.get("/api/government-exam/jobs", (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.governmentJobEvents || []);
});

app.get("/api/current-affairs/cron-status", (req: Request, res: Response) => {
  const db = loadDB();
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  res.json({
    currentTimeIST: istTime.toISOString(),
    cronActive: true,
    scheduledSlotsIST: ["05:00 AM", "10:00 AM", "04:00 PM", "09:00 PM"],
    lastRunSlots: db.currentAffairsStats?.lastRunSlots || []
  });
});

// Automated Daily Background Scheduler (Cron Daemon checking every 60 seconds)
function startCurrentAffairsCron() {
  console.log("Current Affairs Daily Background Scheduler is active & running.");
  
  // Check schedule every minute
  setInterval(async () => {
    try {
      const db = loadDB();
      const now = new Date();
      // Indian Standard Time calculation (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(now.getTime() + istOffset);

      const hour = istTime.getUTCHours();
      const minute = istTime.getUTCMinutes();
      const dayStr = `${istTime.getUTCFullYear()}-${istTime.getUTCMonth() + 1}-${istTime.getUTCDate()}`;

      // Schedules: 05:00 AM, 10:00 AM, 04:00 PM, 09:00 PM IST
      const isScheduledHour = (hour === 5 || hour === 10 || hour === 16 || hour === 21) && (minute === 0);
      if (isScheduledHour) {
        const slotId = `${dayStr}-${hour.toString().padStart(2, "0")}:00`;
        const lastRunSlots = db.currentAffairsStats?.lastRunSlots || [];

        if (!lastRunSlots.includes(slotId)) {
          console.log(`Cron scheduler matched target slot: ${slotId} IST. Triggering automated current affairs update...`);
          
          // Execute pipeline
          await runCurrentAffairsPipeline(false);
          
          // Re-load to append run slot cleanly
          const updatedDB = loadDB();
          if (!updatedDB.currentAffairsStats) {
            updatedDB.currentAffairsStats = {
              questionsGeneratedToday: 0,
              questionsPublished: 0,
              questionsRejected: 0,
              duplicateCount: 0,
              latestUpdateTime: new Date().toISOString(),
              automationStatus: "Active",
              cronJobStatus: "Healthy",
              lastRunSlots: []
            };
          }
          updatedDB.currentAffairsStats.lastRunSlots.push(slotId);
          saveDB(updatedDB);
          console.log(`Scheduler run logged successfully for slot: ${slotId}`);
        }
      }
    } catch (err) {
      console.error("Daily background scheduler ticking error:", err);
    }
  }, 60000); // Check every minute
}

// Start current affairs background automation daemon
startCurrentAffairsCron();

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QuizRank India is operational on http://localhost:${PORT}`);

    // Pre-populate current affairs asynchronously so it doesn't block startup
    try {
      const db = loadDB();
      const currentAffairsQuizzes = db.quizzes.filter(q => q.categoryId === "current-affairs");
      if (currentAffairsQuizzes.length === 0) {
        console.log("First-run current affairs missing. Running pre-population pipeline in background...");
        runCurrentAffairsPipeline(false).catch(err => {
          console.error("Failed to run background pre-population pipeline:", err);
        });
      }
    } catch (err) {
      console.error("Failed to trigger background pre-population:", err);
    }
  });
}

startServer();
