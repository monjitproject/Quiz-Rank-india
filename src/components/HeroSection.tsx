/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Sparkles, Trophy, BookOpen, Clock, Play, 
  GraduationCap, X, Mic, History, ArrowRight, Star,
  TrendingUp, Zap, HelpCircle, Flame, Check, CheckCircle2,
  Award, Filter, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Quiz } from "../types";

interface HeroSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  totalAttempts: number;
  totalQuizzes: number;
  quizzes?: Quiz[];
  onSelectQuiz?: (quizId: string) => void;
}

export function HeroSection({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  totalAttempts, 
  totalQuizzes,
  quizzes = [],
  onSelectQuiz
}: HeroSectionProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState("");
  const [dropdownDifficulty, setDropdownDifficulty] = useState<string | null>(null);
  const [dropdownLanguage, setDropdownLanguage] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("quizrank_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        setRecentSearches([]);
      }
    } else {
      // Pre-seed some engaging mock terms
      setRecentSearches(["SSC GD Mock #1", "UPSC Civil Services", "Hindi Practice Set"]);
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim();
    const updated = [cleanQuery, ...recentSearches.filter(q => q !== cleanQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("quizrank_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(q => q !== query);
    setRecentSearches(updated);
    localStorage.setItem("quizrank_recent_searches", JSON.stringify(updated));
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete suggestions generator for simulated virtual tests (1-500)
  const getVirtualSuggestions = (query: string) => {
    const numMatch = query.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : null;
    
    const matches: Array<Quiz & { isVirtual: boolean }> = [];

    if (num && num >= 1 && num <= 500) {
      categories.forEach(cat => {
        const catKeywords = [cat.id.toLowerCase(), cat.name.toLowerCase(), ...(cat.id === "ssc" ? ["ssc", "gd", "cgl"] : cat.id === "gk" ? ["gk", "general knowledge"] : [])];
        const hasKeywordMatch = catKeywords.some(kw => query.toLowerCase().includes(kw)) || query.length < 5;
        
        if (hasKeywordMatch) {
          const isEasy = num % 3 === 1;
          const isHard = num % 3 === 0;
          const difficulty = isHard ? "Hard" : isEasy ? "Easy" : "Medium";
          const duration = isEasy ? 10 : isHard ? 20 : 15;
          const language = cat.id === "ssc" || cat.id === "banking" || cat.id === "engineering" ? "English" : "Hindi";

          // Parse corresponding enum values
          const diffEnum = difficulty === "Easy" ? 0 : difficulty === "Medium" ? 1 : 2; // matches Difficulty enum
          const langEnum = language === "English" ? 0 : 1; // matches Language enum

          matches.push({
            id: `virtual-${cat.id}-${num}`,
            title: `${cat.name} Full Mock Test #${num}`,
            description: `Simulated mock test series #${num} covering latest board syllabus framework, standard weightage pattern and mock analytics.`,
            categoryId: cat.id,
            durationMinutes: duration,
            difficulty: difficulty as any,
            language: language as any,
            questionsCount: 10,
            attemptsCount: 2400 + (num * 12),
            rating: parseFloat((4.5 + (num % 5) * 0.1).toFixed(1)),
            tags: [cat.id.toUpperCase(), `Mock #${num}`],
            isVirtual: true
          });
        }
      });
    }

    return matches;
  };

  // Filter categories and quizzes based on user input
  const matchedCategories = localSearch.trim()
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        cat.description.toLowerCase().includes(localSearch.toLowerCase())
      )
    : [];

  const matchedStaticQuizzes = localSearch.trim()
    ? quizzes.filter(q => 
        q.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        q.description.toLowerCase().includes(localSearch.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(localSearch.toLowerCase()))
      )
    : [];

  const matchedVirtualQuizzes = localSearch.trim() ? getVirtualSuggestions(localSearch) : [];
  const allMatchedQuizzes = [...matchedStaticQuizzes, ...matchedVirtualQuizzes];

  // Apply filters inside search dropdown
  const filteredMatchedQuizzes = allMatchedQuizzes.filter(q => {
    const matchDiff = !dropdownDifficulty || q.difficulty === dropdownDifficulty;
    const matchLang = !dropdownLanguage || q.language.toLowerCase().includes(dropdownLanguage.toLowerCase());
    return matchDiff && matchLang;
  });

  // Flat list for seamless keyboard navigation
  const suggestionsList: Array<
    | { type: "recent"; value: string }
    | { type: "trending"; value: string }
    | { type: "category"; id: string; name: string }
    | { type: "quiz"; id: string; title: string; categoryId: string; difficulty: string; durationMinutes: number; language: string }
  > = [];

  if (!localSearch.trim()) {
    recentSearches.forEach(q => suggestionsList.push({ type: "recent", value: q }));
    ["SSC GD Mock #1", "UPSC Civil Services", "Hindi Daily Quiz", "Current Affairs 2026"].forEach(t => {
      if (!recentSearches.includes(t)) {
        suggestionsList.push({ type: "trending", value: t });
      }
    });
  } else {
    matchedCategories.slice(0, 2).forEach(c => suggestionsList.push({ type: "category", id: c.id, name: c.name }));
    filteredMatchedQuizzes.slice(0, 5).forEach(q => suggestionsList.push({ 
      type: "quiz", 
      id: q.id, 
      title: q.title, 
      categoryId: q.categoryId,
      difficulty: q.difficulty, 
      durationMinutes: q.durationMinutes, 
      language: q.language 
    }));
  }

  const handleSelectCategoryMatch = (catId: string) => {
    onSelectCategory(catId);
    setLocalSearch("");
    setIsFocused(false);
    const element = document.getElementById("active-quizzes-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectQuizMatch = (quizId: string) => {
    if (onSelectQuiz) {
      saveRecentSearch(localSearch || "Mock Quiz");
      onSelectQuiz(quizId);
      setLocalSearch("");
      setIsFocused(false);
    }
  };

  const triggerActiveSelection = () => {
    if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestionsList.length) {
      const item = suggestionsList[activeSuggestionIndex];
      if (item.type === "recent" || item.type === "trending") {
        setLocalSearch(item.value);
        saveRecentSearch(item.value);
        setActiveSuggestionIndex(-1);
      } else if (item.type === "category") {
        handleSelectCategoryMatch(item.id);
      } else if (item.type === "quiz") {
        handleSelectQuizMatch(item.id);
      }
    } else {
      // Trigger default submit scrolling
      const quizGrid = document.getElementById("active-quizzes-section");
      if (quizGrid) {
        quizGrid.scrollIntoView({ behavior: "smooth" });
      }
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestionsList.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      triggerActiveSelection();
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRecentSearch(localSearch);
    const quizGrid = document.getElementById("active-quizzes-section");
    if (quizGrid) {
      quizGrid.scrollIntoView({ behavior: "smooth" });
    }
    setIsFocused(false);
  };

  // Voice simulation
  const triggerVoiceSimulation = () => {
    if (isListening) return;
    setIsListening(true);
    setListeningText("Listening to voice query...");
    
    const sampleQueries = [
      "SSC GD Full Mock #45",
      "UPSC Civil Services #12",
      "Hindi Vocabulary Drill",
      "Railway Board Practice Set",
      "Current Affairs 2026",
      "Banking Quantitative Quiz"
    ];
    
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    
    setTimeout(() => {
      setListeningText(`Matched: "${randomQuery}"`);
      setTimeout(() => {
        setLocalSearch("");
        let i = 0;
        const interval = setInterval(() => {
          if (i < randomQuery.length) {
            setLocalSearch(prev => prev + randomQuery[i]);
            i++;
          } else {
            clearInterval(interval);
            setIsListening(false);
            saveRecentSearch(randomQuery);
            // Auto open suggestions
            setIsFocused(true);
          }
        }, 50);
      }, 800);
    }, 1500);
  };

  // Text highlight function
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const cleanQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${cleanQuery})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-blue-100 text-blue-700 font-bold rounded-xs px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-700 text-white py-16 md:py-24 px-4 shadow-inner">
      {/* Scattered Glassy Floating Emotive Badges */}
      <div className="absolute top-12 left-[10%] animate-bounce duration-1000 text-3xl select-none opacity-40">📝</div>
      <div className="absolute top-32 right-[8%] animate-pulse text-3xl select-none opacity-40">🏆</div>
      <div className="absolute bottom-20 left-[6%] text-3.5xl select-none opacity-40">🎯</div>
      <div className="absolute bottom-16 right-[12%] animate-bounce duration-[2s] text-3xl select-none opacity-40">📊</div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Top Centered Badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-blue-200 font-extrabold text-xs tracking-wider uppercase shadow-md cursor-default transition-all">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" /> Daily Updated Quizzes — India's #1 Govt Exam Portal
        </div>

        {/* Display Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] font-sans">
            Practice Govt Exam <br className="hidden sm:inline" />
            <span className="text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-200 bg-clip-text drop-shadow-sm font-sans">
              Questions Daily
            </span>
          </h1>
          <p className="text-slate-100/90 text-sm md:text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            Latest Government Exam Quizzes Updated Every Day. SSC, UPSC, Railway, Banking, Police & 150+ Exams.
            <span className="block text-amber-200 mt-1 font-extrabold">Practice Smart. Rank Higher. Get Selected.</span>
          </p>
        </div>

        {/* Smart Search Engine Form Wrapper */}
        <div ref={searchRef} className="max-w-xl mx-auto relative">
          
          <form 
            onSubmit={handleSearchSubmit} 
            className="relative bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl flex items-center transition-all focus-within:ring-4 focus-within:ring-blue-500/30 focus-within:border-white/40 focus-within:bg-white/15"
          >
            <div className="flex-1 relative flex items-center pl-4">
              <Search className="w-4 h-4 text-white/60 shrink-0" />
              <input
                type="text"
                placeholder="Search mock exams (e.g. SSC GD, Hindi)..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setIsFocused(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-xs md:text-sm font-medium ml-2.5 pr-2"
              />
            </div>

            {/* Clear button */}
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  setActiveSuggestionIndex(-1);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice microphone simulator */}
            <button
              type="button"
              onClick={triggerVoiceSimulation}
              title="Voice Search Simulation"
              className={`p-2 rounded-full mr-1.5 relative transition-all ${
                isListening 
                  ? "bg-rose-500 text-white animate-pulse" 
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              } cursor-pointer`}
            >
              <Mic className="w-4 h-4" />
              {isListening && (
                <span className="absolute -inset-1 rounded-full border border-rose-500 animate-ping opacity-75" />
              )}
            </button>

            {/* Submit search button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black text-xs md:text-sm px-6 py-2.5 rounded-full shadow-md active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-3.5 h-3.5 stroke-[3px]" /> Search
            </button>
          </form>

          {/* Voice status toast overlay */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 text-white rounded-2xl px-4 py-3 text-xs font-bold shadow-2xl z-50 flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="font-mono text-left">{listeningText}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Suggestion Panel Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 text-left overflow-hidden flex flex-col"
              >
                {/* Search Header / Summary count */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                      {localSearch.trim() 
                        ? `Matches Found (${filteredMatchedQuizzes.length})` 
                        : "Discover High-Yield Exams"
                      }
                    </span>
                  </div>

                  {/* Filter pill indicators inside search bar */}
                  {localSearch.trim() && (
                    <div className="flex items-center gap-1">
                      {/* Difficulty Sub-menu pill */}
                      <select
                        value={dropdownDifficulty || ""}
                        onChange={(e) => setDropdownDifficulty(e.target.value || null)}
                        className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 border-none rounded-md py-1 px-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="">All Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>

                      {/* Language Sub-menu pill */}
                      <select
                        value={dropdownLanguage || ""}
                        onChange={(e) => setDropdownLanguage(e.target.value || null)}
                        className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 border-none rounded-md py-1 px-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="">All Lang</option>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  )}

                  {!localSearch.trim() && (
                    <span className="text-[10px] font-bold text-slate-400">
                      Auto-updates daily
                    </span>
                  )}
                </div>

                {/* Suggestions List */}
                <div className="max-h-[360px] overflow-y-auto space-y-3 scrollbar-none">
                  {suggestionsList.length === 0 ? (
                    <div className="text-center py-8">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500">No mock tests or categories match your search.</p>
                      <p className="text-[10px] text-slate-400 mt-1">Try searching for a test number like <strong className="text-slate-600">42</strong> or key terms like <strong className="text-slate-600">SSC, UPSC, Hindi</strong>.</p>
                    </div>
                  ) : (
                    suggestionsList.map((item, idx) => {
                      const isHighlighted = idx === activeSuggestionIndex;
                      
                      if (item.type === "recent" || item.type === "trending") {
                        return (
                          <div
                            key={`hist-${idx}`}
                            onClick={() => {
                              setLocalSearch(item.value);
                              saveRecentSearch(item.value);
                              setActiveSuggestionIndex(-1);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isHighlighted ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {item.type === "recent" ? (
                                <History className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <TrendingUp className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              )}
                              <span className="text-xs font-bold">{item.value}</span>
                            </div>

                            {item.type === "recent" && (
                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(e, item.value)}
                                className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (item.type === "category") {
                        const cat = categories.find(c => c.id === item.id);
                        return (
                          <div
                            key={`cat-${item.id}`}
                            onClick={() => handleSelectCategoryMatch(item.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                              isHighlighted ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 hover:bg-slate-100/70 border-transparent"
                            } border`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block text-xs font-black text-slate-900">
                                  {highlightMatch(item.name, localSearch)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Explore Category Directory</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">
                              Go <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        );
                      }

                      if (item.type === "quiz") {
                        const isVirtual = item.id.startsWith("virtual-");
                        return (
                          <div
                            key={`quiz-${item.id}`}
                            onClick={() => handleSelectQuizMatch(item.id)}
                            className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                              isHighlighted 
                                ? "bg-blue-50/70 border-blue-200" 
                                : "bg-white hover:bg-slate-50 border-slate-100"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${
                                  item.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                  item.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                  "bg-rose-50 text-rose-600 border-rose-100"
                                }`}>
                                  {item.difficulty}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase font-mono">{item.language}</span>
                                {isVirtual && (
                                  <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-1 rounded-sm border border-amber-100 inline-flex items-center gap-0.5">
                                    <Sparkles className="w-2 h-2 text-amber-500" /> Simulated
                                  </span>
                                )}
                              </div>

                              <span className="block text-xs font-extrabold text-slate-800 leading-tight">
                                {highlightMatch(item.title, localSearch)}
                              </span>
                              
                              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 font-mono">
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-slate-300" /> {item.durationMinutes} Mins
                                </span>
                                <span>• 10 MCQs</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectQuizMatch(item.id);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-xl inline-flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer transition-transform active:scale-95"
                            >
                              <Play className="w-2.5 h-2.5 fill-white" /> Start Practice
                            </button>
                          </div>
                        );
                      }

                      return null;
                    })
                  )}
                </div>

                {/* Surprise me random action */}
                <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">
                    💡 Tip: Keyboard arrow keys navigate, Enter starts quiz.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      // Select random quiz from available
                      const activePool = quizzes.length > 0 ? quizzes : [];
                      if (activePool.length > 0) {
                        const randomQuiz = activePool[Math.floor(Math.random() * activePool.length)];
                        handleSelectQuizMatch(randomQuiz.id);
                      } else {
                        handleSelectQuizMatch("virtual-gk-1");
                      }
                    }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase inline-flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100/70 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-bounce" /> Surprise Me Quiz
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Shortcut Exam Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-wider mr-1.5">Shortcuts:</span>
          <button
            onClick={() => {
              onSelectCategory(null);
              setTimeout(() => {
                const element = document.getElementById("active-quizzes-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
              selectedCategory === null
                ? "bg-white text-indigo-800 border-white font-black scale-105 shadow-md"
                : "bg-white/10 text-white border-white/10 hover:bg-white/25"
            }`}
          >
            All Exams
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setTimeout(() => {
                  const element = document.getElementById("active-quizzes-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-white text-indigo-800 border-white font-black scale-105 shadow-md"
                  : "bg-white/10 text-white border-white/10 hover:bg-white/25"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Visual CTA Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6">
          <button
            onClick={() => {
              onSelectCategory(null);
              setTimeout(() => {
                const element = document.getElementById("active-quizzes-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
            className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 hover:-translate-y-0.5 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer border border-amber-300"
          >
            <span>🚀</span> Start Quiz Now
          </button>
          <button
            onClick={() => {
              const sec = document.getElementById("popular-exams-section");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-white hover:-translate-y-0.5 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>📋</span> Mock Tests
          </button>
          <button
            onClick={() => {
              const sec = document.getElementById("daily-current-affairs-section");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-white hover:-translate-y-0.5 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>📅</span> Daily Quiz
          </button>
          <button
            onClick={() => {
              const sec = document.getElementById("daily-current-affairs-section");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-white hover:-translate-y-0.5 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>📰</span> Current Affairs
          </button>
        </div>

        {/* 4. Glassy Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">TOTAL QUIZZES</span>
            <span className="text-xl md:text-2xl font-black font-mono text-amber-300">6K+</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">TOTAL QUESTIONS</span>
            <span className="text-xl md:text-2xl font-black font-mono text-emerald-300">250K+</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">ACTIVE STUDENTS</span>
            <span className="text-xl md:text-2xl font-black font-mono text-cyan-300">2.5M+</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">EXAMS COVERED</span>
            <span className="text-xl md:text-2xl font-black font-mono text-pink-300">150+</span>
          </div>
        </div>

        {/* Checkmark List Point Ribbons */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-bold text-slate-200">
          <span className="flex items-center gap-1.5">✓ Free Practice</span>
          <span className="flex items-center gap-1.5">✓ Detailed Explanations</span>
          <span className="flex items-center gap-1.5">✓ Daily Updates</span>
          <span className="flex items-center gap-1.5">✓ All India Ranking</span>
          <span className="flex items-center gap-1.5">✓ Hindi & English Both</span>
          <span className="flex items-center gap-1.5">✓ Mobile Friendly</span>
        </div>

      </div>
    </div>
  );
}
