import React, { useState, useEffect } from "react";
import { 
  ArrowRight, Sparkles, Award, Play, BookOpen, Clock, 
  Search, ChevronLeft, ChevronRight, Hash, ShieldCheck, 
  TrendingUp, Star, Filter, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Quiz } from "../types";

interface MockTestExplorerProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onSelectQuiz: (quizId: string) => void;
  quizzes: Quiz[];
}

export function MockTestExplorer({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onSelectQuiz,
  quizzes
}: MockTestExplorerProps) {
  // Default to 'gk' if no category is selected, ensuring there is always a mock test active
  const activeCatId = selectedCategory || "gk";
  const activeCategory = categories.find(c => c.id === activeCatId) || categories[0];

  const [searchNumber, setSearchNumber] = useState("");
  const [activeTabRange, setActiveTabRange] = useState(0); // 0 = 1-50, 1 = 51-100, etc.
  const [currentPage, setCurrentPage] = useState(1); // Page within the selected 50-test range (e.g., 5 pages of 10 tests)
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string | null>(null);

  // Tab ranges definitions for 500 tests (each tab has 50 tests)
  const tabRanges = Array.from({ length: 10 }, (_, i) => ({
    start: i * 50 + 1,
    end: (i + 1) * 50,
    label: `Mocks ${i * 50 + 1}-${(i + 1) * 50}`
  }));

  // Reset page when tab range or category changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchNumber("");
  }, [activeCatId, activeTabRange]);

  // Total tests in current category is 500
  const totalMockTestsCount = 500;

  // Determine current test numbers based on selected range and pagination
  const testsPerPage = 10;
  
  // If user searched for a specific test number, we show only that test
  let displayTestNumbers: number[] = [];
  const searchVal = parseInt(searchNumber.trim(), 10);
  const isSearchingNumber = !isNaN(searchVal) && searchVal >= 1 && searchVal <= 500;

  if (isSearchingNumber) {
    displayTestNumbers = [searchVal];
  } else {
    const range = tabRanges[activeTabRange];
    const rangeStart = range.start;
    
    // Calculate the start and end indices of the current page within this 50-test range
    const pageStart = rangeStart + (currentPage - 1) * testsPerPage;
    const pageEnd = Math.min(range.end, pageStart + testsPerPage - 1);
    
    for (let i = pageStart; i <= pageEnd; i++) {
      displayTestNumbers.push(i);
    }
  }

  // Get deterministic properties for each test number in the selected category
  const getTestDetails = (num: number) => {
    // Semi-random deterministic generator based on number and category
    const isEasy = num % 3 === 1;
    const isHard = num % 3 === 0;
    const difficulty = isHard ? "Hard" : isEasy ? "Easy" : "Medium";
    const duration = isEasy ? 10 : isHard ? 20 : 15;
    const rating = (4.5 + ((num * 17) % 5) * 0.1).toFixed(1);
    const attempts = 1500 + ((num * 47) % 3500);
    const isLanguageHindi = activeCatId !== "ssc" && activeCatId !== "banking" && activeCatId !== "engineering";

    return {
      id: `virtual-${activeCatId}-${num}`,
      title: `${activeCategory?.name || "Exam Prep"} Full Mock Set #${num}`,
      description: `Official standard syllabus evaluation test #${num} featuring real exam timer limits, negative marking (-0.25), and national predicted rank percentile.`,
      difficulty,
      durationMinutes: duration,
      rating,
      attemptsCount: attempts,
      language: isLanguageHindi ? "Hindi (हिंदी)" : "English (अंग्रेजी)",
      questionsCount: 10
    };
  };

  // Filter display test details by difficulty if filter is applied
  const allCurrentTests = displayTestNumbers.map(num => getTestDetails(num));
  const filteredTests = selectedDifficultyFilter 
    ? allCurrentTests.filter(t => t.difficulty === selectedDifficultyFilter)
    : allCurrentTests;

  const handleNextPage = () => {
    if (currentPage < 5) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filter Panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-blue-500 text-white p-2.5 rounded-2xl">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 tracking-tight">
              Instant Test Finder
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">Access any of the 500 premium Mock Tests directly</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Quick jump input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="number"
              min="1"
              max="500"
              placeholder="Enter Mock Test # (1 to 500)..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Difficulty quick pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 rounded-xl">
            <button
              onClick={() => setSelectedDifficultyFilter(null)}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                selectedDifficultyFilter === null 
                  ? "bg-white text-slate-800 shadow-xs font-black" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Mocks
            </button>
            <button
              onClick={() => setSelectedDifficultyFilter("Easy")}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                selectedDifficultyFilter === "Easy" 
                  ? "bg-emerald-500 text-white shadow-xs font-black" 
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setSelectedDifficultyFilter("Medium")}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                selectedDifficultyFilter === "Medium" 
                  ? "bg-amber-500 text-white shadow-xs font-black" 
                  : "text-slate-500 hover:text-amber-700"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedDifficultyFilter("Hard")}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all ${
                selectedDifficultyFilter === "Hard" 
                  ? "bg-rose-500 text-white shadow-xs font-black" 
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              Hard
            </button>
          </div>
        </div>
      </div>

      {/* 500 Test Range Tabs Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabRanges.map((tab, idx) => {
          const isActive = activeTabRange === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveTabRange(idx);
                setSelectedDifficultyFilter(null);
              }}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl border cursor-pointer whitespace-nowrap transition-all shrink-0 ${
                isActive 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "bg-white border-slate-200/70 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid View */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm">No Filtered Mock Tests Found</h4>
          <p className="text-slate-400 text-xs mt-1">Try resetting the difficulty filter or entering a search query between 1 and 500.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTests.map((test) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                key={test.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Premium badge */}
                <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-700 text-[9px] font-black uppercase px-3.5 py-1.5 rounded-bl-2xl inline-flex items-center gap-1 border-l border-b border-amber-100">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Premium Mock
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      test.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      test.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : 
                      "bg-rose-50 text-rose-600 border-rose-200"
                    }`}>
                      {test.difficulty}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] font-black uppercase">{test.language}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    {test.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {test.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                    <div className="space-y-0.5">
                      <span className="block uppercase text-[8px] tracking-wider text-slate-300">QUESTIONS</span>
                      <span className="text-slate-700 font-black">{test.questionsCount} Standard MCQs</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="block uppercase text-[8px] tracking-wider text-slate-300">TIME LIMIT</span>
                      <span className="text-slate-700 font-black flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-500" /> {test.durationMinutes} Mins
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="block uppercase text-[8px] tracking-wider text-slate-300">RATING</span>
                      <span className="text-slate-700 font-black flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {test.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-50 mt-5 flex justify-between items-center gap-4">
                  <div className="text-left font-mono">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase">ATTEMPTED</span>
                    <span className="text-xs font-bold text-slate-600">{test.attemptsCount.toLocaleString()}+ aspirants</span>
                  </div>

                  <button
                    onClick={() => onSelectQuiz(test.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-white" /> Start Practice
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination View inside selected range (shown only if not searching specific number) */}
      {!isSearchingNumber && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <span className="text-xs font-bold text-slate-400">
            Showing tests <span className="text-slate-800 font-black">{tabRanges[activeTabRange].start + (currentPage - 1) * testsPerPage}</span> to <span className="text-slate-800 font-black">{Math.min(tabRanges[activeTabRange].end, tabRanges[activeTabRange].start + currentPage * testsPerPage - 1)}</span> of <span className="text-slate-800 font-black">500</span> in this category
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-slate-200 cursor-pointer transition-all ${
                currentPage === 1 
                  ? "opacity-40 cursor-not-allowed bg-slate-50" 
                  : "bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === 5}
              className={`p-2 rounded-xl border border-slate-200 cursor-pointer transition-all ${
                currentPage === 5 
                  ? "opacity-40 cursor-not-allowed bg-slate-50" 
                  : "bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
