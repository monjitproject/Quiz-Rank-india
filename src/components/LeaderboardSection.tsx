/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { LeaderboardItem } from "../types";
import { Trophy, Star, Award, TrendingUp, RefreshCw } from "lucide-react";

export function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch("/api/leaderboard")
      .then(res => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Invalid or non-JSON response");
        }
        return res.json();
      })
      .then(data => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-slate-400 text-xs font-mono">Loading rankings...</p>
      </div>
    );
  }

  // Extract top 3 for special display podium
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-1.5 font-sans">
            <Trophy className="w-5.5 h-5.5 text-yellow-500 animate-bounce" /> National Prep Leaderboard
          </h2>
          <p className="text-slate-400 text-xs mt-1">Real-time rank list of candidates practicing daily quizzes.</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-center font-semibold text-xs">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Weekly Rank
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Monthly Series
          </button>
        </div>
      </div>

      {/* Podium display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 pb-2">
        
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center md:order-1 relative">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">2</div>
            <img src={topThree[1].avatarUrl} alt={topThree[1].name} className="w-14 h-14 rounded-full mx-auto border-2 border-slate-300 shadow-md mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">{topThree[1].name}</h3>
            <span className="text-[10px] font-semibold text-slate-400 font-mono block mt-1">{topThree[1].score.toLocaleString()} PTS</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2.5 inline-block">{topThree[1].accuracy}% Accuracy</span>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border border-amber-100 shadow-lg text-center md:order-2 md:-translate-y-2 relative">
            <div className="absolute top-4 right-4 bg-amber-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-amber-100 animate-pulse">1</div>
            <img src={topThree[0].avatarUrl} alt={topThree[0].name} className="w-16 h-16 rounded-full mx-auto border-4 border-amber-400 shadow-md mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">{topThree[0].name}</h3>
            <span className="text-[11px] font-bold text-amber-600 font-mono block mt-1">{topThree[0].score.toLocaleString()} PTS</span>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mt-2.5 inline-block uppercase">Champion Badge</span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center md:order-3 relative">
            <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">3</div>
            <img src={topThree[2].avatarUrl} alt={topThree[2].name} className="w-14 h-14 rounded-full mx-auto border-2 border-amber-600/30 shadow-md mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">{topThree[2].name}</h3>
            <span className="text-[10px] font-semibold text-slate-400 font-mono block mt-1">{topThree[2].score.toLocaleString()} PTS</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2.5 inline-block">{topThree[2].accuracy}% Accuracy</span>
          </div>
        )}

      </div>

      {/* List for remainder ranks */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">Remaining Candidate Ranks</h3>
        {remaining.length === 0 ? (
          <p className="text-slate-400 text-xs font-mono text-center py-4">Join active tests to register on the leaderboard!</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {remaining.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 w-5">{item.rank}</span>
                  <img src={item.avatarUrl} alt={item.name} className="w-8 h-8 rounded-full border border-slate-100" />
                  <div>
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.quizzesTaken} mock tests taken</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-right">
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">Points</span>
                    <span className="font-bold text-slate-700">{item.score}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">Accuracy</span>
                    <span className="font-bold text-emerald-600">{item.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
