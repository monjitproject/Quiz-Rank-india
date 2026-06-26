/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, Users, Briefcase, Award, Sparkles, RefreshCw } from "lucide-react";

interface ExamItem {
  id: string;
  name: string;
  fullName: string;
  category: string;
  vacancies: string;
  lastDate: string;
  tier: string;
  colorClass: string;
}

const POPULAR_EXAMS: ExamItem[] = [
  {
    id: "ssc-cgl",
    name: "SSC CGL 2025",
    fullName: "Staff Selection Commission",
    category: "SSC",
    vacancies: "17,727 Posts",
    lastDate: "25 Nov 2025",
    tier: "Graduate Level",
    colorClass: "from-blue-600 to-indigo-700 bg-blue-500"
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board",
    category: "Railway",
    vacancies: "11,558 Posts",
    lastDate: "30 Dec 2025",
    tier: "12th Pass / Graduate",
    colorClass: "from-amber-500 to-orange-600 bg-amber-500"
  },
  {
    id: "upsc-cse",
    name: "UPSC CSE 2025",
    fullName: "Civil Services Examination",
    category: "UPSC",
    vacancies: "1,056 Posts",
    lastDate: "12 Feb 2026",
    tier: "Any Graduate",
    colorClass: "from-violet-600 to-fuchsia-700 bg-violet-600"
  },
  {
    id: "ibps-po",
    name: "IBPS PO Mock",
    fullName: "Inst of Banking Personnel Selection",
    category: "Banking",
    vacancies: "4,455 Posts",
    lastDate: "20 Nov 2025",
    tier: "Bank Graduate",
    colorClass: "from-emerald-600 to-teal-700 bg-emerald-600"
  },
  {
    id: "up-police",
    name: "UP Police Constable",
    fullName: "State Police SI & Constable",
    category: "Police",
    vacancies: "60,244 Posts",
    lastDate: "Completed",
    tier: "12th Pass",
    colorClass: "from-rose-600 to-red-700 bg-rose-600"
  },
  {
    id: "army-agniveer",
    name: "Army Agniveer",
    fullName: "Indian Defence Forces Intake",
    category: "Defence",
    vacancies: "25,000+ Posts",
    lastDate: "Ongoing",
    tier: "10th / 12th Pass",
    colorClass: "from-cyan-600 to-sky-700 bg-cyan-600"
  }
];

interface PopularExamsProps {
  onSelectCategory: (catId: string | null) => void;
}

export function PopularExams({ onSelectCategory }: PopularExamsProps) {
  const [activeTab, setActiveTab] = useState<"boards" | "rss-jobs">("boards");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/government-exam/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs in UI:", err);
    }
  };

  const handleSyncJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/government-exam/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setJobs(data.storedItems || []);
          await fetchJobs();
        }
      }
    } catch (err) {
      console.error("Failed to sync jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePracticeClick = (category: string) => {
    const catIdMap: Record<string, string> = {
      "SSC": "ssc",
      "Railway": "railway",
      "UPSC": "upsc",
      "Banking": "banking",
      "Police": "police",
      "Defence": "defence"
    };
    onSelectCategory(catIdMap[category] || null);
    const quizSec = document.getElementById("active-quizzes-section");
    if (quizSec) quizSec.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="popular-exams-section" className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            India's Leading Boards
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
            Most Popular Government Exams & Jobs
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Mock tests, vacancies, dates, and qualifications details of trending recruitments with live RSS news alerts.</p>
        </div>

        <button
          onClick={() => onSelectCategory(null)}
          className="text-indigo-600 hover:text-indigo-700 font-extrabold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          View Board Directories <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100 pb-1 gap-2">
        <button
          onClick={() => setActiveTab("boards")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "boards"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Trending Exam Boards
        </button>
        <button
          onClick={() => setActiveTab("rss-jobs")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "rss-jobs"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Latest Hindi Vacancies (Sarkari Naukri RSS)
        </button>
      </div>

      {/* 2. Grid items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "boards" && POPULAR_EXAMS.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-100/40 transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Colored Top Panel with Basic Info */}
            <div className={`p-5 bg-gradient-to-r ${exam.colorClass} text-white space-y-2 relative overflow-hidden`}>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {exam.category}
                </span>
                <span className="text-white/80 font-mono text-[9px] font-bold">BOARD ACCREDITED</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base md:text-lg tracking-tight leading-snug">{exam.name}</h3>
                <p className="text-white/85 text-[11px] leading-snug">{exam.fullName}</p>
              </div>
            </div>

            {/* Core Statistics & Requirements */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-indigo-500" /> VACANCIES
                  </span>
                  <span className="text-slate-800 font-extrabold block text-sm">{exam.vacancies}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> LAST DATE
                  </span>
                  <span className="text-slate-800 font-extrabold block text-sm">{exam.lastDate}</span>
                </div>
                <div className="space-y-1 col-span-2 border-t border-slate-50 pt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Award className="w-3 h-3 text-indigo-500" /> ELIGIBILITY / TIER
                  </span>
                  <span className="text-slate-700 font-bold block">{exam.tier}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePracticeClick(exam.category)}
                className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-800 hover:text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer border border-slate-200/50 hover:border-indigo-600 flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                Practice Quiz <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {activeTab === "rss-jobs" && jobs.length === 0 && (
          <div className="col-span-full bg-slate-50 rounded-3xl p-8 border border-slate-200/60 text-center space-y-4 max-w-xl mx-auto">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl inline-block">
              <Briefcase className="w-6 h-6 animate-pulse" />
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-sm">No synchronized Hindi jobs news found!</h4>
              <p className="text-slate-400 text-xs">
                Perform a live, real-time RSS sync against central and state government jobs boards right now.
              </p>
            </div>
            <button
              onClick={handleSyncJobs}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing Jobs Feed...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Synchronize RSS Feed Now
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "rss-jobs" && jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl border border-indigo-150 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Top Indicator */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white space-y-2 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Sarkari Naukri
                </span>
                <span className="bg-emerald-500/90 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                  NEW / LIVE
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm tracking-tight leading-snug line-clamp-3" title={job.title}>{job.title}</h3>
                <p className="text-indigo-200 text-[10px] uppercase font-mono tracking-wider">{job.category || "सरकारी नौकरी"}</p>
              </div>
            </div>

            {/* Description & Action */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                  <Calendar className="w-3 h-3 text-indigo-500" /> PUBLISHED: {job.date}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Source: PIB / Jobs RSS</span>
                <a
                  href="https://news.google.com/search?q=government+jobs+india+sarkari+naukri&hl=hi&gl=IN&ceid=IN:hi"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  Verify Notification <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Promotional Prep Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight">Start Your Exam Preparation Today!</h3>
          <p className="text-blue-200 text-xs max-w-xl font-medium">
            Join 2.5M+ active students already practicing mock sets with negative marking scoring guides. It's 100% free.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory(null)}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black text-xs px-6 py-3 rounded-full shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
        >
          🚀 Launch Free Mock Tests
        </button>
      </div>
    </section>
  );
}
