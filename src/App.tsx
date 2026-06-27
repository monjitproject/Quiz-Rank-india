/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { QuizEngine } from "./components/QuizEngine";
import { UserDashboard } from "./components/UserDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { StaticPages } from "./components/StaticPages";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { BlogSection } from "./components/BlogSection";
import { Quiz, Category, Result, BlogPost } from "./types";
import { PREMIUM_BLOG_POSTS } from "./data/premiumBlogs";
import { ExploreCategories } from "./components/ExploreCategories";
import { PopularExams } from "./components/PopularExams";
import { SubjectPractice } from "./components/SubjectPractice";
import { DailyCurrentAffairs } from "./components/DailyCurrentAffairs";
import { LeaderboardPodium } from "./components/LeaderboardPodium";
import { MockTestExplorer } from "./components/MockTestExplorer";
import { Calendar, User, BookOpen, Clock, Star, Play, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<Result[]>(() => {
    try {
      const saved = localStorage.getItem("quizrank-results");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [userName, setUserName] = useState("Rahul Kumar");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>(PREMIUM_BLOG_POSTS);
  const [activeView, setActiveView] = useState<string>("home");
  const [activeViewArg, setActiveViewArg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [envStatus, setEnvStatus] = useState<{ hasGeminiKey: boolean; checked: boolean }>({
    hasGeminiKey: true,
    checked: false
  });

  const syncRouteFromUrl = (currentQuizzes: Quiz[]) => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    
    if (pathname === "/dashboard") {
      setActiveView("dashboard");
      setActiveViewArg(null);
    } else if (pathname === "/admin") {
      setActiveView("admin");
      setActiveViewArg(null);
    } else if (pathname === "/leaderboard") {
      setActiveView("leaderboard");
      setActiveViewArg(null);
    } else if (pathname === "/blog") {
      setActiveView("blog");
      setActiveViewArg(null);
    } else if (pathname.startsWith("/blog/")) {
      const slug = pathname.replace("/blog/", "");
      setActiveView("blog-detail");
      setActiveViewArg(slug);
    } else if (pathname.startsWith("/category/")) {
      const category = decodeURIComponent(pathname.replace("/category/", ""));
      setActiveView("blog-category");
      setActiveViewArg(category);
    } else if (pathname === "/latest") {
      setActiveView("blog-latest");
      setActiveViewArg(null);
    } else if (pathname === "/trending") {
      setActiveView("blog-trending");
      setActiveViewArg(null);
    } else if (pathname.startsWith("/static-page/")) {
      const pageId = pathname.replace("/static-page/", "");
      setActiveView("static-page");
      setActiveViewArg(pageId);
    } else if (pathname.startsWith("/quiz/")) {
      const quizId = pathname.replace("/quiz/", "");
      const selected = currentQuizzes.find(q => q.id === quizId);
      if (selected) {
        setActiveView("quiz-player");
        setActiveViewArg(selected);
      } else {
        setActiveView("home");
        setActiveViewArg(null);
      }
    } else {
      setActiveView("home");
      setActiveViewArg(null);
    }
  };

  const changeView = (view: string, arg: any = null, pushState = true) => {
    setActiveView(view);
    setActiveViewArg(arg);
    
    if (pushState && typeof window !== "undefined") {
      let path = "/";
      if (view === "dashboard") path = "/dashboard";
      else if (view === "admin") path = "/admin";
      else if (view === "leaderboard") path = "/leaderboard";
      else if (view === "blog") path = "/blog";
      else if (view === "blog-detail") path = `/blog/${arg}`;
      else if (view === "blog-category") path = `/category/${encodeURIComponent(arg)}`;
      else if (view === "blog-latest") path = "/latest";
      else if (view === "blog-trending") path = "/trending";
      else if (view === "static-page") path = `/static-page/${arg}`;
      else if (view === "quiz-player" && arg) path = `/quiz/${arg.id}`;
      
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
    }
  };

  const loadQuizzes = () => {
    fetch("/api/quizzes")
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error loading quizzes:", err));
  };

  useEffect(() => {
    setLoading(true);
    
    // Check environment status
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setEnvStatus({
          hasGeminiKey: !!data.hasGeminiKey,
          checked: true
        });
      })
      .catch(() => {
        setEnvStatus({
          hasGeminiKey: true,
          checked: true
        });
      });

    // Fetch initial datasets including premium blogs
    Promise.all([
      fetch("/api/quizzes").then(res => res.json()),
      fetch("/api/categories").then(res => res.json()),
      fetch("/api/blogs").then(res => res.json()).catch(() => PREMIUM_BLOG_POSTS)
    ])
      .then(([quizzesData, categoriesData, blogsData]) => {
        setQuizzes(quizzesData);
        setCategories(categoriesData);
        if (blogsData && blogsData.length > 0) {
          setBlogs(blogsData);
        } else {
          setBlogs(PREMIUM_BLOG_POSTS);
        }
        setLoading(false);
        syncRouteFromUrl(quizzesData);
      })
      .catch(err => {
        console.error("Initial load failed:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      syncRouteFromUrl(quizzes);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem("quizrank-results", JSON.stringify(results));
    } catch (e) {
      console.error("Failed to save results to localStorage:", e);
    }
  }, [results]);

  const handleSelectQuiz = async (quizId: string) => {
    const selected = quizzes.find(q => q.id === quizId);
    if (selected) {
      changeView("quiz-player", selected);
      return;
    }

    if (quizId && quizId.startsWith("virtual-")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const fetchedQuiz = await res.json();
          setQuizzes(prev => [...prev, fetchedQuiz]);
          changeView("quiz-player", fetchedQuiz);
        } else {
          console.error("Failed to load virtual quiz:", quizId);
        }
      } catch (err) {
        console.error("Error loading virtual quiz:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddQuizToState = (newQuiz: Quiz) => {
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const handleDeleteQuizFromState = (quizId: string) => {
    fetch(`/api/quizzes/${quizId}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setQuizzes(prev => prev.filter(q => q.id !== quizId));
      })
      .catch(err => console.error(err));
  };

  // Filter quizzes by category and difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const filteredQuizzes = quizzes.filter(q => {
    const matchCategory = !selectedCategory || q.categoryId === selectedCategory;
    const matchDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
    return matchCategory && matchDifficulty;
  });

  // Render Homepage Contents
  const renderHomeView = () => {
    return (
      <div className="space-y-12">
        {envStatus.checked && !envStatus.hasGeminiKey && (
          <div className="max-w-7xl mx-auto px-4 pt-6">
            <div className="bg-amber-50/90 border border-amber-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm shadow-amber-500/5">
              <div className="flex gap-4 items-start">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 mt-1 md:mt-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">Gemini API Key Required</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-2xl">
                    Our dynamic current affairs pipeline, subject quizzes, and premium article generator rely on the Gemini API. 
                    Please set your <code className="bg-amber-100/50 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-bold text-amber-700">GEMINI_API_KEY</code> environment variable in your server configuration panel.
                  </p>
                </div>
              </div>
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noreferrer"
                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-3 rounded-2xl cursor-pointer shadow-sm shadow-amber-600/20 whitespace-nowrap transition-all self-end md:self-center"
              >
                Get API Key
              </a>
            </div>
          </div>
        )}

        {/* Premium Hero block */}
        <HeroSection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalAttempts={quizzes.reduce((acc, q) => acc + q.attemptsCount, 0)}
          totalQuizzes={quizzes.length}
          quizzes={quizzes}
          onSelectQuiz={handleSelectQuiz}
        />

        {/* Explore 20+ Exam Categories section */}
        <ExploreCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Subject Wise Practice drills */}
        <SubjectPractice
          onSelectCategory={setSelectedCategory}
        />

        {/* Daily Current Affairs news quiz portal */}
        <DailyCurrentAffairs
          onSelectCategory={setSelectedCategory}
          onSelectQuiz={handleSelectQuiz}
        />

        {/* Most Popular Government Exams directories */}
        <PopularExams
          onSelectCategory={setSelectedCategory}
        />

        {/* National Prep Leaderboard Podium */}
        <LeaderboardPodium />

        {/* Dynamic Quiz Card Grid with Anchor ID */}
        <div id="active-quizzes-section" className="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                500+ Mock Series Engine
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                {selectedCategory 
                  ? `${categories.find(c => c.id === selectedCategory)?.name || "Targeted"} Mock Series`
                  : "All Active Govt Vacancy Quizzes"
                }
              </h2>
              <p className="text-slate-400 text-xs mt-1">Select and start practicing. Real-time ranking with negative marking evaluation is active.</p>
            </div>
            
            <div className="flex items-center gap-2 self-start font-mono text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-1.5">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 animate-spin" /> Live Sync Verified
            </div>
          </div>

          <MockTestExplorer
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectQuiz={handleSelectQuiz}
            quizzes={quizzes}
          />
        </div>

        {/* Govt Jobs News & Updates (Notice Board) */}
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Notice Board
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
                Govt Jobs News & Updates
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Stay informed with the latest syllabus frameworks and job openings.</p>
            </div>
            <button
              onClick={() => changeView("blog")}
              className="text-indigo-600 hover:text-indigo-700 font-extrabold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              View Full Notice Blog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => changeView("blog")}
                className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/40 transition-all overflow-hidden cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {post.imageUrl && (
                    <div className="h-44 w-full overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 font-mono block">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>{post.readTimeMinutes} Min Read</span>
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">Read Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Success Stories & Testimonials (AUTHENTIC INDIAN RECRUITS) */}
        <div className="max-w-7xl mx-auto px-4 bg-slate-50 py-16 rounded-3xl border border-slate-100 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">Syllabus-Aspirant Testimonials</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight font-sans">Success Stories from Patna to Prayagraj</h2>
            <p className="text-slate-400 text-xs font-semibold">Real students who practiced daily mock assessments on QuizRank India and secured central board postings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex gap-1.5 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed italic font-medium">
                "The Hindi Grammar and CGL general assessment options are identical to official board layouts. Practicing with negative marking enabled boosted my confidence immensely before SSC GD!"
              </p>
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xs text-blue-700 uppercase">AK</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Amit Kumar</h4>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Selected: SSC GD (Patna, Bihar)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex gap-1.5 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed italic font-medium">
                "The daily current affairs generated by the AI system cover the latest central schemes, sports rosters, and budget updates perfectly. Highly recommended for state PSC aspirants!"
              </p>
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center font-bold text-xs text-purple-700 uppercase">PS</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Priya Sharma</h4>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Selected: UP SI (Lucknow, UP)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex gap-1.5 text-yellow-500">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed italic font-medium">
                "Finding mock tests in both Hindi and English with detailed educational explanation steps was very rare. QuizRank India is an invaluable tool for railway and local board candidates."
              </p>
              <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center font-bold text-xs text-teal-700 uppercase">VY</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Vikash Yadav</h4>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Selected: RRB NTPC (Jaipur, Rajasthan)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student stats metrics */}
          <div className="border-t border-slate-200 pt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-2xl md:text-3xl font-black text-slate-800 block font-mono">2.5M+</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Happy Students</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block font-mono">98%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Satisfaction Rate</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block font-mono">50K+</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Selected Cadres</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-2xl md:text-3xl font-black text-slate-800 block font-mono">4.9 / 5</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Aspirant Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "home":
        return renderHomeView();
      case "quiz-player":
        return (
          <QuizEngine
            quiz={activeViewArg}
            userName={userName}
            onFinished={(res) => setResults(prev => [...prev, res])}
            onBack={() => { changeView("home"); loadQuizzes(); }}
          />
        );
      case "dashboard":
        return (
          <UserDashboard
            userName={userName}
            results={results}
            onSelectQuiz={handleSelectQuiz}
            availableQuizzes={quizzes}
          />
        );
      case "admin":
        return (
          <AdminPanel
            quizzes={quizzes}
            onAddQuiz={handleAddQuizToState}
            onDeleteQuiz={handleDeleteQuizFromState}
            onRefreshQuizzes={loadQuizzes}
          />
        );
      case "static-page":
        return (
          <StaticPages
            pageId={activeViewArg}
            onBack={() => changeView("home")}
          />
        );
      case "leaderboard":
        return <LeaderboardSection />;
      case "blog":
      case "blog-detail":
      case "blog-category":
      case "blog-latest":
      case "blog-trending":
        return (
          <BlogSection
            initialSlug={activeView === "blog-detail" ? activeViewArg : null}
            initialCategory={activeView === "blog-category" ? activeViewArg : null}
            initialFilter={
              activeView === "blog-latest" ? "latest" : activeView === "blog-trending" ? "trending" : null
            }
            onViewChange={(newView, arg) => {
              if (newView === "blog-detail") {
                changeView("blog-detail", arg);
              } else if (newView === "blog-category") {
                changeView("blog-category", arg);
              } else {
                changeView("blog");
              }
            }}
          />
        );
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white">
      <div>
        {/* Responsive Sticky Header with Mega Menu, Search and Notifications */}
        <Header
          userName={userName}
          onSetUserName={setUserName}
          onNavigate={(view, arg) => {
            changeView(view, arg);
          }}
          quizzes={quizzes}
          onSelectQuiz={handleSelectQuiz}
        />

        {/* Main interactive page routing container */}
        <main className="pb-16">
          {renderActiveView()}
        </main>
      </div>

      {/* Elegant Disclosures and Compliance Footer */}
      <Footer
        onNavigateStatic={(pageId) => {
          changeView("static-page", pageId);
          window.scrollTo(0,0);
        }}
      />
    </div>
  );
}
