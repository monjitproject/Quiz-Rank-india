/**
 * QuizRank India - Daily Current Affairs Portal (Dynamic Hindi Rebuild)
 * Real-time automated data retrieval, 5 distinct mock test tiers, and direct quiz execution.
 */

import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Bell, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  BookOpen, 
  Award, 
  RefreshCw, 
  Zap, 
  Cpu, 
  Database, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clock 
} from "lucide-react";

interface NewsQuizItem {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  attemptsCount: number;
  difficulty: string;
  tags: string[];
}

interface CurrentAffairsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  source: string;
  category: string;
}

interface CurrentAffairsStats {
  questionsGeneratedToday: number;
  questionsPublished: number;
  questionsRejected: number;
  duplicateCount: number;
  latestUpdateTime: string;
  automationStatus: string;
  cronJobStatus: string;
  lastRunSlots: string[];
}

interface DailyCurrentAffairsProps {
  onSelectCategory: (catId: string | null) => void;
  onSelectQuiz: (quizId: string) => void;
}

export function DailyCurrentAffairs({ onSelectCategory, onSelectQuiz }: DailyCurrentAffairsProps) {
  const [quizzes, setQuizzes] = useState<NewsQuizItem[]>([]);
  const [events, setEvents] = useState<CurrentAffairsEvent[]>([]);
  const [stats, setStats] = useState<CurrentAffairsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"quizzes" | "news">("quizzes");
  
  // WhatsApp notification subscriber state
  const [inputValue, setInputValue] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const fetchCurrentAffairsData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, eventsRes, statsRes] = await Promise.all([
        fetch("/api/quizzes"),
        fetch("/api/current-affairs/events"),
        fetch("/api/current-affairs/stats")
      ]);

      const quizzesData = await quizzesRes.json();
      const eventsData = await eventsRes.json();
      const statsData = await statsRes.json();

      // Filter only current affairs quizzes
      const caQuizzes = quizzesData.filter((q: any) => q.categoryId === "current-affairs");
      setQuizzes(caQuizzes);
      setEvents(eventsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching current affairs data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAffairsData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSubscribed(true);
      setInputValue("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleTriggerPipeline = async () => {
    try {
      setTriggering(true);
      const res = await fetch("/api/current-affairs/trigger", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        await fetchCurrentAffairsData();
      }
    } catch (err) {
      console.error("Manual pipeline execution failed:", err);
    } finally {
      setTriggering(false);
    }
  };

  // Classify quizzes for home page widgets
  const todaysQuizzes = quizzes.filter(q => q.title.includes("दैनिक") || q.title.toLowerCase().includes("daily"));
  const weeklyQuizzes = quizzes.filter(q => q.title.includes("साप्ताहिक") || q.title.toLowerCase().includes("weekly"));
  const monthlyQuizzes = quizzes.filter(q => q.title.includes("मासिक") || q.title.toLowerCase().includes("monthly"));
  const mockQuizzes = quizzes.filter(q => q.title.includes("मॉक") || q.title.toLowerCase().includes("mock"));
  const practiceQuizzes = quizzes.filter(q => q.title.includes("अभ्यास") || q.title.toLowerCase().includes("practice"));

  // Find trending and recent updates
  const trendingQuizzes = [...quizzes].sort((a, b) => b.attemptsCount - a.attemptsCount).slice(0, 3);
  const recentUpdates = [...quizzes].slice(0, 4);

  return (
    <section id="daily-current-affairs-section" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Dynamic Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-400" /> दैनिक समसामयिकी (HINDI DAILY CA)
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
            स्वचालित समसामयिकी केंद्र
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            PIB, सरकारी योजनाओं, बजट एवं राष्ट्रीय घटनाक्रमों पर आधारित 100% शुद्ध हिंदी दैनिक क्विज़ सेट।
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveSubTab("quizzes")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              activeSubTab === "quizzes" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📋 CA मॉक टेस्ट सेट ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveSubTab("news")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              activeSubTab === "news" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📰 मुख्य समाचार फीड ({events.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Interactive Sub-view */}
        <div className="lg:col-span-8 space-y-6">
          
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-slate-500 text-xs font-bold font-mono">नवीनतम समसामयिकी डाटा लोड हो रहा है...</p>
            </div>
          ) : activeSubTab === "quizzes" ? (
            <div className="space-y-6">
              
              {/* Core Quiz Widgets Container */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                
                {/* 1. Today's Current Affairs Quiz Widget */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Today's Current Affairs Quiz (दैनिक क्विज़)
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                      10 MCQs
                    </span>
                  </div>

                  {todaysQuizzes.length > 0 ? (
                    <div className="space-y-3">
                      {todaysQuizzes.slice(0, 1).map(q => (
                        <div key={q.id} className="p-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/20 border border-indigo-100/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-900 text-sm">{q.title}</h4>
                            <p className="text-slate-500 text-xs line-clamp-1">{q.description}</p>
                            <span className="text-[10px] font-semibold text-slate-400 font-mono block">
                              🔥 {q.attemptsCount.toLocaleString()}+ अभ्यर्थियों द्वारा हल किया गया
                            </span>
                          </div>
                          <button
                            onClick={() => onSelectQuiz(q.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl cursor-pointer active:scale-95 transition-all shrink-0 inline-flex items-center gap-1 shadow-sm"
                          >
                            हल करें <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">आज का दैनिक क्विज़ तैयार किया जा रहा है।</p>
                  )}
                </div>

                {/* 2. Categorized Tabs (Weekly & Monthly Current Affairs Quizzes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Weekly Booster */}
                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block">
                      Weekly CA (साप्ताहिक बूस्टर)
                    </span>
                    {weeklyQuizzes.length > 0 ? (
                      <div className="space-y-2">
                        {weeklyQuizzes.slice(0, 1).map(q => (
                          <div key={q.id} className="space-y-2">
                            <h5 className="font-black text-slate-800 text-xs line-clamp-2">{q.title}</h5>
                            <button
                              onClick={() => onSelectQuiz(q.id)}
                              className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[10px] py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                            >
                              25 MCQs शुरू करें <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">साप्ताहिक क्विज़ पाइपलाइन सक्रिय है।</p>
                    )}
                  </div>

                  {/* Monthly Master */}
                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3">
                    <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 inline-block">
                      Monthly CA (मासिक संग्रह)
                    </span>
                    {monthlyQuizzes.length > 0 ? (
                      <div className="space-y-2">
                        {monthlyQuizzes.slice(0, 1).map(q => (
                          <div key={q.id} className="space-y-2">
                            <h5 className="font-black text-slate-800 text-xs line-clamp-2">{q.title}</h5>
                            <button
                              onClick={() => onSelectQuiz(q.id)}
                              className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[10px] py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                            >
                              50 MCQs मास्टर सेट <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic">मासिक क्विज़ पाइपलाइन सक्रिय है।</p>
                    )}
                  </div>

                </div>

                {/* 3. National Mock & Practice Sets Widget */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
                    <Award className="w-4 h-4 text-blue-600" /> Exam Mock Test & Practice Set
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Mock Test */}
                    {mockQuizzes.slice(0, 1).map(q => (
                      <div key={q.id} className="p-3 bg-indigo-50/30 border border-indigo-100/30 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h6 className="font-extrabold text-xs text-slate-900 truncate">{q.title}</h6>
                          <span className="text-[9px] text-slate-500 font-mono">20 MCQs • Time: 15 Mins</span>
                        </div>
                        <button
                          onClick={() => onSelectQuiz(q.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] px-3 py-1.5 rounded-lg transition-all"
                        >
                          हल करें
                        </button>
                      </div>
                    ))}

                    {/* Practice Set */}
                    {practiceQuizzes.slice(0, 1).map(q => (
                      <div key={q.id} className="p-3 bg-indigo-50/30 border border-indigo-100/30 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h6 className="font-extrabold text-xs text-slate-900 truncate">{q.title}</h6>
                          <span className="text-[9px] text-slate-500 font-mono">15 MCQs • Time: 10 Mins</span>
                        </div>
                        <button
                          onClick={() => onSelectQuiz(q.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] px-3 py-1.5 rounded-lg transition-all"
                        >
                          हल करें
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Recent Updates List (Remaining generated quizzes) */}
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3">
                    RECENTLY COMPLETED HINDI MOCK SERIES
                  </span>
                  <div className="divide-y divide-slate-50">
                    {recentUpdates.slice(2, 6).map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-800 truncate">{item.title}</h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold text-slate-400 font-mono">
                              {item.questionsCount} Standard MCQs
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[9px] font-bold text-indigo-600">
                              {item.attemptsCount.toLocaleString()}+ Solve
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectQuiz(item.id)}
                          className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          Start Test
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Trending Current Affairs Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Trending Current Affairs (सर्वाधिक लोकप्रिय)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trendingQuizzes.map((q) => (
                    <div 
                      key={q.id} 
                      onClick={() => onSelectQuiz(q.id)}
                      className="bg-white hover:bg-indigo-50/20 border border-slate-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <h5 className="font-black text-slate-800 text-xs line-clamp-2 leading-snug">{q.title}</h5>
                        <p className="text-slate-400 text-[10px] line-clamp-2">{q.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[10px] font-bold font-mono">
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                          {q.questionsCount} Qs
                        </span>
                        <span className="text-slate-400">
                          {q.attemptsCount.toLocaleString()}+ Solved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // News events stream accordion view
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Daily News Stream (सत्यापित सरकारी समाचार)
                </span>
                <span className="text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  PIB / GOVERNMENT INDEX
                </span>
              </div>

              {events.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {events.map((evt) => {
                    const isExpanded = expandedEvent === evt.id;
                    return (
                      <div key={evt.id} className="py-4 first:pt-0 last:pb-0">
                        <div 
                          className="flex items-start justify-between gap-4 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => setExpandedEvent(isExpanded ? null : evt.id)}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-0.5 rounded">
                                {evt.category}
                              </span>
                              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded">
                                {evt.source}
                              </span>
                              <span className="text-slate-400 text-[9px] font-mono">{evt.date}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug">
                              {evt.title}
                            </h4>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 shrink-0 p-1 mt-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-xs leading-relaxed space-y-3">
                            <p>{evt.description}</p>
                            <div className="pt-2 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold">
                              <span className="text-slate-400">स्रोत संदर्भ: {evt.source}</span>
                              <button 
                                onClick={handleSolveClick}
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                              >
                                संबंधित प्रश्न हल करें <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <Database className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>कोई समसामयिकी समाचार रिकॉर्ड उपलब्ध नहीं है।</p>
                </div>
              )}
            </div>
          )}
          
        </div>

        {/* Right Column: Control Deck & WhatsApp alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          
          {/* Real-time Automation Control Deck & System Metrics */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 border border-indigo-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" /> AI Automation Deck
              </span>
              <span className="font-mono text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase shrink-0 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/50">
                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">QUESTIONS TODAY</span>
                <span className="text-slate-800 text-sm font-black font-mono">
                  {stats?.questionsGeneratedToday || 0}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/50">
                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">PUBLISHED (100%)</span>
                <span className="text-emerald-700 text-sm font-black font-mono">
                  {stats?.questionsPublished || 0}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/50">
                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">REJECTED OLD</span>
                <span className="text-rose-600 text-sm font-black font-mono">
                  {stats?.questionsRejected || 0}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/50">
                <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">DUPLICATE COUTS</span>
                <span className="text-amber-600 text-sm font-black font-mono">
                  {stats?.duplicateCount || 0}
                </span>
              </div>
            </div>

            {/* Automation health checklist */}
            <div className="space-y-1.5 pt-2 border-t border-indigo-100/50 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scheduler: Active (05:00, 10:00, 16:00, 21:00 IST)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Date Verification: Reject events &gt; 7 days old</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pure Devanagari Hindi Alignment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Anti-Duplicate filter: Checked against active DB</span>
              </div>
            </div>

            {/* Manual Trigger Button */}
            <button
              onClick={handleTriggerPipeline}
              disabled={triggering}
              className={`w-full text-white font-extrabold text-[11px] py-2.5 rounded-xl cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                triggering 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${triggering ? "animate-spin" : ""}`} />
              {triggering ? "पाइपलाइन निष्पादित हो रही है..." : "पाइपलाइन मैन्युअल रूप से चलाएं"}
            </button>
            <span className="text-[9px] font-bold text-slate-400 block text-center mt-1 font-mono">
              अंतिम अपडेट: {stats?.latestUpdateTime ? new Date(stats.latestUpdateTime).toLocaleTimeString() : "Pending"}
            </span>
          </div>

          {/* WhatsApp Alert Subscription box */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" /> WhatsApp Job & CA Alerts
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
                नवीनतम परीक्षाओं के अपडेट, समय सारिणी, परिणाम और दैनिक समसामयिकी क्विज़ के नोटिफिकेशन सीधे व्हाट्सऐप पर पाएं।
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="अपना व्हाट्सऐप नंबर या ईमेल डालें"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-white text-slate-300 focus:text-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none placeholder:text-slate-500 font-medium transition-all"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                {subscribed ? "Alerts Registered! 📱" : "Get Job Alerts Free"}
              </button>
            </form>

            <div className="flex items-center gap-1 text-[9px] text-slate-500 pt-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>100% सुरक्षित कैंडिडेट डेटाबेस</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );

  function handleSolveClick() {
    setActiveSubTab("quizzes");
  }
}
