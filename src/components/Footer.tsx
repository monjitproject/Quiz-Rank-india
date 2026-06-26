/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle2, Globe, HelpCircle, Send, Award, FileText } from "lucide-react";

interface FooterProps {
  onNavigateStatic: (pageId: string) => void;
}

export function Footer({ onNavigateStatic }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full mt-16 font-sans">
      {/* 1. Purple Newsletter Ribbon */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-lg font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl">📢</span> Get Daily Exam Updates
            </h3>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              Join 500K+ students receiving daily quiz alerts & exam notifications.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2 shrink-0">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-72 bg-white/10 hover:bg-white/15 focus:bg-white text-slate-800 focus:text-slate-900 placeholder:text-blue-100/70 focus:placeholder:text-slate-400 border border-white/20 focus:border-white rounded-full px-4 py-2 text-xs outline-none font-medium transition-all"
              required
            />
            <button
              type="submit"
              className="bg-white text-indigo-700 hover:bg-blue-50 font-extrabold text-xs px-5 py-2 rounded-full cursor-pointer transition-all shrink-0 active:scale-95 shadow-sm"
            >
              {subscribed ? "Subscribed! 🎉" : "Subscribe Free"}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Dark Footer Directory */}
      <div className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                Q
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm tracking-tight leading-none">QuizRank India</h3>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Govt Jobs Quiz Portal</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              India's most trusted government exam quiz platform. Practice daily, track progress, and get selected in your dream government job.
            </p>
            
            <div className="space-y-2 text-[11px] text-slate-400 pt-2 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <a href="mailto:support@quizrankindia.in" className="hover:text-white transition-colors">support@quizrankindia.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 9876543210</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Top Exams Column */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-900 pb-1.5">Top Exams</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-semibold">
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">SSC CGL 2025</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">SSC GD Constable</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">SSC CHSL</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">RRB NTPC</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">RRB Group D</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">IBPS PO</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">SBI Clerk</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">UPSC CSE</button></li>
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">UP Police</button></li>
            </ul>
          </div>

          {/* Quiz Categories Column */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-900 pb-1.5">Quiz Categories</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-semibold">
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Current Affairs</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">General Knowledge</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Reasoning</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Mathematics</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">English Grammar</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Hindi Vyakaran</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Computer</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Science</button></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-900 pb-1.5">Quick Links</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-semibold">
              <li><button onClick={() => onNavigateStatic("exams")} className="hover:text-white cursor-pointer transition-colors text-left">Free Mock Tests</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Daily Quiz</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Leaderboard</button></li>
              <li><button className="hover:text-white cursor-pointer transition-colors text-left">Blog & News</button></li>
              <li><button onClick={() => onNavigateStatic("editorial")} className="hover:text-white cursor-pointer transition-colors text-left">Exam Calendar</button></li>
              <li><button onClick={() => onNavigateStatic("disclaimer")} className="hover:text-white cursor-pointer transition-colors text-left text-amber-500">Admit Cards</button></li>
              <li><button onClick={() => onNavigateStatic("disclaimer")} className="hover:text-white cursor-pointer transition-colors text-left">Results</button></li>
              <li><button onClick={() => onNavigateStatic("disclaimer")} className="hover:text-white cursor-pointer transition-colors text-left">Answer Keys</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-900 pb-1.5">Company</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-semibold">
              <li><button onClick={() => onNavigateStatic("about")} className="hover:text-white cursor-pointer transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onNavigateStatic("contact")} className="hover:text-white cursor-pointer transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => onNavigateStatic("privacy")} className="hover:text-white cursor-pointer transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => onNavigateStatic("terms")} className="hover:text-white cursor-pointer transition-colors text-left">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigateStatic("disclaimer")} className="hover:text-white cursor-pointer transition-colors text-left font-bold text-orange-500">Disclaimer</button></li>
              <li><button onClick={() => onNavigateStatic("dmca")} className="hover:text-white cursor-pointer transition-colors text-left">DMCA Policy</button></li>
              <li><button onClick={() => onNavigateStatic("editorial")} className="hover:text-white cursor-pointer transition-colors text-left">Editorial Policy</button></li>
              <li><button onClick={() => onNavigateStatic("fact-check")} className="hover:text-white cursor-pointer transition-colors text-left">Fact Check Policy</button></li>
              <li><button onClick={() => onNavigateStatic("cookie")} className="hover:text-white cursor-pointer transition-colors text-left">Cookie Policy</button></li>
              <li><button onClick={() => onNavigateStatic("faq")} className="hover:text-white cursor-pointer transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => onNavigateStatic("help-center")} className="hover:text-white cursor-pointer transition-colors text-left font-bold text-blue-500">Help Center</button></li>
            </ul>
          </div>

        </div>

        {/* 3. Visual Trust Badge Ribbon */}
        <div className="max-w-7xl mx-auto pt-6 pb-4 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-[10px] text-slate-500 font-bold tracking-tight">
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>🔒</span> SSL Secured
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>✅</span> Adsense Approved
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>📱</span> Mobile Friendly
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>⚡</span> Fast Loading
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>♿</span> Accessible
          </div>
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 hover:text-white transition-colors">
            <span>🔍</span> SEO Optimized
          </div>
        </div>

        {/* 4. Bottom Legal Coordinates & Disclosures */}
        <div className="max-w-7xl mx-auto pt-4 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-600 font-medium text-center md:text-left">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} QuizRank India Portal. All rights reserved.</p>
            <p className="max-w-3xl text-[9px] leading-relaxed text-slate-700 font-medium uppercase tracking-wide">
              Disclaimer: QuizRank India is an independent educational platform and is not affiliated with any government organization, department, board or commissions like UPSC, SSC, RRB, IBPS etc. Quiz content is for practice purpose only. Always verify official notifications.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-600">Secure Candidate Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
