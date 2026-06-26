/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileText, Award, Train, Coins, GraduationCap, Shield,
  Milestone, Map, Scale, HeartPulse, Wrench, Leaf, Calendar, Globe, ArrowRight,
  Search, X
} from "lucide-react";
import { motion } from "motion/react";
import { Category } from "../types";

// Icon mapper for safety
const ICON_MAP: Record<string, any> = {
  FileText, Award, Train, Coins, GraduationCap, Shield,
  Milestone, Map, Scale, HeartPulse, Wrench, Leaf, Calendar, Globe
};

interface ExploreCategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function ExploreCategories({ categories, selectedCategory, onSelectCategory }: ExploreCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      cat.name.toLowerCase().includes(term) ||
      (cat.description && cat.description.toLowerCase().includes(term)) ||
      (cat.id && cat.id.toLowerCase().includes(term))
    );
  });

  return (
    <motion.section
      id="explore-categories-section"
      className="max-w-7xl mx-auto px-4 py-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <motion.div
        variants={headerVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100/80 shadow-xs"
      >
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Exam Verticals
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans mt-2">
            Explore 20+ Exam Categories
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Click a category card to instantly view and solve relevant practice question sets.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          {/* Real-time search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search exam categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors animate-fade-in"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              onSelectCategory(null);
            }}
            className="text-indigo-600 hover:text-indigo-700 font-extrabold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/60 transition-all text-center justify-center"
          >
            Reset <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto">
          <p className="text-slate-500 text-sm font-medium">No exam categories match your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100/50 hover:bg-indigo-100 transition-all"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {filteredCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || FileText;
            const isSelected = selectedCategory === cat.id;

            // Compute a rich custom color gradient based on ID
            let cardGradient = "from-blue-500/10 to-blue-600/5 hover:border-blue-300 hover:shadow-blue-500/5 text-blue-700";
            if (cat.id === "ssc") cardGradient = "from-blue-500/10 to-blue-600/5 hover:border-blue-300 hover:shadow-blue-500/5 text-blue-700";
            else if (cat.id === "upsc") cardGradient = "from-purple-500/10 to-purple-600/5 hover:border-purple-300 hover:shadow-purple-500/5 text-purple-700";
            else if (cat.id === "railway") cardGradient = "from-sky-500/10 to-sky-600/5 hover:border-sky-300 hover:shadow-sky-500/5 text-sky-700";
            else if (cat.id === "banking") cardGradient = "from-indigo-500/10 to-indigo-600/5 hover:border-indigo-300 hover:shadow-indigo-500/5 text-indigo-700";
            else if (cat.id === "teaching") cardGradient = "from-orange-500/10 to-orange-600/5 hover:border-orange-300 hover:shadow-orange-500/5 text-orange-700";
            else if (cat.id === "police") cardGradient = "from-red-500/10 to-red-600/5 hover:border-red-300 hover:shadow-red-500/5 text-red-700";
            else if (cat.id === "defence") cardGradient = "from-teal-500/10 to-teal-600/5 hover:border-teal-300 hover:shadow-teal-500/5 text-teal-700";
            else if (cat.id === "state-psc") cardGradient = "from-amber-500/10 to-amber-600/5 hover:border-amber-300 hover:shadow-amber-500/5 text-amber-700";
            else if (cat.id === "judiciary") cardGradient = "from-rose-500/10 to-rose-600/5 hover:border-rose-300 hover:shadow-rose-500/5 text-rose-700";
            else if (cat.id === "nursing") cardGradient = "from-emerald-500/10 to-emerald-600/5 hover:border-emerald-300 hover:shadow-emerald-500/5 text-emerald-700";
            else if (cat.id === "engineering") cardGradient = "from-cyan-500/10 to-cyan-600/5 hover:border-cyan-300 hover:shadow-cyan-500/5 text-cyan-700";
            else if (cat.id === "agriculture") cardGradient = "from-green-500/10 to-green-600/5 hover:border-green-300 hover:shadow-green-500/5 text-green-700";
            else if (cat.id === "current-affairs") cardGradient = "from-pink-500/10 to-pink-600/5 hover:border-pink-300 hover:shadow-pink-500/5 text-pink-700";
            else if (cat.id === "gk") cardGradient = "from-indigo-500/10 to-indigo-600/5 hover:border-indigo-300 hover:shadow-indigo-500/5 text-indigo-700";

            return (
              <motion.button
                key={cat.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -4,
                  scale: isSelected ? 1.05 : 1.03,
                  boxShadow: isSelected 
                    ? "0 15px 30px -5px rgba(79, 70, 229, 0.4)" 
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectCategory(isSelected ? null : cat.id);
                  // Scroll to live quiz list
                  const quizSec = document.getElementById("active-quizzes-section");
                  if (quizSec) quizSec.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex flex-col items-center justify-between p-4 bg-gradient-to-br rounded-2xl border transition-all text-center cursor-pointer min-h-[140px] group ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white hover:text-white shadow-lg shadow-indigo-600/20"
                    : `bg-white border-slate-100 shadow-sm ${cardGradient}`
                }`}
              >
                <div className="space-y-2 flex flex-col items-center w-full">
                  <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                    isSelected ? "bg-white/20 text-white" : "bg-white border border-slate-100"
                  }`}>
                    <IconComponent className="w-5 h-5 shrink-0" />
                  </div>

                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-black tracking-tight block ${isSelected ? "text-white" : "text-slate-800"}`}>
                      {cat.name}
                    </span>
                    <span className={`text-[9px] font-medium leading-tight block line-clamp-1 max-w-[100px] ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                      {cat.description}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase mt-2 block font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {cat.quizCount}+ Tests
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
