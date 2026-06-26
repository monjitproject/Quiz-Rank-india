/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Book, CheckCircle, XCircle, ArrowRight, Award, Zap } from "lucide-react";

interface SubjectData {
  id: string;
  name: string;
  description: string;
  quizzesCount: number;
  totalAttempts: string;
  difficulty: string;
  sampleQuestion: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  linkCategory: string;
}

const SUBJECT_LIST: SubjectData[] = [
  {
    id: "gk",
    name: "General Knowledge",
    description: "Indian History, Polity, Geography & Economy",
    quizzesCount: 350,
    totalAttempts: "1.2M",
    difficulty: "Mixed",
    sampleQuestion: {
      questionText: "Which article of the Indian Constitution empowers the President to impose President's Rule in a state?",
      options: ["Article 352", "Article 356", "Article 360", "Article 368"],
      correctIndex: 1,
      explanation: "Article 356 deals with the imposition of President's Rule in a state in case of failure of constitutional machinery."
    },
    linkCategory: "gk"
  },
  {
    id: "maths",
    name: "Mathematics / Quant",
    description: "Percentage, Profit & Loss, SI, CI & Algebra",
    quizzesCount: 180,
    totalAttempts: "850K",
    difficulty: "Medium to Hard",
    sampleQuestion: {
      questionText: "If the cost price of 12 items is equal to the selling price of 9 items, what is the profit percentage?",
      options: ["25%", "33.33%", "20%", "30%"],
      correctIndex: 1,
      explanation: "Profit% = (Cost Price Items - Selling Price Items) / Selling Price Items * 100 = (12 - 9)/9 * 100 = 33.33%."
    },
    linkCategory: "engineering"
  },
  {
    id: "reasoning",
    name: "General Intelligence & Reasoning",
    description: "Syllogism, Blood Relations, Coding-Decoding & Puzzles",
    quizzesCount: 220,
    totalAttempts: "950K",
    difficulty: "Medium",
    sampleQuestion: {
      questionText: "In a certain code language, 'ROSE' is written as 'TQUG'. How is 'BISCUIT' written in that code?",
      options: ["DKUEWKV", "DKUEWKU", "DKVEWKU", "CJTDVJS"],
      correctIndex: 1,
      explanation: "Each letter is shifted by +2 positions. B(+2)=D, I(+2)=K, S(+2)=U, C(+2)=E, U(+2)=W, I(+2)=K, T(+2)=U."
    },
    linkCategory: "banking"
  },
  {
    id: "hindi",
    name: "Hindi Vyakaran (हिंदी व्याकरण)",
    description: "संधि, समास, मुहावरे, पर्यायवाची & विलोम शब्द",
    quizzesCount: 140,
    totalAttempts: "650K",
    difficulty: "Easy to Medium",
    sampleQuestion: {
      questionText: "निम्नलिखित में से कौन सा शब्द 'नक्षत्र' का पर्यायवाची शब्द है?",
      options: ["तारा", "व्योम", "अंबर", "जलद"],
      correctIndex: 0,
      explanation: "'नक्षत्र' शब्द का अर्थ आकाश में दिखने वाले तारे होता है, इसलिए 'तारा' इसका सही पर्यायवाची है।"
    },
    linkCategory: "current-affairs"
  },
  {
    id: "english",
    name: "English Grammar",
    description: "Spotting Errors, Active/Passive Voice & Idioms",
    quizzesCount: 195,
    totalAttempts: "740K",
    difficulty: "Medium",
    sampleQuestion: {
      questionText: "Identify the part of speech of the highlighted word: 'He walked **fast** to catch the last train.'",
      options: ["Adjective", "Adverb", "Noun", "Conjunction"],
      correctIndex: 1,
      explanation: "Here 'fast' describes the action verb 'walked', so it is an Adverb of manner."
    },
    linkCategory: "ssc"
  }
];

interface SubjectPracticeProps {
  onSelectCategory: (catId: string | null) => void;
}

