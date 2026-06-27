import dbData from "../../data.json";

// In-memory clone of database to simulate writes
const db: any = JSON.parse(JSON.stringify(dbData));

export const onRequest = async (context: {
  request: Request;
  env: { GEMINI_API_KEY?: string };
  params: { path?: string[] };
}): Promise<Response> => {
  const url = new URL(context.request.url);
  const pathSegments = context.params.path as string[] || [];
  const method = context.request.method;
  
  // Headers with CORS and JSON
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const joinPath = pathSegments.join("/");
  
  // 1. Health check
  if (joinPath === "health") {
    const hasGeminiKey = !!context.env.GEMINI_API_KEY;
    return new Response(JSON.stringify({
      status: "healthy",
      environment: "cloudflare-pages",
      hasGeminiKey,
      database: "JSON_InBundle_Edge_Resilient",
      timestamp: new Date().toISOString()
    }), { headers });
  }

  // 2. Diagnostics
  if (joinPath === "diagnostics") {
    return new Response(JSON.stringify({
      success: true,
      diagnostics: {
        geminiApiKeyConfigured: !!context.env.GEMINI_API_KEY,
        nodeEnv: "production",
        port: 80,
        databaseFileExists: true,
        inMemoryActive: true,
        registeredCategories: db.categories?.length || 0,
        registeredQuizzes: db.quizzes?.length || 0,
        registeredBlogs: db.blogs?.length || 0,
      }
    }), { headers });
  }

  // 3. Categories
  if (joinPath === "categories") {
    return new Response(JSON.stringify(db.categories || []), { headers });
  }

  // 4. Quizzes (and single quiz, and quiz questions)
  if (pathSegments[0] === "quizzes") {
    const id = pathSegments[1];
    if (!id) {
      // Return all quizzes
      return new Response(JSON.stringify(db.quizzes || []), { headers });
    }
    
    const quiz = db.quizzes.find((q: any) => q.id === id);
    if (!quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), { status: 404, headers });
    }

    if (pathSegments[2] === "questions") {
      const questions = db.questions.filter((q: any) => q.quizId === id);
      return new Response(JSON.stringify(questions), { headers });
    }

    if (pathSegments[2] === "submit" && method === "POST") {
      try {
        const body: any = await context.request.json();
        const answers = body.answers || {}; 
        const userName = body.userName || "Aspirant";
        
        const questions = db.questions.filter((q: any) => q.quizId === id);
        let correctCount = 0;
        const questionResults = questions.map((q: any) => {
          const selected = answers[q.id];
          const isCorrect = selected !== undefined && Number(selected) === q.correctOptionIndex;
          if (isCorrect) correctCount++;
          return {
            questionId: q.id,
            selectedOptionIndex: selected !== undefined ? Number(selected) : null,
            correctOptionIndex: q.correctOptionIndex,
            isCorrect
          };
        });

        const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        const resultId = "res-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        const submissionResult = {
          id: resultId,
          quizId: id,
          quizTitle: quiz.title,
          userName,
          score,
          correctCount,
          totalCount: questions.length,
          timestamp: new Date().toISOString()
        };

        quiz.attemptsCount = (quiz.attemptsCount || 0) + 1;
        
        if (db.leaderboard) {
          db.leaderboard.push({
            id: "leader-" + Date.now(),
            quizId: id,
            quizTitle: quiz.title,
            userName,
            score,
            timeSpentSeconds: 120,
            date: new Date().toISOString().split("T")[0]
          });
        }

        return new Response(JSON.stringify(submissionResult), { headers });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Invalid submission" }), { status: 400, headers });
      }
    }

    return new Response(JSON.stringify(quiz), { headers });
  }

  // 5. Blogs
  if (pathSegments[0] === "blogs") {
    if (pathSegments[1] === "generate" && method === "POST") {
      let reqTopic = "सामान्य ज्ञान";
      try {
        const body: any = await context.request.json();
        reqTopic = body.topic || reqTopic;
      } catch (e) {}

      const apiKey = context.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallback = generateFallbackBlogPost(reqTopic);
        db.blogs.unshift(fallback);
        return new Response(JSON.stringify({ success: true, post: fallback, isFallback: true }), { headers });
      }

      try {
        const responseText = await callGeminiApi(apiKey, `You are an elite Government Jobs Exam Specialist. Create an educational blog post in Hindi about the topic: "${reqTopic}". Structure it in Markdown format. Respond strictly with a valid JSON matching this schema:
        {
          "title": "Title in Hindi",
          "excerpt": "Brief 2-sentence summary in Hindi",
          "content": "Rich markdown content in Hindi with sections, tables, and tips",
          "category": "Exam Preparation",
          "primaryKeyword": "${reqTopic}",
          "faqs": [
            { "question": "Question 1", "answer": "Answer 1" }
          ]
        }`);

        if (responseText) {
          const generated = JSON.parse(responseText);
          const newPost = {
            id: "blog-ai-" + Date.now(),
            title: generated.title || `${reqTopic} की सम्पूर्ण गाइड`,
            slug: encodeURIComponent((generated.title || reqTopic).toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, "-")) + "-guide",
            excerpt: generated.excerpt || `तैयारी से संबंधित आवश्यक जानकारी।`,
            content: generated.content || `विषय के मुख्य बिंदु और तैयारी के नियम।`,
            category: generated.category || "Exam Prep",
            publishedAt: new Date().toISOString().split("T")[0],
            readTimeMinutes: 5,
            views: 42,
            imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
            primaryKeyword: generated.primaryKeyword || reqTopic,
            faqs: generated.faqs || []
          };
          db.blogs.unshift(newPost);
          return new Response(JSON.stringify({ success: true, post: newPost }), { headers });
        }
      } catch (err: any) {
        console.error("Cloudflare Edge Gemini blog generation error:", err);
      }

      const fallback = generateFallbackBlogPost(reqTopic);
      db.blogs.unshift(fallback);
      return new Response(JSON.stringify({ success: true, post: fallback, isFallback: true }), { headers });
    }

    return new Response(JSON.stringify(db.blogs || []), { headers });
  }

  // 6. Generate Quiz
  if (joinPath === "generate-quiz" && method === "POST") {
    let reqTopic = "सामान्य ज्ञान";
    let reqDifficulty = "medium";
    let reqLanguage = "hindi";
    let reqCategoryId = "general-knowledge";

    try {
      const body: any = await context.request.json();
      reqTopic = body.topic || reqTopic;
      reqDifficulty = body.difficulty || reqDifficulty;
      reqLanguage = body.language || reqLanguage;
      reqCategoryId = body.categoryId || reqCategoryId;
    } catch (e) {}
    
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = fallbackToLocalQuiz(reqTopic, reqCategoryId);
      if (fallback) {
        return new Response(JSON.stringify(fallback), { headers });
      }
      return new Response(JSON.stringify({ error: "Gemini API key is not configured and no fallback quizzes are available." }), { status: 503, headers });
    }

    try {
      const isHindi = reqLanguage.toLowerCase() === "hindi";
      const isEnglishCat = reqCategoryId.toLowerCase() === "english" || reqTopic.toLowerCase().includes("english");
      
      let systemPrompt = `Create a mock exam quiz about the topic: "${reqTopic}". Difficulty: "${reqDifficulty}". Language: "${reqLanguage}".`;
      if (isHindi) {
        if (isEnglishCat) {
          systemPrompt += ` This is an English language subject test for Hindi-medium aspirants, so the questions, options, and explanations must be entirely in English, but the quiz title, description, and metadata must be in Hindi.`;
        } else {
          systemPrompt += ` All questions, options, correct answers, and explanations must be entirely in Hindi (Devanagari script). No English characters allowed except SSC, UPSC, RRB, IBPS.`;
        }
      }

      const promptText = `${systemPrompt} Respond strictly with a valid JSON object matching this structure. Do not output markdown backticks or extra text:
      {
        "title": "A highly search-optimized title in correct language",
        "description": "Exhaustive description of the test in correct language",
        "tags": ["exam", "prep"],
        "seoTitle": "SEO title under 60 chars",
        "seoDescription": "Meta description under 160 chars",
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Exact correct answer text from options",
            "explanation": "Step by step educational explanation"
          }
        ]
      }`;

      const responseText = await callGeminiApi(apiKey, promptText);
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const quizId = "quiz-ai-" + Date.now();
        const newQuiz = {
          id: quizId,
          title: parsed.title,
          description: parsed.description,
          categoryId: reqCategoryId,
          durationMinutes: 10,
          difficulty: reqDifficulty,
          language: reqLanguage,
          questionsCount: parsed.questions.length,
          attemptsCount: 1,
          rating: 4.8,
          tags: parsed.tags || ["AI-Generated"],
          seoTitle: parsed.seoTitle,
          seoDescription: parsed.seoDescription
        };

        const newQuestions = parsed.questions.map((q: any, i: number) => {
          const correctIndex = q.options.findIndex((opt: string) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
          return {
            id: `q-ai-${quizId}-${i}`,
            quizId,
            text: q.question,
            options: q.options,
            correctOptionIndex: correctIndex !== -1 ? correctIndex : 0,
            explanation: q.explanation,
            category: reqCategoryId,
            difficulty: reqDifficulty,
            language: reqLanguage
          };
        });

        db.quizzes.unshift(newQuiz);
        db.questions.push(...newQuestions);

        return new Response(JSON.stringify({ quiz: newQuiz, questions: newQuestions }), { headers });
      }
    } catch (err: any) {
      console.error("Cloudflare Edge Gemini quiz generation error:", err);
    }

    const fallback = fallbackToLocalQuiz(reqTopic, reqCategoryId);
    if (fallback) {
      return new Response(JSON.stringify(fallback), { headers });
    }
    return new Response(JSON.stringify({ error: "Failed to generate quiz." }), { status: 500, headers });
  }

  // 7. Leaderboard
  if (joinPath === "leaderboard") {
    return new Response(JSON.stringify(db.leaderboard || []), { headers });
  }

  // 8. Notifications
  if (pathSegments[0] === "notifications") {
    if (method === "POST") {
      try {
        const body: any = await context.request.json();
        const newNotif = {
          id: "notif-" + Date.now(),
          title: body.title,
          message: body.message,
          timestamp: new Date().toISOString()
        };
        db.notifications = db.notifications || [];
        db.notifications.unshift(newNotif);
        return new Response(JSON.stringify(newNotif), { headers });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers });
      }
    }
    return new Response(JSON.stringify(db.notifications || []), { headers });
  }

  // 9. Current Affairs Events
  if (joinPath === "current-affairs/events") {
    return new Response(JSON.stringify(db.currentAffairsEvents || []), { headers });
  }

  // 10. Current Affairs Stats
  if (joinPath === "current-affairs/stats") {
    return new Response(JSON.stringify(db.currentAffairsStats || {
      questionsGeneratedToday: 0,
      questionsPublished: 0,
      questionsRejected: 0,
      duplicateCount: 0,
      latestUpdateTime: new Date().toISOString(),
      automationStatus: "Active",
      cronJobStatus: "Healthy",
      lastRunSlots: []
    }), { headers });
  }

  // 11. Government Exam Jobs
  if (joinPath === "government-exam/jobs") {
    return new Response(JSON.stringify(db.governmentJobEvents || []), { headers });
  }

  // 12. Cron Status
  if (joinPath === "current-affairs/cron-status") {
    return new Response(JSON.stringify({
      currentTimeIST: new Date().toISOString(),
      cronActive: true,
      scheduledSlotsIST: ["05:00 AM", "10:00 AM", "04:00 PM", "09:00 PM"],
      lastRunSlots: []
    }), { headers });
  }

  return new Response(JSON.stringify({ error: `Endpoint /api/${joinPath} is not supported on Edge Functions.` }), { status: 404, headers });
};

