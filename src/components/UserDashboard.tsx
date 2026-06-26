/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Award, Clock, FileText, Bookmark, Calendar, ArrowRight, ShieldCheck, CheckCircle, Trophy, Sparkles, Printer } from "lucide-react";
import { Result, Quiz, UserProfile } from "../types";

interface UserDashboardProps {
  userName: string;
  results: Result[];
  onSelectQuiz: (quizId: string) => void;
  availableQuizzes: Quiz[];
}

export function UserDashboard({ userName, results, onSelectQuiz, availableQuizzes }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "badges" | "certificate">("overview");

  // Filter results for current user
  const userResults = results;
  const totalPoints = userResults.reduce((acc, curr) => acc + curr.score, 0);
  const averageAccuracy = userResults.length > 0
    ? Math.round(userResults.reduce((acc, curr) => acc + curr.accuracy, 0) / userResults.length)
    : 0;

  // Render high-fidelity SVG chart showing accuracy progress
  const renderAccuracyChart = () => {
    if (userResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-xs">No mock assessments completed yet.</p>
        </div>
      );
    }

    const points = userResults.slice(-6).map((r, i) => ({
      x: (i / Math.max(1, userResults.slice(-6).length - 1)) * 320 + 30,
      y: 150 - (r.accuracy / 100) * 110,
      accuracy: r.accuracy,
      title: r.quizTitle
    }));

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-4">Accuracy Trend (Last 6 Attempts)</h4>
        <div className="relative h-48 w-full flex justify-center">
          <svg className="w-full h-full max-w-[400px]" viewBox="0 0 380 160">
            {/* Grid Lines */}
            <line x1="30" y1="40" x2="350" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
            <line x1="30" y1="95" x2="350" y2="95" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
            <line x1="30" y1="150" x2="350" y2="150" stroke="#e2e8f0" strokeWidth="1" />

            {/* Labels */}
            <text x="5" y="44" className="text-[9px] fill-slate-400 font-mono font-semibold">100%</text>
            <text x="5" y="99" className="text-[9px] fill-slate-400 font-mono font-semibold">50%</text>
            <text x="5" y="154" className="text-[9px] fill-slate-400 font-mono font-semibold">0%</text>

            {/* Line Path */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Area Fill */}
            {points.length > 1 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`}
                fill="url(#areaGrad)"
                opacity="0.12"
              />
            )}

            {/* Points circles */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" className="fill-blue-600 stroke-white" strokeWidth="1.5" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-bold font-mono fill-slate-700">{p.accuracy}%</text>
              </g>
            ))}

            {/* Gradients */}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  // Pre-configured achievements based on points
  const achievements = [
    { id: "a1", title: "First Ascent", description: "Completed your first live mock assessment.", icon: "Trophy", threshold: 10, unlocked: totalPoints >= 10 },
    { id: "a2", title: "Super Scholar", description: "Earned more than 100 points in tests.", icon: "Award", threshold: 100, unlocked: totalPoints >= 100 },
    { id: "a3", title: "Elite Master", description: "Earned more than 200 points in total exam questions.", icon: "Sparkles", threshold: 200, unlocked: totalPoints >= 200 },
    { id: "a4", title: "Accuracy Ace", description: "Completed any test with 90%+ accuracy.", icon: "ShieldCheck", threshold: 90, unlocked: userResults.some(r => r.accuracy >= 90) }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header Block */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-2xl tracking-wider text-white border-2 border-white/20">
            {userName ? userName.charAt(0).toUpperCase() : "G"}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight">{userName || "Aspirant Member"}</h2>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active Prep</span>
            </div>
            <p className="text-slate-400 text-xs mt-1.5 font-mono">Rank Prediction Index: Active Daily</p>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
          <div className="text-center">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Quiz Points</span>
            <span className="text-xl font-bold font-mono text-yellow-400">{totalPoints} PTS</span>
          </div>
          <div className="w-[1px] bg-white/10"></div>
          <div className="text-center">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Accuracy</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{averageAccuracy}%</span>
          </div>
          <div className="w-[1px] bg-white/10"></div>
          <div className="text-center">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Attempted</span>
            <span className="text-xl font-bold font-mono text-blue-400">{userResults.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-3 border-b border-slate-100 pb-4 mb-8 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl cursor-pointer shrink-0 transition-colors ${
            activeTab === "overview" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 bg-slate-50"
          }`}
        >
          Preparation Overview
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-xl cursor-pointer shrink-0 transition-colors ${
            activeTab === "history" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 bg-slate-50"
          }`}
        >
          Mock Test History
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-xl cursor-pointer shrink-0 transition-colors ${
            activeTab === "badges" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 bg-slate-50"
          }`}
        >
          Achievements ({achievements.filter(a => a.unlocked).length}/4)
        </button>
        <button
          onClick={() => setActiveTab("certificate")}
          className={`px-4 py-2 rounded-xl cursor-pointer shrink-0 transition-colors ${
            activeTab === "certificate" ? "bg-blue-600 text-white animate-pulse" : "text-slate-500 hover:text-slate-800 bg-slate-50"
          }`}
        >
          Excellence Certificate 📜
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chart & Highlights (Col-span-2) */}
          <div className="md:col-span-2 space-y-6">
            {renderAccuracyChart()}
            
            {/* Recommendations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">AI Prep Recommendation</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Based on your average accuracy of <strong>{averageAccuracy}%</strong>, we recommend reviewing our <strong>Hindi Grammar</strong> or <strong>Current Affairs Daily Booster</strong> series to minimize negative marking risks on active state board examinations.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    const findQuiz = availableQuizzes.find(q => q.categoryId === "current-affairs") || availableQuizzes[0];
                    if (findQuiz) onSelectQuiz(findQuiz.id);
                  }}
                  className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Start Recommendation Quiz <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Unlocked Badges Checklist (Col-span-1) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Unlocked Badges</h3>
              <div className="space-y-4">
                {achievements.map(ach => (
                  <div key={ach.id} className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${
                    ach.unlocked ? "border-emerald-100 bg-emerald-50/20" : "border-slate-100 bg-slate-50/50 opacity-60"
                  }`}>
                    <div className={`p-2 rounded-xl ${ach.unlocked ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                      {ach.icon === "Trophy" && <Trophy className="w-4.5 h-4.5" />}
                      {ach.icon === "Award" && <Award className="w-4.5 h-4.5" />}
                      {ach.icon === "Sparkles" && <Sparkles className="w-4.5 h-4.5" />}
                      {ach.icon === "ShieldCheck" && <ShieldCheck className="w-4.5 h-4.5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs">{ach.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                      <span className="text-[9px] font-bold font-mono uppercase text-slate-400 block mt-1">
                        {ach.unlocked ? "✓ Unlocked" : `Requires ${ach.threshold} Pts`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-6">Completed Assessments & Accuracy History</h3>
          {userResults.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-8 font-mono">No mock assessments completed yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {userResults.slice().reverse().map((res) => (
                <div key={res.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800 text-sm">{res.quizTitle}</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(res.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-6 text-center font-mono">
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Score</span>
                      <span className="text-xs font-bold text-slate-800">{res.score}/{res.totalPoints}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Accuracy</span>
                      <span className={`text-xs font-bold ${res.accuracy >= 80 ? "text-emerald-600" : res.accuracy >= 60 ? "text-amber-500" : "text-rose-500"}`}>{res.accuracy}%</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Est. Rank</span>
                      <span className="text-xs font-bold text-slate-800">#{res.rankPredicted}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectQuiz(res.quizId)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Review / Retake
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map(ach => (
            <div key={ach.id} className={`p-6 rounded-3xl border text-center transition-all ${
              ach.unlocked ? "border-blue-100 bg-white shadow-md shadow-blue-500/5" : "border-slate-100 bg-slate-50/50 opacity-60"
            }`}>
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                ach.unlocked ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
              }`}>
                {ach.icon === "Trophy" && <Trophy className="w-7 h-7" />}
                {ach.icon === "Award" && <Award className="w-7 h-7" />}
                {ach.icon === "Sparkles" && <Sparkles className="w-7 h-7" />}
                {ach.icon === "ShieldCheck" && <ShieldCheck className="w-7 h-7" />}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{ach.title}</h4>
              <p className="text-xs text-slate-400 mb-4">{ach.description}</p>
              <span className={`inline-block text-[10px] font-semibold uppercase px-3 py-1 rounded-full ${
                ach.unlocked ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
              }`}>
                {ach.unlocked ? "Unlocked" : `Locked (${ach.threshold} PTS)`}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "certificate" && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm text-center">
          <h3 className="font-bold text-slate-800 text-sm mb-2">Excellence Preparation Certificate</h3>
          <p className="text-xs text-slate-400 mb-6">Complete at least one mock assessment of 80%+ accuracy to unlock this official certificate.</p>
          
          {userResults.some(r => r.accuracy >= 80) ? (
            <div className="space-y-6">
              {/* Printable Certificate Frame */}
              <div id="printable-certificate" className="border-8 border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto bg-amber-50/20 shadow-inner relative overflow-hidden text-slate-800">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-tr-full"></div>
                
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800 font-sans">Certificate of Merit</h2>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-1">ISSUED BY QUIZRANK INDIA</span>
                
                <div className="my-6">
                  <p className="text-xs italic text-slate-500">This certifies that competitive aspirant</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 my-2">{userName || "Selected Aspirant"}</h1>
                  <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-600">
                    has successfully solved state/central mock series with a peak accuracy of{" "}
                    <strong>{Math.max(...userResults.map(r => r.accuracy))}%</strong>, demonstrating professional subject competence, speed, and exam readiness.
                  </p>
                </div>
                
                <div className="flex justify-between items-end border-t border-slate-200 pt-6 max-w-sm mx-auto text-xs font-mono text-slate-500">
                  <div className="text-center">
                    <span className="font-bold block text-slate-700">June 2026</span>
                    <span className="text-[10px] uppercase block mt-1">Date Issued</span>
                  </div>
                  <div className="text-center">
                    <span className="font-bold block text-blue-600 italic">QuizRank-AI</span>
                    <span className="text-[10px] uppercase block mt-1">Authorized Board</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print / Save Certificate
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-center space-y-4">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Certificate Locked</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You currently have no attempts with 80%+ accuracy. Try practicing the <strong>SSC GD Constable</strong> or <strong>Current Affairs Daily Booster</strong> and score 80%+ to unlock!
              </p>
              <button
                onClick={() => {
                  const firstQuiz = availableQuizzes[0];
                  if (firstQuiz) onSelectQuiz(firstQuiz.id);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Practice Mock Quiz Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