export function SubjectPractice({ onSelectCategory }: SubjectPracticeProps) {
  const [activeSubjectId, setActiveSubjectId] = useState("gk");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const activeSubject = SUBJECT_LIST.find((s) => s.id === activeSubjectId) || SUBJECT_LIST[0];

  const handleSubjectChange = (id: string) => {
    setActiveSubjectId(id);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleOptionClick = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
  };

  const handleLaunchFullCategory = () => {
    onSelectCategory(activeSubject.linkCategory);
    const quizSec = document.getElementById("active-quizzes-section");
    if (quizSec) quizSec.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="subject-practice-section" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Syllabus-Wise Drills
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
          Subject Wise Quiz Practice
        </h2>
        <p className="text-slate-500 text-xs mt-0.5">Solve topic-wise sub-questions or test your skills with our interactive interactive preview panel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Subject Selector List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-3 space-y-1 shadow-sm">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-2 pt-1 border-b border-slate-50">
            Select Practice Stream
          </span>
          {SUBJECT_LIST.map((subj) => (
            <button
              key={subj.id}
              onClick={() => handleSubjectChange(subj.id)}
              className={`w-full text-left p-3.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer font-semibold text-xs ${
                activeSubjectId === subj.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeSubjectId === subj.id ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                <Book className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block text-xs font-extrabold leading-none">{subj.name}</span>
                <span className={`text-[10px] block mt-1 leading-tight line-clamp-1 ${activeSubjectId === subj.id ? "text-indigo-100" : "text-slate-400"}`}>
                  {subj.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Interactive Display Panel */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 flex flex-col justify-between min-h-[400px]">
          {/* Metadata Grid */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-slate-900 font-extrabold text-base tracking-tight">{activeSubject.name} Mini Drill</h3>
              <p className="text-slate-400 text-[11px] font-medium">Practice standard competitive questions with negative metrics.</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase">MOCKS</span>
                <span className="text-slate-800 text-sm font-black">{activeSubject.quizzesCount}+</span>
              </div>
              <div className="text-center border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 block uppercase">SOLVED</span>
                <span className="text-slate-800 text-sm font-black">{activeSubject.totalAttempts} times</span>
              </div>
              <div className="text-center border-l border-slate-100 pl-4">
                <span className="text-[10px] text-slate-400 block uppercase">DIFFICULTY</span>
                <span className="text-indigo-600 text-sm font-black uppercase">{activeSubject.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Interactive Question Card */}
          <div className="space-y-4 bg-slate-50/50 rounded-2xl p-5 border border-slate-200/50">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5 w-max">
              <Zap className="w-3 h-3 fill-indigo-600 animate-pulse" /> INTERACTIVE PREVIEW
            </div>

            <h4 className="text-slate-800 font-extrabold text-sm md:text-base leading-relaxed">
              {activeSubject.sampleQuestion.questionText}
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {activeSubject.sampleQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeSubject.sampleQuestion.correctIndex;
                
                let optionStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";
                if (showFeedback) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/10";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/10";
                  } else {
                    optionStyle = "opacity-60 border-slate-200 text-slate-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={`p-3 rounded-xl border text-xs text-left font-semibold cursor-pointer flex items-center justify-between transition-all ${optionStyle}`}
                    disabled={showFeedback}
                  >
                    <span>{opt}</span>
                    {showFeedback && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showFeedback && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5 text-xs animate-fadeIn mt-4">
                <span className="font-extrabold text-indigo-900 flex items-center gap-1">
                  💡 Explanation Answer Key:
                </span>
                <p className="text-indigo-800/90 font-medium leading-relaxed">
                  {activeSubject.sampleQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Complete CTA */}
          <div className="pt-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Ready to solve full sets?</span>
            <button
              onClick={handleLaunchFullCategory}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-600/10 self-stretch sm:self-auto justify-center"
            >
              Start Complete {activeSubject.name} Series <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
