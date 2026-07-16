/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trophy, Star, Award, TrendingUp, RefreshCw, Zap, Medal, ShieldAlert } from "lucide-react";
import { LeaderboardItem } from "../types";

export function LeaderboardPodium() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch("/api/leaderboard")
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Invalid or non-JSON response");
        }
        return res.json();
      })
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard fetch failed:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3, 8); // Top 8 total for neat rendering on home

  return (
    <section id="leaderboard-podium-section" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            National Rankings
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
            National Prep Leaderboard
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Real-time scoreboard of aspirants practicing mock tests today.</p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchLeaderboard}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Rankings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left/Middle: Podium & Board Table (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 flex flex-col justify-between">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 flex-1">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-slate-400 text-xs font-mono">Syncing national boards...</p>
            </div>
          ) : (
            <>
              {/* Podium display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2 pb-4">
                
                {/* Rank 2 (Silver) */}
                {topThree[1] && (
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-center sm:order-1 relative">
                    <div className="absolute top-3 right-3 bg-slate-200 text-slate-800 w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <img
                      src={topThree[1].avatarUrl}
                      alt={topThree[1].name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full mx-auto border-2 border-slate-300 shadow-sm mb-2"
                    />
                    <h4 className="font-extrabold text-slate-800 text-xs leading-none">{topThree[1].name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 font-mono block mt-1">{topThree[1].score.toLocaleString()} PTS</span>
                    <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {topThree[1].accuracy}% Accuracy
                    </span>
                  </div>
                )}

                {/* Rank 1 (Gold) */}
                {topThree[0] && (
                  <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-5 border border-amber-100 text-center sm:order-2 sm:-translate-y-2 relative shadow-md">
                    <div className="absolute top-3 right-3 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-amber-100 animate-pulse">
                      1
                    </div>
                    <div className="text-xl mb-1 select-none">👑</div>
                    <img
                      src={topThree[0].avatarUrl}
                      alt={topThree[0].name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full mx-auto border-3 border-amber-400 shadow-sm mb-2"
                    />
                    <h4 className="font-black text-slate-900 text-xs leading-none">{topThree[0].name}</h4>
                    <span className="text-[11px] font-black text-amber-600 font-mono block mt-1">{topThree[0].score.toLocaleString()} PTS</span>
                    <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mt-2 inline-block uppercase tracking-wider">
                      Champion Badge
                    </span>
                  </div>
                )}

                {/* Rank 3 (Bronze) */}
                {topThree[2] && (
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-center sm:order-3 relative">
                    <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <img
                      src={topThree[2].avatarUrl}
                      alt={topThree[2].name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full mx-auto border-2 border-amber-600/30 shadow-sm mb-2"
                    />
                    <h4 className="font-extrabold text-slate-800 text-xs leading-none">{topThree[2].name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 font-mono block mt-1">{topThree[2].score.toLocaleString()} PTS</span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {topThree[2].accuracy}% Accuracy
                    </span>
                  </div>
                )}

              </div>

              {/* Grid table */}
              <div className="border-t border-slate-50 pt-4 space-y-2.5">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Remaining Candidate Ranks
                </span>
                {remaining.length === 0 ? (
                  <p className="text-slate-400 text-xs font-mono text-center py-4">No remaining entries. Be the first to secure rank!</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {remaining.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-slate-400 w-5">{item.rank}</span>
                          <img
                            src={item.avatarUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full border border-slate-100"
                          />
                          <div>
                            <span className="text-slate-800 block text-xs">{item.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{item.quizzesTaken} sessions taken</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 text-right font-mono">
                          <div>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase">SCORE</span>
                            <span className="text-slate-700 font-extrabold text-[11px]">{item.score}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase">ACCURACY</span>
                            <span className="text-emerald-600 font-extrabold text-[11px]">{item.accuracy}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Achievements & Streaks Guidelines (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* Achievement Badges card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-white/5 shadow-xl space-y-4">
            <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md border border-white/10 inline-block">
              🎯 EXAM CHALLENGES
            </span>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Medal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs">Perfect Streak Badge</h4>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">Solve a mini-quiz for 5 consecutive days to trigger an extra 500 board score points.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs">Speed Master Token</h4>
                  <p className="text-[10px] text-slate-300 leading-snug mt-0.5">Submit full mock series in less than 50% allotted duration with 90%+ correct precision.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist on how to rank higher */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" /> Want to Top the Board?
              </h4>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Maximize daily activities to accumulate points and get noticed by national hiring institutions.
              </p>
            </div>

            <div className="space-y-2 mt-2 font-semibold text-[10px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-xs">✓</span>
                <span>Practice daily current affairs series</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-xs">✓</span>
                <span>Maintain a login streak of 5+ days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-xs">✓</span>
                <span>Score above 90% in mock tests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-xs">✓</span>
                <span>Claim speed-answer bonus points</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-[10px] text-indigo-800 mt-2 font-medium">
              ℹ️ Top 10 leaderboard rankings are shared weekly with accredited government coaching academies across India.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
