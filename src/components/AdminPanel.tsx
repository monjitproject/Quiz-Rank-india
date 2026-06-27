/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Settings, BarChart2, FileText, PlusCircle, Sparkles, MessageSquare, AlertCircle, RefreshCw, Key, LogIn, CheckCircle2, ShieldCheck, HelpCircle, Eye, EyeOff, BookOpen, Cpu, Database, Clock, Zap, Briefcase } from "lucide-react";
import { Quiz, Question, BlogPost, AppNotification } from "../types";

interface AdminPanelProps {
  quizzes: Quiz[];
  onAddQuiz: (newQuiz: any) => void;
  onDeleteQuiz: (quizId: string) => void;
  onRefreshQuizzes: () => void;
}

export function AdminPanel({ quizzes, onAddQuiz, onDeleteQuiz, onRefreshQuizzes }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"analytics" | "current-affairs" | "add-quiz" | "ai-generator" | "ads" | "seo" | "notifications">("analytics");
  
  // Current affairs stats state
  const [caStats, setCaStats] = useState<any>(null);
  const [caLoading, setCaLoading] = useState(false);
  const [caTriggering, setCaTriggering] = useState(false);
  const [rssLoading, setRssLoading] = useState(false);
  const [rssResult, setRssResult] = useState<any>(null);

  const fetchCaStats = async () => {
    try {
      setCaLoading(true);
      const res = await fetch("/api/current-affairs/stats");
      const data = await res.json();
      setCaStats(data);
    } catch (err) {
      console.error("Failed to fetch CA stats in Admin:", err);
    } finally {
      setCaLoading(false);
    }
  };

  const handleTriggerCAPipeline = async () => {
    try {
      setCaTriggering(true);
      const res = await fetch("/api/current-affairs/trigger", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Current Affairs automation pipeline executed successfully!");
        await fetchCaStats();
        onRefreshQuizzes();
      } else {
        alert("Pipeline failed: " + data.message);
      }
    } catch (err: any) {
      console.error("Failed to trigger pipeline:", err);
      alert("Error triggering pipeline: " + err.message);
    } finally {
      setCaTriggering(false);
    }
  };

  const handleTriggerRssPipeline = async () => {
    try {
      setRssLoading(true);
      setRssResult(null);
      const res = await fetch("/api/current-affairs/rss-trigger", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRssResult(data);
        await fetchCaStats();
        onRefreshQuizzes();
      } else {
        alert("RSS Pipeline failed: " + data.error);
      }
    } catch (err: any) {
      console.error("Failed to trigger RSS pipeline:", err);
      alert("Error triggering RSS pipeline: " + err.message);
    } finally {
      setRssLoading(false);
    }
  };

  const [jobsSyncLoading, setJobsSyncLoading] = useState(false);
  const [jobsSyncResult, setJobsSyncResult] = useState<any>(null);

  const handleTriggerJobsSync = async () => {
    try {
      setJobsSyncLoading(true);
      setJobsSyncResult(null);
      const res = await fetch("/api/government-exam/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setJobsSyncResult(data);
        alert("Government Jobs RSS Sync completed!");
        onRefreshQuizzes();
      } else {
        alert("Jobs RSS Sync failed: " + data.error);
      }
    } catch (err: any) {
      console.error("Failed to trigger Jobs Sync:", err);
      alert("Error triggering Jobs Sync: " + err.message);
    } finally {
      setJobsSyncLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "current-affairs") {
      fetchCaStats();
    }
  }, [activeTab]);
  
  // Custom manual quiz fields
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("ssc");
  const [newLanguage, setNewLanguage] = useState("English");
  const [newDifficulty, setNewDifficulty] = useState("Medium");
  const [manualQuestions, setManualQuestions] = useState<any[]>([
    { text: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }
  ]);

  // AI Generator fields
  const [aiTopic, setAiTopic] = useState("Indian Polity and Constitution");
  const [aiDifficulty, setAiDifficulty] = useState("Medium");
  const [aiLanguage, setAiLanguage] = useState("English");
  const [aiCategory, setAiCategory] = useState("current-affairs");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");

  // AdSense & SEO local configurations
  const [adSenseEnabled, setAdSenseEnabled] = useState(true);
  const [adPlacementHeader, setAdPlacementHeader] = useState(true);
  const [adPlacementSidebar, setAdPlacementSidebar] = useState(true);
  const [adPlacementInContent, setAdPlacementInContent] = useState(true);
  
  const [seoTitleSuffix, setSeoTitleSuffix] = useState("QuizRank India");
  const [sitemapStatus, setSitemapStatus] = useState("Generated & Fresh (2026)");
  
  // Custom notification fields
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"info" | "success" | "warning" | "alert">("info");
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Database Seeding State
  const [seedingStatus, setSeedingStatus] = useState("");
  const [repairingStatus, setRepairingStatus] = useState("");

  const handlePreSeedDatabase = async () => {
    setSeedingStatus("Initializing...");
    try {
      const res = await fetch("/api/admin/pre-seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedingStatus("Success! 🎉");
        onRefreshQuizzes();
        alert(`Successfully pre-seeded ${data.count} highly professional government exam quizzes spanning 14 official categories!`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setSeedingStatus("");
      alert("Pre-seeding failed: " + (err.message || "An unknown error occurred."));
    } finally {
      setTimeout(() => setSeedingStatus(""), 4000);
    }
  };

  const handleRepairDatabase = async () => {
    setRepairingStatus("Scanning...");
    try {
      const res = await fetch("/api/admin/repair-db", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRepairingStatus("Completed! ✨");
        onRefreshQuizzes();
        alert(`QA Scan & Auto-Repair completed!\n\n- Repaired: ${data.repaired} question records\n- Corrupted / Deleted: ${data.deleted} records\n- Fresh Replacements Generated: ${data.replaced} exam quizzes`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setRepairingStatus("");
      alert("Database repair failed: " + (err.message || "An unknown error occurred."));
    } finally {
      setTimeout(() => setRepairingStatus(""), 4000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123" || adminPassword === "admin") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Admin Password! Please use 'admin' as password.");
    }
  };

  const handleAddManualQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      { text: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }
    ]);
  };

  const handleManualQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...manualQuestions];
    if (field === "text") {
      updated[index].text = value;
    } else if (field === "explanation") {
      updated[index].explanation = value;
    } else if (field === "correctOptionIndex") {
      updated[index].correctOptionIndex = Number(value);
    }
    setManualQuestions(updated);
  };

  const handleManualOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...manualQuestions];
    updated[qIndex].options[oIndex] = value;
    setManualQuestions(updated);
  };

  const handleSaveManualQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      alert("Please provide title and description!");
      return;
    }
    
    try {
      const res = await fetch("/api/quizzes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          categoryId: newCategory,
          language: newLanguage,
          difficulty: newDifficulty,
          questions: manualQuestions
        })
      });
      
      const data = await res.json();
      onAddQuiz(data.quiz);
      onRefreshQuizzes();
      
      // Reset
      setNewTitle("");
      setNewDescription("");
      setManualQuestions([{ text: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }]);
      alert("Manual mock assessment added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz");
    }
  };

  const handleTriggerAIGenerator = async () => {
    setAiGenerating(true);
    setAiSuccessMessage("");
    
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          language: aiLanguage,
          categoryId: aiCategory
        })
      });
      
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      onAddQuiz(data.quiz);
      onRefreshQuizzes();
      setAiSuccessMessage(`Successfully generated and published: "${data.quiz.title}" with 5 realistic questions!`);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate AI quiz: " + (err.message || "Make sure process.env.GEMINI_API_KEY is configured correctly."));
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType
        })
      });
      setNotifTitle("");
      setNotifMessage("");
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 text-center">
          <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Console Gate</h2>
          <p className="text-slate-400 text-xs mt-1 mb-6">Enter credentials to manage mock exams, AI builders, and AdSense configurations.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ADMIN PASSWORD</label>
              <input
                required
                type="password"
                placeholder="Password (e.g., 'admin')"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Authenticate Access
            </button>
          </form>
          
          <p className="text-[10px] text-slate-400 mt-4 font-mono">Use 'admin' or 'admin123' as default password.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 space-y-2">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 px-3">Control Deck</h3>
          
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "analytics" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BarChart2 className="w-4 h-4" /> System Analytics
          </button>
          
          <button
            onClick={() => setActiveTab("add-quiz")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "add-quiz" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Add Manual Quiz
          </button>
          
          <button
            onClick={() => setActiveTab("ai-generator")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "ai-generator" ? "bg-blue-600 text-white animate-pulse" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Quiz Generator
          </button>

          <button
            onClick={() => setActiveTab("current-affairs")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "current-affairs" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Database className="w-4 h-4" /> Current Affairs & RSS
          </button>
          
          <button
            onClick={() => setActiveTab("ads")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "ads" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Settings className="w-4 h-4" /> Adsense Controls
          </button>
          
          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "seo" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> SEO & Schemas
          </button>
          
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "notifications" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Broadcast Alerts
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="md:col-span-3">
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Government Quiz Analytics</h2>
              <p className="text-slate-400 text-xs">Live operational overview of mock papers, tests attempted, and databases.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">Live Quizzes</span>
                  <span className="text-xl font-bold text-slate-800">{quizzes.length}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">Total Questions</span>
                  <span className="text-xl font-bold text-slate-800">{quizzes.length * 5}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">AI-Generated</span>
                  <span className="text-xl font-bold text-slate-800">{quizzes.filter(q => q.id.includes("ai")).length}</span>
                </div>
              </div>

              {/* Massive Database Pre-Seeding Panel */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Automated Quiz Database Expansion</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg">
                    Instantly seed 20+ comprehensive mock exam quizzes with 100+ highly rigorous syllabus-aligned questions spanning 14 major categories in Hindi & English.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePreSeedDatabase}
                  disabled={seedingStatus !== ""}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer transition-all shrink-0 shadow-md shadow-indigo-600/10 active:scale-95 disabled:opacity-50"
                >
                  {seedingStatus || "Seed 20+ Mocks Now"}
                </button>
              </div>

              {/* QA Quality Check & Auto-Repair Panel */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-green-500/5 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Database QA Quality Check & Auto-Repair</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-lg">
                    Scans all quizzes for question-option mismatches, duplicate records, language consistency, and corrupt answer indices. Automatically repairs them or replaces them with fresh AI mock papers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRepairDatabase}
                  disabled={repairingStatus !== ""}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer transition-all shrink-0 shadow-md shadow-emerald-600/10 active:scale-95 disabled:opacity-50"
                >
                  {repairingStatus || "Run QA & Repair"}
                </button>
              </div>
            </div>

            {/* List of quizzes with delete capability */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Active Test Library</h3>
                <button onClick={onRefreshQuizzes} className="text-xs text-blue-600 font-semibold inline-flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> Reload
                </button>
              </div>
              
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-2">
                {quizzes.map(q => (
                  <div key={q.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">{q.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {q.id} | {q.language}</span>
                    </div>
                    <button
                      onClick={() => {
                        if(confirm(`Are you sure you want to delete "${q.title}"?`)) {
                          onDeleteQuiz(q.id);
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "add-quiz" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Manual Mock Exam Architect</h2>
            
            <form onSubmit={handleSaveManualQuiz} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">MOCK ASSESSMENT TITLE</label>
                  <input required type="text" placeholder="e.g. SSC CGL Polity Practice Set" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">DESCRIPTION</label>
                  <input required type="text" placeholder="e.g. Master Indian Parliament questions with visual analytics" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">CATEGORY</label>
                  <select value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none">
                    <option value="ssc">SSC Exams</option>
                    <option value="current-affairs">Current Affairs</option>
                    <option value="railway">Railway</option>
                    <option value="gk">General GK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">LANGUAGE</label>
                  <select value={newLanguage} onChange={(e)=>setNewLanguage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">DIFFICULTY</label>
                  <select value={newDifficulty} onChange={(e)=>setNewDifficulty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-6">
                <h3 className="font-bold text-slate-800 text-sm">Assessment Questions ({manualQuestions.length})</h3>
                {manualQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <span className="font-mono text-[10px] text-slate-400 font-bold block">QUESTION CARD #{idx + 1}</span>
                    <input required type="text" placeholder="Enter Question statement..." value={q.text} onChange={(e)=>handleManualQuestionChange(idx, "text", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs" />
                    
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt: string, oIdx: number) => (
                        <input key={oIdx} required type="text" placeholder={`Option ${String.fromCharCode(65+oIdx)}`} value={opt} onChange={(e)=>handleManualOptionChange(idx, oIdx, e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs" />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">CORRECT OPTION KEY</label>
                        <select value={q.correctOptionIndex} onChange={(e)=>handleManualQuestionChange(idx, "correctOptionIndex", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs">
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">DETAILED ANALYSIS EXPLANATION</label>
                        <input required type="text" placeholder="Explain why option is correct..." value={q.explanation} onChange={(e)=>handleManualQuestionChange(idx, "explanation", e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs" />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={handleAddManualQuestion} className="text-xs text-blue-600 font-bold border border-blue-200 hover:bg-blue-50/50 px-4 py-2 rounded-xl transition-colors cursor-pointer">
                  + Add Question Card
                </button>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-2xl text-xs cursor-pointer shadow-sm">
                Publish Custom Mock Test
              </button>
            </form>
          </div>
        )}

        {activeTab === "ai-generator" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Sparkles className="text-purple-600 w-5 h-5" /> AI Automated Quiz Generator
              </h2>
              <p className="text-slate-400 text-xs mt-1">Generate complete highly competitive government quizzes with custom meta keys using Google Gemini 3.5.</p>
            </div>

            {aiSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex gap-2 items-center">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">TARGET SYLLABUS TOPIC OR NOTIFICATION</label>
                <input
                  type="text"
                  placeholder="e.g., General GK of Indian Parliament OR G20 Summit highlights"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Specify official notification syllabus concepts (e.g., RRB Science).</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">ASSIGN CATEGORY</label>
                  <select value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none">
                    <option value="ssc">SSC Exams</option>
                    <option value="current-affairs">Current Affairs</option>
                    <option value="railway">Railway</option>
                    <option value="gk">General GK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">TARGET LANGUAGE</label>
                  <select value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी में प्रश्नोत्तरी)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">DIFFICULTY LEVEL</label>
                  <select value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleTriggerAIGenerator}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded-2xl text-xs transition-opacity cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Syllabus & Structuring Quiz via Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Autogenerate & Publish Unique Mock Test
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "current-affairs" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Database className="text-blue-600 w-5 h-5" /> Current Affairs Automation & RSS Pipeline
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Manage background updates, monitor PIB/RSS news integrations, apply strict 7-day publication constraints, and trigger AI-driven MCQ quiz set generation.
              </p>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">AUTOMATION STATUS</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {caStats?.automationStatus || "Active"}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">LAST SUCCESSFUL UPDATE</span>
                  <span className="text-xs font-extrabold text-slate-800 truncate block max-w-[150px]">
                    {caStats?.lastSuccessfulUpdate ? new Date(caStats.lastSuccessfulUpdate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + " (" + new Date(caStats.lastSuccessfulUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ")" : "Never"}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">LAST FAILED UPDATE</span>
                  <span className="text-xs font-extrabold text-slate-800 truncate block max-w-[150px]">
                    {caStats?.lastFailedUpdate ? new Date(caStats.lastFailedUpdate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + " (" + new Date(caStats.lastFailedUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ")" : "No failures"}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">GENERATED TODAY</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {caStats?.questionsGeneratedToday ?? 0} Questions
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">NEXT SCHEDULED RUN</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {caStats?.nextScheduledRun || "05:00 AM IST"}
                  </span>
                </div>
              </div>
            </div>

            {/* RSS & 7-Day Rule Segment */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                    <Zap className="text-amber-500 w-5 h-5" /> Government News RSS to Hindi Quiz Set
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Connects directly to PIB and central government notification RSS feeds, filters items against the 7-day publication rule, and guides Gemini to generate a special 5-question mock test.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerRssPipeline}
                  disabled={rssLoading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  {rssLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching & Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Trigger RSS 7-Day Rule Pipeline
                    </>
                  )}
                </button>
              </div>

              {/* RSS Run Report Output */}
              {rssResult && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider font-mono">RSS Execution Report & Audit Log</h4>
                  
                  {/* Validation stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">TOTAL RSS ENTRIES</span>
                      <span className="text-base font-extrabold text-slate-800">{rssResult.validation.totalFetched}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-emerald-500 block text-[10px]">PASSED 7-DAY RULE</span>
                      <span className="text-base font-extrabold text-emerald-600">{rssResult.validation.keptCount}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-rose-500 block text-[10px]">DISCARDED ITEMS</span>
                      <span className="text-base font-extrabold text-rose-600">{rssResult.validation.discardedCount}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-indigo-500 block text-[10px]">GENERATED QUIZ ID</span>
                      <span className="text-[11px] font-mono font-bold text-slate-800 truncate block">{rssResult.quiz.id}</span>
                    </div>
                  </div>

                  {/* Created Quiz details */}
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs space-y-1 text-left">
                    <span className="text-emerald-800 font-bold block">🎉 Success: New Quiz Created and Published!</span>
                    <span className="text-emerald-700 block font-semibold">{rssResult.quiz.title} ({rssResult.quiz.questionsCount} Questions)</span>
                    <span className="text-slate-500 block text-[11px] italic">{rssResult.quiz.description}</span>
                  </div>

                  {/* Validation details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* Kept */}
                    <div className="space-y-2">
                      <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider block">Kept (Under 7 Days):</span>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                        {rssResult.validation.keptItems && rssResult.validation.keptItems.length > 0 ? (
                          rssResult.validation.keptItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-100 text-[11px]">
                              <span className="font-semibold text-slate-800 block line-clamp-1">{item.title}</span>
                              <span className="text-slate-400 font-mono text-[9px] block mt-0.5">Published: {item.pubDate}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic block p-2">None passed. Fallback context triggered.</span>
                        )}
                      </div>
                    </div>

                    {/* Discarded */}
                    <div className="space-y-2">
                      <span className="text-rose-500 font-bold text-[10px] uppercase tracking-wider block">Discarded (Exceeded 7-day limit / Invalid):</span>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                        {rssResult.validation.discardedItems && rssResult.validation.discardedItems.length > 0 ? (
                          rssResult.validation.discardedItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-100 text-[11px]">
                              <span className="font-semibold text-slate-400 block line-clamp-1">{item.title}</span>
                              <span className="text-rose-500 font-semibold text-[9px] block mt-0.5 font-mono">Reason: {item.reason}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic block p-2">No items discarded.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Government Exam Jobs (Sarkari Naukri) RSS Sync */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                    <Briefcase className="text-violet-500 w-5 h-5" /> Government Exam Jobs (Sarkari Naukri) RSS Sync
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Fetches central and state government jobs alerts and notification news in Hindi directly from the jobs RSS feed, applying the strict 7-day publication rule.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerJobsSync}
                  disabled={jobsSyncLoading}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  {jobsSyncLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing Government Jobs...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Trigger Jobs 7-Day Sync
                    </>
                  )}
                </button>
              </div>

              {/* Jobs Sync Report Output */}
              {jobsSyncResult && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider font-mono">Jobs Sync Report & Audit Log</h4>
                  
                  {/* Validation stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">TOTAL JOBS FETCHED</span>
                      <span className="text-base font-extrabold text-slate-800">{jobsSyncResult.stats.totalFetched}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-emerald-500 block text-[10px]">PASSED 7-DAY RULE</span>
                      <span className="text-base font-extrabold text-emerald-600">{jobsSyncResult.stats.passed7DayRule}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-rose-500 block text-[10px]">DISCARDED ITEMS</span>
                      <span className="text-base font-extrabold text-rose-600">{jobsSyncResult.stats.discardedCount}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-violet-500 block text-[10px]">NEW UNIQUE STORED</span>
                      <span className="text-base font-extrabold text-violet-600">{jobsSyncResult.stats.newlyStoredUniqueCount}</span>
                    </div>
                  </div>

                  {/* Stored jobs summary list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* Kept/Stored */}
                    <div className="space-y-2">
                      <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider block">Stored Unique Jobs (Under 7 Days):</span>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                        {jobsSyncResult.storedItems && jobsSyncResult.storedItems.length > 0 ? (
                          jobsSyncResult.storedItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-100 text-[11px]">
                              <span className="font-semibold text-slate-800 block line-clamp-1">{item.title}</span>
                              <span className="text-slate-400 font-mono text-[9px] block mt-0.5">Published: {item.date}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic block p-2">No new unique items stored (they may already exist).</span>
                        )}
                      </div>
                    </div>

                    {/* Discarded */}
                    <div className="space-y-2">
                      <span className="text-rose-500 font-bold text-[10px] uppercase tracking-wider block">Discarded (Exceeded 7-day limit):</span>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                        {jobsSyncResult.discardedItems && jobsSyncResult.discardedItems.length > 0 ? (
                          jobsSyncResult.discardedItems.map((item: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-100 text-[11px]">
                              <span className="font-semibold text-slate-400 block line-clamp-1">{item.title}</span>
                              <span className="text-rose-500 font-semibold text-[9px] block mt-0.5 font-mono">Reason: {item.reason}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic block p-2">No items discarded.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Current Affairs Automation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Standard Current Affairs Automated Generator</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Triggers the standard full pipeline to search Google News and generate all 5 categories of quizzes (Daily, Practice, Mock, Weekly, Monthly) containing 120+ Hindi MCQs.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTriggerCAPipeline}
                disabled={caTriggering}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                {caTriggering ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Executing 120-Q Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Execute Standard Current Affairs Pipeline
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">AdSense Monetization Deck</h2>
            
            <div className="p-4 rounded-xl bg-blue-50 text-blue-800 text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Ad units are auto-formatted using responsive HTML tags. Toggle standard placeholder zones below to preview live manual placements.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-700">
                <span>Google AdSense Status</span>
                <button
                  onClick={() => setAdSenseEnabled(!adSenseEnabled)}
                  className={`px-3 py-1 rounded-full border text-[10px] ${adSenseEnabled ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200"}`}
                >
                  {adSenseEnabled ? "● Active" : "Disabled"}
                </button>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-700">
                <span>Header Leaderboard Ad (728x90)</span>
                <button onClick={() => setAdPlacementHeader(!adPlacementHeader)} className="text-blue-600">
                  {adPlacementHeader ? "Show Placeholders" : "Hidden"}
                </button>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-700">
                <span>Sidebar Banner Ad (300x250)</span>
                <button onClick={() => setAdPlacementSidebar(!adPlacementSidebar)} className="text-blue-600">
                  {adPlacementSidebar ? "Show Placeholders" : "Hidden"}
                </button>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 text-xs font-semibold text-slate-700">
                <span>In-Content Responsive Ads</span>
                <button onClick={() => setAdPlacementInContent(!adPlacementInContent)} className="text-blue-600">
                  {adPlacementInContent ? "Show Placeholders" : "Hidden"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">SEO Indexing & Metadata Schemas</h2>
            
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 block uppercase">SEO Friendly URL Engine</span>
                <p className="text-slate-600">URLs are compiled dynamically based on exam title parameters (e.g. `/quiz/ssc-gd-constable-2026`).</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 block uppercase">JSON-LD Schema Markup status</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-500">
                  <li>BreadcrumbList: active</li>
                  <li>FAQPage schema: active</li>
                  <li>Assessment/Quiz schema: validated on all dynamic generated sets</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 block uppercase">Sitemap.xml & Robots.txt status</span>
                <p className="text-slate-600">{sitemapStatus}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Broadcast System Notice Alerts</h2>
            
            {notifSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl mb-4">
                ✓ Alert successfully published to sticky notification tray.
              </div>
            )}

            <form onSubmit={handlePublishNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">ALERT TITLE</label>
                <input required type="text" placeholder="e.g. UPSC CSE Application Deadline Extended" value={notifTitle} onChange={(e)=>setNotifTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">ALERT SUMMARY MESSAGE</label>
                <textarea required rows={2} placeholder="Write brief message content..." value={notifMessage} onChange={(e)=>setNotifMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">ALERT TYPE</label>
                  <select value={notifType} onChange={(e)=>setNotifType(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none">
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="alert">Alert/Red (Rose)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer">
                Publish system alert notification
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