// Helper for REST Gemini Calls
async function callGeminiApi(apiKey: string, promptText: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error status: ${response.status}`);
  }

  const result: any = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// Fallback logic for quizzes
function fallbackToLocalQuiz(topic: string, categoryId: string): any {
  let candidates = db.quizzes.filter((q: any) => q.categoryId === categoryId);
  if (candidates.length === 0) {
    candidates = db.quizzes;
  }
  
  if (candidates.length > 0) {
    const randomBase = candidates[Math.floor(Math.random() * candidates.length)];
    const baseQuestions = db.questions.filter((q: any) => q.quizId === randomBase.id);
    
    const quizId = "quiz-fallback-" + Date.now();
    const clonedQuiz = {
      ...randomBase,
      id: quizId,
      title: `${topic || "विषय"} (अभ्यास सेट)`,
      description: `विशेष रूप से तैयार किया गया अभ्यास सेट। (${randomBase.title})`,
      tags: [...(randomBase.tags || []), "अभ्यास", "लोकल-बैकअप"],
      attemptsCount: (randomBase.attemptsCount || 0) + 1
    };
    
    const clonedQuestions = baseQuestions.map((q: any, i: number) => ({
      ...q,
      id: `q-fallback-${quizId}-${i}`,
      quizId: quizId
    }));
    
    db.quizzes.unshift(clonedQuiz);
    db.questions.push(...clonedQuestions);
    
    return { quiz: clonedQuiz, questions: clonedQuestions };
  }
  return null;
}

// Fallback blog post
function generateFallbackBlogPost(topic: string): any {
  return {
    id: "fallback-post-" + Date.now(),
    title: `${topic} की सम्पूर्ण तैयारी गाइड और परीक्षा रणनीति`,
    slug: encodeURIComponent(topic.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, "-")) + "-guide",
    excerpt: `क्या आप ${topic} परीक्षा की तैयारी कर रहे हैं? जानिए सबसे बेहतरीन रणनीति।`,
    content: `### ${topic} की सम्पूर्ण तैयारी रणनीति\nनियमित अभ्यास करें और मॉक टेस्ट दें।`,
    category: "General Knowledge",
    publishedAt: new Date().toISOString().split("T")[0],
    readTimeMinutes: 5,
    views: 120,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    primaryKeyword: topic,
    faqs: []
  };
}
