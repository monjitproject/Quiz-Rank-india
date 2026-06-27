/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, X, User, ChevronDown, Sparkles, BookOpen, LogOut, ShieldCheck, Sun, Moon, Map } from "lucide-react";
import { AppNotification, Quiz } from "../types";

interface HeaderProps {
  userName: string;
  onSetUserName: (name: string) => void;
  onNavigate: (view: string, arg?: any) => void;
  quizzes: Quiz[];
  onSelectQuiz: (quizId: string) => void;
}

export function Header({ userName, onSetUserName, onNavigate, quizzes, onSelectQuiz }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Quiz[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // Local notification state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Fetch alerts from backend
  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Notif fetch failed:", err));
    
    // Poll notifications every 10 seconds for real-time update feel
    const interval = setInterval(() => {
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(err => console.error(err));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter search queries
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = quizzes.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, quizzes]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Standard visual class toggle
    document.documentElement.classList.toggle("dark");
  };

  const handleSearchResultClick = (quizId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    onSelectQuiz(quizId);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-[11px] font-bold py-2 px-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/5">
        <div className="flex items-center gap-2 animate-pulse">
          <span>📢</span>
          <span className="tracking-wide">RRB NTPC 2025 Notification Released!</span>
          <button onClick={() => onNavigate("blog")} className="underline hover:text-blue-100 cursor-pointer">
            Read More
          </button>
        </div>
        <div className="flex items-center gap-4 text-blue-100/90">
          <button onClick={() => onNavigate("blog")} className="hover:text-white cursor-pointer transition-colors">Download App</button>
          <span className="text-white/20">|</span>
          <button onClick={() => onNavigate("static-page", "about")} className="hover:text-white cursor-pointer transition-colors">About</button>
          <span className="text-white/20">|</span>
          <button onClick={() => onNavigate("static-page", "contact")} className="hover:text-white cursor-pointer transition-colors">Contact</button>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all py-1">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md ring-2 ring-indigo-500/10 group-hover:scale-105 transition-transform">
                Q
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1">
                  QuizRank <span className="text-orange-500">India</span>
                  {!isOnline && (
                    <span className="ml-1 bg-amber-500/15 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                      Offline
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Govt Jobs Quiz Portal</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5">
              {/* Exams Mega Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className="text-slate-600 hover:text-indigo-600 font-bold text-xs inline-flex items-center gap-1 cursor-pointer py-2 transition-colors"
                >
                  Exams <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {megaMenuOpen && (
                  <div
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    className="absolute left-0 mt-1 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 grid grid-cols-1 gap-1 z-50"
                  >
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-50 mb-1">
                      Choose Exam Board
                    </span>
                    <button onClick={() => { setMegaMenuOpen(false); onNavigate("home"); }} className="text-left py-1.5 px-2 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                      SSC Exams (GD/CGL/CHSL)
                    </button>
                    <button onClick={() => { setMegaMenuOpen(false); onNavigate("home"); }} className="text-left py-1.5 px-2 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                      Railways NTPC & Group D
                    </button>
                    <button onClick={() => { setMegaMenuOpen(false); onNavigate("home"); }} className="text-left py-1.5 px-2 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                      UPSC Central Services
                    </button>
                  </div>
                )}
              </div>

              {/* Subjects Toggle */}
              <button
                onClick={() => onNavigate("home")}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Subjects
              </button>

              <button
                onClick={() => onNavigate("home")}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Mock Tests
              </button>

              <button
                onClick={() => onNavigate("home")}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Daily Quiz
              </button>

              <button
                onClick={() => onNavigate("leaderboard")}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Leaderboard
              </button>

              <button
                onClick={() => onNavigate("blog")}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Blog
              </button>
            </nav>
          </div>

          {/* Search bar inside header */}
          <div className="hidden md:block flex-1 max-w-xs relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search quizzes, e.g. SSC GD, Reasoning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-full py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 font-semibold"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 space-y-2 z-50">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1.5">
                  Found {searchResults.length} Match Tests
                </span>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {searchResults.map(q => (
                    <button
                      key={q.id}
                      onClick={() => handleSearchResultClick(q.id)}
                      className="w-full text-left py-2 hover:bg-slate-50 px-2 rounded-lg flex justify-between items-center text-xs transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 block">{q.title}</span>
                        <span className="text-[10px] text-slate-400">{q.description}</span>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase shrink-0">
                        Solve
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions & Credentials (Bell, Moon, Register) */}
          <div className="flex items-center gap-3">
            {/* Search toggler for mobile */}
            <button className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full cursor-pointer">
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 space-y-2.5 z-50 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Recent Notices & Updates
                    </span>
                    <button onClick={markAllAsRead} className="text-[9px] text-indigo-600 font-bold hover:underline cursor-pointer">
                      Mark as read
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No new notices at this time.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2.5 border rounded-xl transition-colors ${n.isRead ? "bg-slate-50/50 border-slate-100" : "bg-indigo-50/45 border-indigo-100"}`}>
                          <span className="font-extrabold text-slate-800 text-[11px] block flex items-center justify-between">
                            {n.title}
                            {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block"></span>}
                          </span>
                          <span className="text-slate-500 text-[10px] mt-0.5 block leading-relaxed">{n.message}</span>
                          <span className="text-[8px] text-slate-400 font-mono mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Candidate Profile Avatar / Auth Buttons */}
            {userName ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer text-slate-700 border border-slate-100 pr-3"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                    {userName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-black truncate max-w-[90px] text-slate-700">
                    {userName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthType("login");
                    setAuthModalOpen(true);
                    setAuthSuccessMsg("");
                    setNotifDropdownOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="text-slate-700 hover:text-indigo-600 font-extrabold text-xs px-3 py-2 cursor-pointer transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthType("register");
                    setAuthModalOpen(true);
                    setAuthSuccessMsg("");
                    setNotifDropdownOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-full cursor-pointer transition-all shadow-sm shadow-indigo-600/10 hover:-translate-y-0.5 shrink-0"
                >
                  Register
                </button>
              </div>
            )}

            {/* Candidate Identity configuration drawer trigger if clicked */}
            {profileDropdownOpen && (
              <div className="absolute right-4 mt-16 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl p-3 space-y-2 z-50">
                <div className="p-2 border-b border-slate-50">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Switch Profile Name</span>
                  <input
                    type="text"
                    placeholder="Candidate Name..."
                    value={userName}
                    onChange={(e) => onSetUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] outline-none font-bold"
                  />
                </div>
                <button
                  onClick={() => { setProfileDropdownOpen(false); onNavigate("dashboard"); }}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" /> Prep Dashboard
                </button>
                <button
                  onClick={() => { setProfileDropdownOpen(false); onNavigate("admin"); }}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-2 cursor-pointer border-t border-slate-50"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Admin Console
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSetUserName("");
                  }}
                  className="w-full text-left p-2 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer border-t border-slate-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> Logout Profile
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 absolute top-16 left-0 right-0 z-50 shadow-lg">
            <div className="flex flex-col gap-2.5 text-sm font-semibold text-slate-600 pl-2">
              <button onClick={() => { setMobileMenuOpen(false); onNavigate("home"); }} className="text-left py-1">Home Portal</button>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate("leaderboard"); }} className="text-left py-1">Leaderboards</button>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate("blog"); }} className="text-left py-1">Notice Blog</button>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate("dashboard"); }} className="text-left py-1 text-blue-600">My Dashboard</button>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate("admin"); }} className="text-left py-1 text-indigo-600">Admin Console</button>
            </div>
          </div>
        )}

        {/* Real Authentic Login & Register Modal */}
        {authModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto font-black text-xl mb-3">
                    Q
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {authType === "login" ? "Aspirant Secure Login" : "Create Candidate Account"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {authType === "login"
                      ? "Log in to view mock histories, predicted ranks and bookmark stats."
                      : "Register today and receive free mock updates in Hindi and English."}
                  </p>
                </div>

                {authSuccessMsg ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center text-xs text-emerald-800 space-y-3">
                    <p className="font-bold">🎉 {authSuccessMsg}</p>
                    <button
                      onClick={() => setAuthModalOpen(false)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs"
                    >
                      Continue to Portal
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!authName.trim()) return;
                      onSetUserName(authName.trim());
                      setAuthSuccessMsg(
                        authType === "login"
                          ? `Welcome back, ${authName}! Successfully logged in.`
                          : `Account created for ${authName}! Welcome to QuizRank India.`
                      );
                      // Send successful notification
                      fetch("/api/notifications", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: `Welcome, ${authName}!`,
                          message: authType === "login" ? "Successfully logged in to Candidate Portal." : "Registered brand-new candidate profile.",
                          type: "success"
                        })
                      }).catch(() => {});
                    }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Candidate Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Rahul Kumar"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition-all"
                      />
                    </div>

                    {authType === "register" && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="rahul@example.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition-all"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
                    >
                      {authType === "login" ? "Login to Dashboard" : "Register Profile"}
                    </button>

                    <div className="text-center text-[10px] font-semibold text-slate-400 mt-2">
                      {authType === "login" ? (
                        <p>
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => { setAuthType("register"); setAuthSuccessMsg(""); }}
                            className="text-indigo-600 hover:underline"
                          >
                            Register here
                          </button>
                        </p>
                      ) : (
                        <p>
                          Already registered?{" "}
                          <button
                            type="button"
                            onClick={() => { setAuthType("login"); setAuthSuccessMsg(""); }}
                            className="text-indigo-600 hover:underline"
                          >
                            Login here
                          </button>
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
